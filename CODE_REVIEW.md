# BuildForJob — Code Quality & Security Review

**Date:** 2026-07-12
**Scope:** Full monorepo — `builtforjob-be` (Express/Bun backend), `BuildForJob-FE` (Next.js frontend), `admin` (React admin panel)
**Reviewer:** Automated deep-review via Antigravity AI

---

## Executive Summary

The BuildForJob project is a well-structured, feature-rich application, but it carries **several critical and high-risk security vulnerabilities** that must be resolved before any production hardening can be considered complete.

| Risk Level   | Count |
|--------------|-------|
| Critical     | 5     |
| High         | 7     |
| Medium       | 9     |
| Low / Info   | 6     |
| **Total**    | **27** |

### Key findings at a glance

1. **All API secrets and credentials are committed in plaintext** inside `.env` and `.env.prod` files in the repository. These include database credentials, JWT secrets, external API keys (Gemini, Groq, HuggingFace, ImageKit, Google OAuth, Resend). **These must be rotated immediately.**
2. **The JWT secret is trivially guessable** (`"rupeshwillbepro"`) — making the entire authentication system bypassable by forging tokens.
3. The **custom in-memory rate limiter is bypassable** under horizontal scaling and leaks IP addresses from untrusted headers.
4. **OTP codes are generated with `Math.random()`**, which is cryptographically insecure.
5. The **admin panel stores the JWT in `localStorage`**, making it susceptible to XSS token theft.
6. **No security headers** (HSTS, CSP, X-Frame-Options, etc.) are configured anywhere.
7. The **error middleware leaks internal database/stack details** to API clients in certain error paths.
8. The **password-reset flow uses a regular auth JWT** instead of a purpose-limited, single-use token stored in the database.

---

## Category 1 — Secrets Management & Configuration

### CRIT-01 · Real credentials committed to version control

| Attribute | Detail |
|-----------|--------|
| **Risk** | CRITICAL |
| **Files** | `builtforjob-be/.env`, `builtforjob-be/.env.prod` |

**Explanation**

Both `.env` and `.env.prod` contain live, production-grade secrets:
- PostgreSQL database connection string with plaintext password
- Resend API key
- Google OAuth client secret
- Gemini, Groq, and HuggingFace API keys
- ImageKit private key

The `.gitignore` correctly lists these files, **but they already exist in the repository working tree and may have been committed historically**. Anyone with access to Git history can retrieve them.

**Recommended Improvement**

1. **Immediately rotate every exposed credential** listed above.
2. Verify they have never been committed: `git log --all --full-history -- .env`
3. If they were committed, use `git filter-repo` or BFG Repo Cleaner to purge the history.
4. Use a secrets manager (e.g., Doppler, AWS Secrets Manager, HashiCorp Vault) or at minimum inject secrets via your CI/CD platform's environment variable injection.
5. Add a pre-commit hook (e.g., `gitleaks`, `detect-secrets`) to prevent future leaks.

---

### CRIT-02 · Trivially weak JWT secret

| Attribute | Detail |
|-----------|--------|
| **Risk** | CRITICAL |
| **Files** | `builtforjob-be/.env`, `builtforjob-be/.env.prod`, `builtforjob-be/src/config/jwt.config.ts` |

**Explanation**

The JWT secret in both development and production is `"rupeshwillbepro"`. This is an extremely low-entropy, dictionary-word-based secret. An attacker can brute-force it with `hashcat` in seconds to forge arbitrary tokens and impersonate any user or admin.

```ts
// jwt.config.ts — current (vulnerable)
export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  // The real .env value "rupeshwillbepro" is equally weak
};
```

**Recommended Improvement**

Replace with a minimum 256-bit random secret. Generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Ensure the startup guard also validates minimum length:

```ts
// jwt.config.ts — recommended
const secret = process.env.JWT_SECRET;
if (!secret || secret.length < 64) {
  throw new Error('JWT_SECRET must be defined and at least 64 characters long');
}
export const jwtConfig = { secret, expiresIn: process.env.JWT_EXPIRES_IN || '7d' };
```

---

### HIGH-01 · `.env.example` ignored by git, malformed, and incomplete

| Attribute | Detail |
|-----------|--------|
| **Risk** | HIGH |
| **Files** | `builtforjob-be/.env.example`, `builtforjob-be/.gitignore` |

**Explanation**

The `.gitignore` currently lists `.env.example` as a file to ignore (line 37), defeating its entire purpose — it cannot be tracked in git and therefore cannot help new developers. Additionally, the file contains a malformed `DATABASE_URL` with mismatched quotes, and is missing all AI/OAuth key placeholders.

**Recommended Improvement**

- Remove `.env.example` from `.gitignore` so it is tracked.
- Fix all placeholder values and include every required key (Gemini, Groq, ImageKit, Google/GitHub OAuth, etc.).
- Add a startup validator (`src/config/env.validator.ts`) that checks all required env vars at boot time.

---

## Category 2 — Authentication & Authorization

### CRIT-03 · Password-reset uses a reusable auth JWT, not a single-use token

| Attribute | Detail |
|-----------|--------|
| **Risk** | CRITICAL |
| **Files** | `builtforjob-be/src/controllers/auth/forgot-password.controller.ts` |

**Explanation**

The password reset flow generates a standard session JWT and embeds it in the reset URL. This has multiple problems:

1. The token is not persisted to the database — there is **no way to invalidate it** once issued.
2. If the same user requests a reset twice, both links are valid simultaneously.
3. The token is not single-use — it can be replayed after the first use within the 1-hour window.
4. The schema even has a `PasswordResetToken` model defined in Prisma which is **never used**.

```ts
// forgot-password.controller.ts — current (vulnerable)
const resetToken = generateToken({ userId: user.id, email: user.email }, '1h');
await sendPasswordResetEmail(email, resetToken, user.firstName);
// Token is never stored — cannot be invalidated or marked used
```

**Recommended Improvement**

Use the existing `PasswordResetToken` Prisma model with a cryptographically random token:

```ts
import crypto from 'crypto';

const rawToken = crypto.randomBytes(32).toString('hex');
const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

await prisma.passwordResetToken.updateMany({
  where: { userId: user.id, isUsed: false },
  data: { isUsed: true }
});

await prisma.passwordResetToken.create({
  data: { userId: user.id, token: rawToken, expiresAt }
});

const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;
```

On the reset endpoint: look up the token, verify `isUsed === false` and `expiresAt > now`, mark it used, then allow the password change.

---

### HIGH-02 · Admin login returns the JWT token in the response body

| Attribute | Detail |
|-----------|--------|
| **Risk** | HIGH |
| **Files** | `builtforjob-be/src/controllers/admin/admin.controller.ts` (line 38), `admin/src/Login.tsx` (line 29) |

**Explanation**

Unlike user login, `adminLogin` returns the JWT in the JSON response body in addition to setting a cookie. The admin panel then stores this token in `localStorage`. `localStorage` is accessible to all JavaScript on the page, making it vulnerable to XSS attacks.

```ts
// admin.controller.ts — vulnerable
return res.json({
  success: true,
  data: { token, admin: { ... } } // token exposed in response body
});
```

```ts
// admin/src/Login.tsx — vulnerable
localStorage.setItem('admin_token', token); // susceptible to XSS theft
```

**Recommended Improvement**

Remove `token` from the response body. The `httpOnly` cookie set on the same response is the correct secure transport. Update the admin axios interceptor to rely solely on cookies (`withCredentials: true` is already set).

```ts
// admin.controller.ts — recommended
return res.json({
  success: true,
  data: { admin: { id: admin.id, email: admin.email, name: admin.name } }
  // No token in body
});
```

---

### HIGH-03 · No protection against OTP brute-force

| Attribute | Detail |
|-----------|--------|
| **Risk** | HIGH |
| **Files** | `builtforjob-be/src/controllers/auth/verify-otp.controller.ts` |

**Explanation**

A 6-digit numeric OTP has only 1,000,000 possible values. There is no attempt counter, no lockout policy, and the OTP verify endpoint is not protected by the `authRateLimiter`. An attacker can enumerate all combinations far faster than the 10-minute expiry window allows.

**Recommended Improvement**

1. Apply `authRateLimiter` to the OTP verify endpoint.
2. Add an attempt counter per `email+type` in the `OTP` model (add `attempts Int @default(0)`).
3. Mark the OTP as permanently used/expired after 5 failed attempts.

```ts
if (otpRecord.attempts >= 5) {
  await prisma.oTP.update({ where: { id: otpRecord.id }, data: { isUsed: true } });
  return res.status(429).json({ success: false, message: 'Too many failed attempts. Request a new OTP.' });
}
```

---

### HIGH-04 · `x-forwarded-for` header trusted unconditionally in rate limiter

| Attribute | Detail |
|-----------|--------|
| **Risk** | HIGH |
| **Files** | `builtforjob-be/src/middlewares/rate-limit/rate-limiter.ts` (line 27) |

**Explanation**

The custom rate limiter reads the client IP from `req.headers['x-forwarded-for']` first. This header is trivially spoofable by any client unless the backend is behind a trusted reverse proxy. An attacker can send `X-Forwarded-For: 1.2.3.4` to cycle through fake IPs and bypass the rate limiter entirely.

```ts
// rate-limiter.ts — vulnerable
const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || 'unknown';
```

Additionally, this rate limiter is in-memory and per-process — it provides no protection across multiple server instances or restarts.

**Recommended Improvement**

1. Replace the custom implementation with `express-rate-limit` + `rate-limit-redis`.
2. Configure Express's trust proxy setting:

```ts
// app.ts
app.set('trust proxy', 1); // trust first proxy only
```

Then use `req.ip` (already normalized by Express) rather than reading the header directly.

---

### MEDIUM-01 · `resendOtp` reveals whether a user account exists (user enumeration)

| Attribute | Detail |
|-----------|--------|
| **Risk** | MEDIUM |
| **Files** | `builtforjob-be/src/controllers/auth/resend-otp.controller.ts` (line 15) |

**Explanation**

The resend OTP endpoint returns `404 User not found` if the email doesn't exist, enabling attackers to enumerate valid email addresses. Note: `forgotPassword` correctly avoids this by always returning success, but `resendOtp` does not.

**Recommended Improvement**

```ts
// Return the same generic success response regardless of whether the email exists
if (!user) {
  return res.json({ success: true, message: 'If this email is registered, a new OTP will be sent.' });
}
```

---

### MEDIUM-02 · No per-account lockout on failed login attempts

| Attribute | Detail |
|-----------|--------|
| **Risk** | MEDIUM |
| **Files** | `builtforjob-be/src/controllers/auth/login.controller.ts` |

**Explanation**

While `authRateLimiter` applies at the IP level, there is no per-account lockout after N consecutive wrong passwords. An attacker using a distributed botnet (many IPs, one target account) can brute-force passwords without triggering the rate limiter.

**Recommended Improvement**

Track failed login attempts per user account in the database (add `loginAttempts Int @default(0)` and `lockedUntil DateTime?` fields to the `User` model). Lock the account for progressive backoff after 5-10 failures.

---

## Category 3 — Cryptography

### CRIT-04 · OTP generated with `Math.random()` (cryptographically insecure)

| Attribute | Detail |
|-----------|--------|
| **Risk** | CRITICAL |
| **Files** | `builtforjob-be/src/utils/otp.util.ts` |

**Explanation**

OTP codes are generated with JavaScript's `Math.random()`, which is a pseudo-random number generator (PRNG) **not suitable for security purposes**. Its output is predictable if the internal state can be observed or seeded.

```ts
// otp.util.ts — vulnerable
export function generateOTPCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
```

**Recommended Improvement**

Use Node.js's `crypto.randomInt()` which is cryptographically secure:

```ts
import { randomInt } from 'crypto';

export function generateOTPCode(): string {
  return randomInt(100000, 1000000).toString();
}
```

---

### LOW-01 · No upper-bound on password length (bcrypt DoS vector)

| Attribute | Detail |
|-----------|--------|
| **Risk** | LOW |
| **Files** | `builtforjob-be/src/services/hash/hash.service.ts`, `builtforjob-be/src/validators/auth.validator.ts` |

**Explanation**

bcrypt truncates input at 72 bytes. Accepting very long passwords (e.g., 10,000+ characters) causes CPU-intensive computation that can be abused for DoS. The current validators only enforce a minimum length.

**Recommended Improvement**

```ts
password: z.string().min(8).max(128, 'Password must be at most 128 characters'),
```

---

## Category 4 — Sensitive Data Exposure & Logging

### HIGH-05 · Error middleware may expose internal DB error messages in production

| Attribute | Detail |
|-----------|--------|
| **Risk** | HIGH |
| **Files** | `builtforjob-be/src/middlewares/error/error.middleware.ts` (line 36) |

**Explanation**

The error handler catches Prisma/DB errors and sets the message to `err.message` for 500-class errors. If the error message contains internal database paths, table names, or SQL fragments, they get returned to the client.

```ts
// error.middleware.ts — potentially leaking
message = err.message || 'Something went wrong. Please try again.';
// err.message could be e.g. "invalid input syntax for type uuid: ..."
```

**Recommended Improvement**

Always use a generic message for 500 errors in production:

```ts
if (statusCode >= 500) {
  console.error('[Internal Error]', err.message, err.stack);
  message = 'An internal server error occurred. Please try again later.';
}
```

---

### HIGH-06 · Raw error object exposed in JWT auth failure response

| Attribute | Detail |
|-----------|--------|
| **Risk** | HIGH |
| **Files** | `builtforjob-be/src/middlewares/auth/jwt.middleware.ts` (line 62) |

**Explanation**

When token validation fails, the raw error object is included in the JSON response body:

```ts
// jwt.middleware.ts — vulnerable
return res.status(401).json({
  success: false,
  message: 'Invalid or expired token',
  error: error,  // <-- raw error object exposed to client
});
```

This can leak internal library information (jsonwebtoken error codes, algorithm names) that aids attackers in fingerprinting the system.

**Recommended Improvement**

```ts
return res.status(401).json({
  success: false,
  message: 'Invalid or expired token',
  // Remove the 'error' field entirely
});
```

---

### MEDIUM-03 · Full resume text (PII) stored unencrypted in the database

| Attribute | Detail |
|-----------|--------|
| **Risk** | MEDIUM |
| **Files** | `builtforjob-be/prisma/schema.prisma` (AtsReport.resumeText), `builtforjob-be/src/controllers/ats/check-ats.controller.ts` |

**Explanation**

The full extracted text of a user's resume — including personal contact information (name, phone, address, email) — is stored verbatim in the `ats_reports.resumeText` column as plain text. In the event of a database breach, all user PII from resumes is exposed.

**Recommended Improvement**

Consider encrypting the `resumeText` column at the application layer before storing, or evaluate whether storing the full text is strictly necessary at all (it is used for AI suggestions but could be re-extracted from the stored PDF URL on demand).

---

### MEDIUM-04 · User PII sent to third-party AI services without documented DPA

| Attribute | Detail |
|-----------|--------|
| **Risk** | MEDIUM |
| **Files** | `builtforjob-be/src/services/ats/ats.service.ts`, `builtforjob-be/src/controllers/ai/optimize.controller.ts` |

**Explanation**

Full resume text containing PII (name, contact details, work history) is sent to Groq and Google Gemini APIs as plain text in API prompts. Depending on the data processing agreements with these third parties, this data may be retained in logs or used for model training.

**Recommended Improvement**

- Review the data processing agreements (DPAs) for Groq and Google Gemini.
- Inform users in the Privacy Policy that their resume data is processed by third-party AI services.
- If possible, use enterprise API tiers that explicitly prohibit data retention/training.

---

## Category 5 — Network & API Security

### CRIT-05 · No security HTTP headers configured on backend or frontend

| Attribute | Detail |
|-----------|--------|
| **Risk** | CRITICAL |
| **Files** | `builtforjob-be/src/app.ts`, `BuildForJob-FE/next.config.ts` |

**Explanation**

Neither the backend nor the Next.js frontend configures any security-related HTTP headers:

- **Backend:** No `helmet` middleware — missing `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy`, `Referrer-Policy`, `Permissions-Policy`.
- **Frontend:** `next.config.ts` is completely empty — no `headers()` for CSP, HSTS, etc.

Without these headers, the application is vulnerable to clickjacking, MIME-type sniffing attacks, and XSS.

**Recommended Improvement**

**Backend** — install `helmet`:

```bash
bun add helmet
```

```ts
// app.ts
import helmet from 'helmet';
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://ik.imagekit.io"],
      connectSrc: ["'self'"],
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }
}));
```

**Frontend** — add to `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      ]
    }];
  }
};
```

---

### MEDIUM-05 · CORS allows all localhost origins including in production

| Attribute | Detail |
|-----------|--------|
| **Risk** | MEDIUM |
| **Files** | `builtforjob-be/src/app.ts` (lines 20-34) |

**Explanation**

The `allowedOrigins` array includes `http://localhost:3000`, `http://localhost:5173`, and `http://localhost:3001`. In a production deployment, any local app running on those ports on a user's machine could make credentialed cross-origin requests to the production API.

**Recommended Improvement**

```ts
const allowedOrigins = [
  "https://build-for-job-fe.vercel.app",
  'https://buildforjob.rupeshhh.in',
];
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push("http://localhost:3000", "http://localhost:5173", "http://localhost:3001");
}
```

---

### MEDIUM-06 · OAuth state parameter missing (CSRF attack surface)

| Attribute | Detail |
|-----------|--------|
| **Risk** | MEDIUM |
| **Files** | `builtforjob-be/src/controllers/auth/oauth.controller.ts` |

**Explanation**

The Google and GitHub OAuth implementations do not include a `state` parameter in the authorization request. The OAuth2 `state` parameter is the standard mechanism to prevent CSRF attacks on the OAuth flow. Without it, an attacker can trick a user into completing an OAuth login that links the attacker's OAuth account to the victim's application account.

**Recommended Improvement**

Generate and validate a random state token per OAuth initiation:

```ts
// On initiation
import { randomBytes } from 'crypto';
const state = randomBytes(16).toString('hex');
res.cookie('oauth_state', state, { httpOnly: true, maxAge: 5 * 60 * 1000 });
const options = { ...existingOptions, state };

// On callback
const { code, state } = req.query;
if (state !== req.cookies.oauth_state) {
  return res.status(403).json({ success: false, message: 'Invalid state parameter' });
}
res.clearCookie('oauth_state');
```

---

### MEDIUM-07 · File upload MIME type validation is client-controlled (spoofable)

| Attribute | Detail |
|-----------|--------|
| **Risk** | MEDIUM |
| **Files** | `builtforjob-be/src/controllers/user/upload-file.controller.ts`, `builtforjob-be/src/routes/ats/ats.routes.ts` |

**Explanation**

File type validation checks `file.mimetype` which is taken from the `Content-Type` header supplied by the client — easily spoofable. A malicious file could be uploaded with `Content-Type: application/pdf` while containing executable content. The `/user/file` endpoint routes to image or PDF folders based purely on this unvalidated mimetype.

**Recommended Improvement**

Validate the actual file magic bytes using the `file-type` library:

```bash
bun add file-type
```

```ts
import { fileTypeFromBuffer } from 'file-type';

const type = await fileTypeFromBuffer(file.buffer);
if (!type || type.mime !== 'application/pdf') {
  return res.status(400).json({ success: false, message: 'Invalid file. Only PDFs are accepted.' });
}
```

---

### LOW-02 · Admin axios instance hardcodes `localhost` base URL

| Attribute | Detail |
|-----------|--------|
| **Risk** | LOW |
| **Files** | `admin/src/axiosInstance.ts` (line 4) |

**Explanation**

The admin panel's axios instance hardcodes `http://localhost:8080` as the base URL. If the admin panel is ever deployed, it will attempt to connect to `localhost` on the deployed machine rather than the actual API server.

**Recommended Improvement**

```ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  withCredentials: true,
});
```

---

## Category 6 — Input Validation & Error Handling

### MEDIUM-08 · Admin user CRUD endpoints lack Zod schema validation

| Attribute | Detail |
|-----------|--------|
| **Risk** | MEDIUM |
| **Files** | `builtforjob-be/src/routes/admin/admin.routes.ts`, `builtforjob-be/src/controllers/admin/admin.controller.ts` |

**Explanation**

The admin routes for creating and updating users perform only basic `if (!email || !password...)` manual checks. Fields like `tokens`, `plan`, and `bio` are accepted without sanitization or length limits. The existing Zod `validate()` middleware is not applied to any admin route.

**Recommended Improvement**

Create `src/validators/admin.validator.ts` with Zod schemas and apply the `validate()` middleware to all admin mutation routes:

```ts
adminRouter.post('/users', authenticateAdmin, validate(createUserSchema), createUser);
adminRouter.put('/users/:id', authenticateAdmin, validate(updateUserSchema), updateUser);
```

---

### MEDIUM-09 · `updateProfile` accepts user-supplied `avatarUrl` string without validation

| Attribute | Detail |
|-----------|--------|
| **Risk** | MEDIUM |
| **Files** | `builtforjob-be/src/controllers/user/update-profile.controller.ts` (line 17) |

**Explanation**

The `allowedFields` array in `updateProfile` includes `avatarUrl`, meaning any user can set their avatar to an arbitrary URL — not just ImageKit-hosted content. This could enable stored open redirects or malicious URLs that are rendered in other users' browsers (e.g., in public portfolio views).

**Recommended Improvement**

Remove `avatarUrl` from the `updateProfile` allowed fields. Avatar updates should only flow through the dedicated `/user/avatar` endpoint which uploads to ImageKit and returns a verified URL.

---

### LOW-03 · `ats.service.ts` uses CommonJS `require()` in an ESM codebase

| Attribute | Detail |
|-----------|--------|
| **Risk** | LOW (Maintainability) |
| **Files** | `builtforjob-be/src/services/ats/ats.service.ts` (line 3) |

**Explanation**

```ts
const { PDFParse } = require('pdf-parse');
```

The rest of the codebase uses ES module `import` syntax. This CommonJS `require()` call is inconsistent, bypasses TypeScript type-checking for this import, and will cause issues if the project moves to strict ESM.

**Recommended Improvement**

Use a Bun/ESM-compatible PDF parsing library or use a dynamic import as a workaround:

```ts
// Option: dynamic import workaround
const pdfParse = await import('pdf-parse');
```

---

## Category 7 — Dependency Health

### LOW-04 · Key dependencies are outdated or unmaintained

| Attribute | Detail |
|-----------|--------|
| **Risk** | LOW |
| **Files** | `builtforjob-be/package.json`, `BuildForJob-FE/package.json` |

**Analysis**

| Package | Pinned | Status | Notes |
|---------|--------|--------|-------|
| `express` | `^4.19.2` | Active (v5 available) | Consider Express 5 migration |
| `bcryptjs` | `^2.4.3` | Minimal maintenance | Consider `argon2` for new projects |
| `@prisma/client` | `^5.19.0` | Keep updated | Security patches in minor versions |
| `html2canvas` | `^1.4.1` | Last updated 2022 | No active maintenance |
| `jsonwebtoken` | `^9.0.2` | Stable | Latest in v9 series |

**Recommended Improvement**

- Run `bun outdated` regularly; pin to specific patch versions in production.
- Consider migrating from `bcryptjs` to `argon2` (memory-hard, GPU-resistant, modern OWASP recommendation).
- Enable Dependabot or Renovate for automated dependency update PRs.

---

### LOW-05 · No CI/CD pipeline or automated security audits

| Attribute | Detail |
|-----------|--------|
| **Risk** | LOW |
| **Files** | (No CI configuration found in repository) |

**Explanation**

There is no CI/CD pipeline configuration in the repository. No automated security audits, lint checks, type-checks, or dependency vulnerability scans run on pull requests.

**Recommended Improvement**

Add a GitHub Actions security workflow:

```yaml
# .github/workflows/security.yml
name: Security Audit
on: [push, pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
        working-directory: builtforjob-be
      - run: bun audit
        working-directory: builtforjob-be
```

---

## Category 8 — File Handling & Docker

### MEDIUM-10 · No file size limit on the general `/user/file` upload endpoint

| Attribute | Detail |
|-----------|--------|
| **Risk** | MEDIUM |
| **Files** | `builtforjob-be/src/controllers/user/upload-file.controller.ts` |

**Explanation**

The ATS routes enforce a 5MB file size limit via multer, but the general `/user/file` upload endpoint (used for portfolio images and resumes) may lack any size limit. Since `multer.memoryStorage()` buffers files entirely in RAM, large uploads can exhaust server memory.

**Recommended Improvement**

Ensure every multer instance has explicit limits and file type allowlisting:

```ts
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    cb(null, allowed.includes(file.mimetype));
  }
});
```

---

### LOW-06 · Docker container runs as root

| Attribute | Detail |
|-----------|--------|
| **Risk** | LOW |
| **Files** | `builtforjob-be/Dockerfile` |

**Explanation**

The Dockerfile does not specify a `USER` instruction, meaning the application runs as `root` inside the container. If the application is compromised, the attacker has root privileges within the container, increasing blast radius and the risk of container escape.

**Recommended Improvement**

```dockerfile
FROM oven/bun:1-slim AS base
WORKDIR /usr/src/app

COPY package.json bun.lock ./
COPY prisma ./prisma/
RUN bun install --frozen-lockfile

COPY src ./src
COPY entrypoint.js ./

# Create and use a non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser

EXPOSE 8080
ENV NODE_ENV=production
ENTRYPOINT ["bun", "run", "./entrypoint.js"]
CMD ["bun", "run", "start"]
```

---

## Category 9 — General Maintainability & Code Quality

### INFO-01 · In-memory rate limiter is ineffective under horizontal scaling

| Attribute | Detail |
|-----------|--------|
| **Risk** | MEDIUM (Architecture) |
| **Files** | `builtforjob-be/src/middlewares/rate-limit/rate-limiter.ts` |

**Explanation**

The custom rate limiter uses an in-memory `Map`. When the application scales horizontally (multiple processes), each process maintains its own counter. Users can bypass the rate limit by distributing requests across processes. Restarting the server also resets all counters.

**Recommended Improvement**

Replace with `express-rate-limit` + `rate-limit-redis` for shared, persistent state across all instances. This also provides proper `Retry-After` response headers automatically.

---

### INFO-02 · `deductTokens` has a race condition allowing free token usage

| Attribute | Detail |
|-----------|--------|
| **Risk** | MEDIUM (Business Logic) |
| **Files** | `builtforjob-be/src/utils/token.utils.ts` |

**Explanation**

The `deductTokens` function reads the user's token balance and then updates it in two separate database round-trips. Under concurrent requests, a user could trigger multiple AI operations simultaneously — all reading the same balance before any deduction is committed — and all succeeding.

```ts
// Vulnerable to race condition:
const user = await prisma.user.findUnique({ ... }); // Read
// <<< Another request could read the same balance here >>>
if (user.tokens < amount) throw new Error(...);
await prisma.user.update({ ... }); // Write
```

**Recommended Improvement**

Use an atomic `updateMany` with a balance check in the `where` clause:

```ts
const updated = await prisma.user.updateMany({
  where: { id: userId, tokens: { gte: amount } },
  data: { tokens: { decrement: amount } },
});
if (updated.count === 0) {
  throw new Error('Insufficient tokens.');
}
```

---

### INFO-03 · `OTPType` enum mismatch between Prisma schema and Zod validator

| Attribute | Detail |
|-----------|--------|
| **Risk** | LOW (Schema Mismatch) |
| **Files** | `builtforjob-be/prisma/schema.prisma` (line 223), `builtforjob-be/src/validators/auth.validator.ts` (line 41) |

**Explanation**

The auth validator for resend OTP accepts `type: z.enum(['REGISTRATION', 'PASSWORD_RESET', 'LOGIN'])`, but the Prisma `OTPType` enum only defines `REGISTRATION` and `PASSWORD_RESET`. Passing `LOGIN` as the type would cause a Prisma runtime validation error.

**Recommended Improvement**

Either add `LOGIN` to the Prisma `OTPType` enum (and run a migration), or remove `'LOGIN'` from the Zod validator to match the actual schema.

---

## Remediation Priority Matrix

| # | Finding | Risk | Effort | Priority |
|---|---------|------|--------|----------|
| 1 | Rotate all exposed credentials (CRIT-01) | CRITICAL | Low | **Immediate** |
| 2 | Replace weak JWT secret (CRIT-02) | CRITICAL | Low | **Immediate** |
| 3 | Add security headers — helmet + Next.js (CRIT-05) | CRITICAL | Low | **This sprint** |
| 4 | Fix password reset to use single-use DB token (CRIT-03) | CRITICAL | Medium | **This sprint** |
| 5 | Use `crypto.randomInt()` for OTP generation (CRIT-04) | CRITICAL | Low | **This sprint** |
| 6 | Remove JWT token from admin login response body (HIGH-02) | HIGH | Low | **This sprint** |
| 7 | Add OTP brute-force protection / attempt counter (HIGH-03) | HIGH | Medium | **This sprint** |
| 8 | Fix rate limiter IP spoofing vulnerability (HIGH-04) | HIGH | Low | **This sprint** |
| 9 | Strip error object from JWT failure responses (HIGH-06) | HIGH | Low | **This sprint** |
| 10 | Sanitize error middleware 500 responses (HIGH-05) | HIGH | Low | **This sprint** |
| 11 | Add OAuth state parameter for CSRF protection (MEDIUM-06) | MEDIUM | Medium | Next sprint |
| 12 | Replace in-memory rate limiter with Redis-backed (INFO-01) | MEDIUM | High | Next sprint |
| 13 | Fix token deduction race condition (INFO-02) | MEDIUM | Low | Next sprint |
| 14 | Remove `avatarUrl` from profile update endpoint (MEDIUM-09) | MEDIUM | Low | Next sprint |
| 15 | MIME type magic byte validation for uploads (MEDIUM-07) | MEDIUM | Medium | Next sprint |
| 16 | Fix CORS to exclude localhost in production (MEDIUM-05) | MEDIUM | Low | Next sprint |
| 17 | Add Zod validation to admin endpoints (MEDIUM-08) | MEDIUM | Medium | Next sprint |
| 18 | Remaining medium/low items | MEDIUM/LOW | Various | Backlog |

---

*This report was generated by static code analysis. It does not replace a full penetration test. All findings should be verified by a security engineer before deployment to production.*
