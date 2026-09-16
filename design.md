# BuildForJob - System Design Document

## 1. Project Overview

**BuildForJob** is a comprehensive AI-powered job application assistant platform that helps job seekers optimize their resumes, generate tailored cover letters, and track their applications. The platform provides ATS (Applicant Tracking System) matching, resume building, portfolio creation, and application management.

### Core Purpose
- Empower job seekers with AI tools to create compelling application materials
- Optimize resumes for ATS systems
- Generate personalized cover letters
- Track and manage job applications
- Build professional portfolios
- Provide data-driven insights for job search success

---

## 2. Architecture Overview

BuildForJob follows a **monorepo structure** with three main applications:

```
buildforjob/
├── BuildForJob-FE/      # Next.js 16 Frontend (Main App)
├── builtforjob-be/      # Bun + Express Backend
├── admin/               # Bun + React Admin Panel
└── docs/                # Project documentation
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js 16)                       │
│  BuildForJob-FE - User Dashboard, Resume/Cover Letter Builder  │
└────────────────────┬────────────────────────────────────────────┘
                     │ HTTP/REST API (Axios)
                     │ Cookies & JWT Authentication
┌────────────────────▼────────────────────────────────────────────┐
│         Backend (Bun + Express) - API Server                    │
│  - Authentication & Authorization                               │
│  - Resume & Cover Letter Management                             │
│  - ATS Scoring & Matching                                       │
│  - AI Integration (Google GenAI, Groq)                          │
│  - Portfolio Management                                         │
└────────────────────┬────────────────────────────────────────────┘
                     │ Prisma ORM
                     │ Prepared Statements
┌────────────────────▼────────────────────────────────────────────┐
│         Database (PostgreSQL)                                    │
│  - Users & Authentication                                       │
│  - Resumes & Cover Letters                                      │
│  - ATS Reports & Scores                                         │
│  - Portfolios & Responses                                       │
│  - Company Profiles                                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              Admin Dashboard (Bun + React)                      │
│  - User Management                                              │
│  - System Monitoring                                            │
│  - Admin Functions                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### Frontend (BuildForJob-FE)
```
Framework:      Next.js 16.2.1
UI Framework:   React 19.2.4
Language:       TypeScript 5
Styling:        Tailwind CSS 4 + PostCSS
State:          Redux Toolkit + React Redux
HTTP Client:    Axios 1.14.0
Animations:     Framer Motion 12.38.0
Icons:          Lucide React, Heroicons
Document Gen:   jsPDF 4.2.1, html2canvas 1.4.1, html-to-image 1.11.13
Notifications:  Sonner (Toast notifications)
Date Handling:  date-fns 4.1.0
Security:       isomorphic-dompurify 3.12.0
```

### Backend (builtforjob-be)
```
Runtime:        Bun (Fast JavaScript runtime)
Framework:      Express.js 4.19.2
Language:       TypeScript 5
ORM:            Prisma 5.19.0
Database:       PostgreSQL
Authentication: JWT (jsonwebtoken 9.0.2)
Password Hash:  bcryptjs 2.4.3
File Upload:    Multer 2.1.1
File Storage:   ImageKit 6.0.0 (cloud storage)
Security:       Helmet, CORS, Cookie-parser
Validation:     Zod 3.23.8
AI Providers:   
  - Google GenAI 2.0.0
  - Groq SDK 1.1.2
Email:          Resend 3.5.0
PDF Parsing:    pdf-parse 2.4.5
```

### Admin Panel (admin/)
```
Runtime:        Bun
Framework:      React 19 + Tailwind CSS 4
Build Tool:     Bun
Dev Server:     Port 5173 (Hot reload)
```

---

## 4. Database Schema

### Core Entities

#### **User**
- Core user profile with email/password and OAuth credentials (Google, GitHub)
- Token-based plan system (FREE, PRO)
- Account status (verification, ban management)
- Relations to resumes, cover letters, portfolios, and ATS reports

```prisma
User {
  id              UUID (PK)
  email           String (Unique)
  password        String (Hashed)
  firstName       String
  lastName        String
  phone           String?
  bio             String?
  location        String?
  avatarUrl       String?
  jobTitle        String?
  isVerified      Boolean
  profileSynced   Boolean (GitHub sync)
  tokens          Float (Default: 5.0)
  plan            Plan (FREE|PRO)
  isBanned        Boolean
  bannedUntil     DateTime?
  googleId        String? (OAuth)
  githubId        String? (OAuth)
  
  Relations:
  - skills[]      (Skill[])
  - experience[]  (Experience[])
  - education[]   (Education[])
  - projects[]    (Project[])
  - resumes[]     (Resume[])
  - coverLetters[] (CoverLetter[])
  - portfolio     (Portfolio?)
  - atsReports[]  (AtsReport[])
  - versions[]    (ApplicationVersion[])
  - userCompanies[] (UserCompany[])
}
```

#### **Resume**
- Multiple resume templates (Modern, etc.)
- Magic Resume feature (AI-generated)
- Version tracking with resume versions
- JSON snapshot storage for content

#### **Resume Version**
- Tracks customized versions per company/role
- Status tracking (Active, Applied, Draft)
- Stores role-specific content

#### **CoverLetter**
- Company and recipient tracking
- AI-magic generation capability
- Template system

#### **ATS Report**
- Scores resumes against job descriptions
- Generates optimization suggestions
- Unlockable detailed suggestions (JSON)
- Tracks word count metrics

#### **User Profile Components**
- **Skill**: GitHub-syncable skills
- **Experience**: Company, position, dates, current status
- **Education**: Institution, degree, GPA, graduation type
- **Project**: GitHub-synced project list

#### **Application Tracking**
- **ApplicationVersion**: Named versions for specific company applications
- **UserCompany**: Track target companies per user

#### **Portfolio System**
- **Portfolio**: User portfolio with template selection
- **PortfolioResponse**: Track inquiries/responses from portfolio

#### **Authentication**
- **OTP**: Email OTP for registration and password reset
- **PasswordResetToken**: Secure password reset flow

#### **Company Profile**
- Curated company hiring info (industry, culture, ATS keywords)
- Used for AI recommendations

#### **Admin**
- Admin user authentication and management

### Enums
```
OTPType: REGISTRATION, PASSWORD_RESET
Plan: FREE, PRO
```

---

## 5. API Routes & Endpoints

### Authentication Routes (`/api/auth`)
```
POST   /register           # User registration
POST   /login              # Email/password login
POST   /logout             # Clear auth session
POST   /verify-email       # Verify OTP after registration
POST   /forgot-password    # Initiate password reset
POST   /reset-password     # Reset password with token
POST   /google-callback    # Google OAuth callback
POST   /github-callback    # GitHub OAuth callback
GET    /refresh            # Refresh JWT token
```

### User Routes (`/api/user`)
```
GET    /profile            # Get user profile
PUT    /profile            # Update profile (name, bio, location, etc.)
GET    /dashboard          # Dashboard summary
POST   /skills             # Add skill
DELETE /skills/:id         # Delete skill
POST   /experience         # Add experience
PUT    /experience/:id     # Update experience
DELETE /experience/:id     # Delete experience
POST   /education          # Add education
PUT    /education/:id      # Update education
DELETE /education/:id      # Delete education
POST   /projects           # Add project
DELETE /projects/:id       # Delete project
GET    /ats-reports        # List ATS reports
```

### Resume Routes (`/api/resume`)
```
GET    /                   # List all resumes
POST   /                   # Create new resume
GET    /:id                # Get resume details
PUT    /:id                # Update resume
DELETE /:id                # Delete resume
POST   /:id/versions       # Create resume version
GET    /:id/versions       # List versions
PUT    /versions/:id       # Update specific version
```

### Cover Letter Routes (`/api/cover-letter`)
```
GET    /                   # List cover letters
POST   /                   # Create cover letter
GET    /:id                # Get cover letter
PUT    /:id                # Update cover letter
DELETE /:id                # Delete cover letter
POST   /:id/generate       # Generate with AI (Magic)
```

### ATS Routes (`/api/ats`)
```
POST   /score              # Score resume vs JD
GET    /:reportId          # Get ATS report details
POST   /:reportId/unlock   # Unlock suggestions (paid feature)
```

### AI Routes (`/api/ai`)
```
POST   /generate-resume    # AI resume generation
POST   /optimize-resume    # Resume optimization
POST   /generate-cover     # AI cover letter generation
POST   /improve-content    # Content improvement suggestions
```

### Portfolio Routes (`/api/portfolio`)
```
GET    /                   # Get user portfolio
POST   /                   # Create portfolio
PUT    /                   # Update portfolio (data/settings)
PUT    /template           # Change template
DELETE /                   # Delete portfolio
GET    /responses          # List portfolio inquiries
POST   /responses          # Submit response form
DELETE /responses/:id      # Delete response
```

### Application Versions Routes (`/api/versions`)
```
GET    /                   # List application versions
POST   /                   # Create version
GET    /:id                # Get specific version
PUT    /:id                # Update version
DELETE /:id                # Delete version
```

### Companies Routes (`/api/companies`)
```
GET    /                   # List company profiles
GET    /:id                # Get company profile
```

### OTP Routes (`/api/otp`)
```
POST   /verify             # Verify OTP code
POST   /resend             # Resend OTP
```

### Admin Routes (`/api/admin`)
```
POST   /login              # Admin login
POST   /logout             # Admin logout
GET    /users              # List all users
PUT    /users/:id/ban      # Ban user
DELETE /users/:id          # Delete user
GET    /analytics          # System analytics
```

---

## 6. Frontend Architecture

### App Structure
```
app/
├── (auth)/                 # Authentication routes
│   ├── login/             # Login page
│   ├── register/          # Sign-up form
│   └── verify-email/      # OTP verification
├── dashboard/             # Protected routes
│   ├── page.tsx          # Dashboard home
│   ├── profile/          # User profile editor
│   ├── resume-builder/   # Resume creation/editing
│   ├── cover-letter/     # Cover letter builder
│   ├── portfolio/        # Portfolio builder
│   ├── magic-build/      # AI-powered builder
│   ├── connect/          # Social integrations
│   ├── settings/         # User settings
│   └── [...slug]/        # Dynamic subroutes
├── [username]/           # Public profile pages
│   └── [id]/            # Public portfolio view
├── auth-callback/        # OAuth callbacks
├── blogs/               # Blog pages
├── onboarding/          # First-time user flow
│   └── github/         # GitHub sync
├── layout.tsx           # Root layout
├── page.tsx            # Home page
└── globals.css         # Global styles
```

### Components Architecture
```
components/
├── ui/                    # Shadcn/Radix UI components
├── general/              # Reusable UI components
├── resume-builder/       # Resume builder components
├── cover-letter/         # Cover letter builder
│   ├── CoverLetterForm.tsx
│   ├── CoverLetterPreview.tsx
│   ├── CoverLetterThemeSelector.tsx
│   └── templates/
├── portfolio/            # Portfolio components
├── profile/             # Profile management
├── dashboard/           # Dashboard widgets
├── sections/            # Section components
├── providers/           # React context providers
├── theme-provider.tsx   # Theme switching
└── scroll-reveal-paragraph.tsx
```

### State Management (Redux)
```
store/
├── index.ts             # Store configuration
├── hooks.ts             # useAppDispatch, useAppSelector
└── slices/
    ├── authSlice        # Auth state
    ├── resumeSlice      # Resume data
    ├── coverLetterSlice # Cover letter data
    ├── userSlice        # User profile
    └── appSlice         # Global app state
```

### Utilities & Helpers
```
lib/
├── utils.ts             # Common utilities
├── icons.ts             # Icon exports
├── resume-matcher/      # ATS matching logic
├── github/              # GitHub integration helpers
├── types/               # TypeScript type definitions
│   ├── auth.ts
│   ├── resume.ts
│   ├── cover-letter.ts
│   └── index.ts
└── store/               # Redux store setup
```

### API Integration (Axios)
```
apis/
├── auth.api.ts          # Authentication endpoints
├── user.api.ts          # User profile endpoints
├── resume.api.ts        # Resume CRUD
├── cover-letter.api.ts  # Cover letter CRUD
├── ats.api.ts          # ATS scoring
├── ai.api.ts           # AI features
├── companies.api.ts    # Company data
├── versions.api.ts     # Application versions
└── axiosInstance.ts    # Axios configuration
```

---

## 7. Backend Architecture

### Server Structure
```
src/
├── app.ts               # Express app configuration
├── config/              # Configuration files
│   ├── db.config.ts     # Prisma client
│   └── constants.ts
├── controllers/         # Request handlers
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   ├── resume.controller.ts
│   ├── cover-letter.controller.ts
│   ├── ats.controller.ts
│   ├── ai.controller.ts
│   ├── portfolio.controller.ts
│   └── ...
├── services/            # Business logic
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── resume.service.ts
│   ├── ats.service.ts
│   ├── ai.service.ts    # Google GenAI, Groq integration
│   └── ...
├── routes/              # Express routers
│   ├── auth/
│   ├── user/
│   ├── resume/
│   ├── cover-letter/
│   ├── ats/
│   ├── ai/
│   ├── portfolio/
│   ├── companies/
│   ├── versions/
│   ├── otp/
│   └── admin/
├── middlewares/         # Express middlewares
│   ├── auth.middleware.ts      # JWT verification
│   ├── error.middleware.ts     # Error handling
│   ├── validation.middleware.ts
│   └── ...
├── validators/          # Zod schemas
│   ├── auth.validator.ts
│   ├── resume.validator.ts
│   └── ...
├── interfaces/          # TypeScript interfaces
├── utils/              # Utility functions
│   ├── jwt.utils.ts
│   ├── email.utils.ts
│   └── ...
└── scripts/            # Database migrations, seeders
```

### Key Services

#### **Authentication Service**
- Email/password registration and login
- OAuth integration (Google, GitHub)
- JWT token generation and refresh
- OTP verification
- Password reset flow
- Session management via cookies

#### **AI Service**
- Integration with Google GenAI (Gemini models)
- Integration with Groq (open-source models)
- Resume generation and optimization
- Cover letter generation
- Content improvement suggestions
- Prompt engineering for job-specific content

#### **ATS Service**
- Resume-to-JD matching algorithm
- Score calculation (0-100)
- Keyword extraction and analysis
- Suggestions generation
- Missing keywords identification
- ATS report generation

#### **Resume Service**
- CRUD operations
- Version management
- Template management
- Content validation
- Resume export (PDF)

#### **Portfolio Service**
- Portfolio creation and management
- Template selection
- Portfolio response tracking
- Public portfolio viewing

#### **Email Service**
- OTP delivery (via Resend)
- Password reset emails
- Verification emails
- Transactional emails

---

## 8. Security Architecture

### Authentication & Authorization
- **JWT-based** authentication with secure token storage
- **HTTP-only cookies** for token persistence
- **Refresh token rotation** for enhanced security
- **Role-based access control** (User, Admin)

### Security Measures
```typescript
// Helmet Security Headers
- Content Security Policy (CSP)
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Cross-Origin Embedder Policy (disabled for ImageKit)

// CORS Configuration
- Whitelisted origins (production: build-for-job-fe.vercel.app, localhost)
- Credentials support enabled
- Specific HTTP methods allowed

// Input Validation
- Zod schema validation on all endpoints
- Request body sanitization
- File upload validation (multer)

// Password Security
- bcryptjs hashing (salt rounds)
- Secure password reset tokens
- OTP-based verification

// Database Security
- Prepared statements (Prisma)
- SQL injection prevention
- Sensitive data encryption where needed
```

### Deployment Security
- Environment variables for secrets
- Vercel deployment with HTTPS
- Proxy configuration (trust proxy for reverse proxies)
- Database encryption at rest (PostgreSQL)

---

## 9. Data Flow Examples

### Resume Creation & ATS Scoring Flow

```
User (Frontend)
    ↓ [POST /api/resume]
Backend Resume Controller
    ↓ [Create Resume]
Prisma ORM
    ↓
PostgreSQL
    ↓ [Save Resume]
Response → User
    ↓ [User inputs job description]
    ↓ [POST /api/ats/score]
ATS Controller
    ↓ [Parse resume + JD]
ATS Service
    ↓ [Extract keywords, calculate score]
AI Service (Groq/GenAI)
    ↓ [Generate suggestions]
Response → User (Score + Suggestions)
    ↓
Prisma ORM
    ↓ [Save AtsReport]
PostgreSQL
```

### AI Cover Letter Generation Flow

```
User (Frontend)
    ↓ [POST /api/cover-letter/generate]
Cover Letter Controller
    ↓ [Validate input]
AI Service
    ↓ [Use Google GenAI/Groq]
    ↓ [Job description, user profile, resume context]
Generated Content
    ↓
Response → Frontend (AI-generated content)
    ↓ [User saves]
    ↓ [PUT /api/cover-letter/:id]
Prisma ORM
    ↓
PostgreSQL (Save cover letter)
```

### Authentication Flow

```
User (Frontend) - Registers
    ↓ [POST /api/auth/register]
Auth Controller
    ↓ [Validate email, hash password]
Prisma ORM
    ↓ [Create User]
PostgreSQL
    ↓ [User saved]
OTP Service
    ↓ [Generate OTP]
Resend Email Service
    ↓
User (Email) - Receives OTP
    ↓ [POST /api/auth/verify-email]
Auth Controller
    ↓ [Verify OTP]
Prisma ORM
    ↓ [Update isVerified]
JWT Generation
    ↓
Response → Frontend (Auth token, HTTP-only cookie)
```

---

## 10. Feature Breakdown

### Core Features

#### 1. **Resume Builder**
- Multiple template support
- WYSIWYG editor
- Real-time preview
- PDF export
- Version management
- Magic Resume (AI generation)

#### 2. **Cover Letter Builder**
- Template system
- AI-powered generation
- Company/role customization
- Theme customization
- Export capabilities
- Version history

#### 3. **ATS Optimizer**
- Resume vs Job Description matching
- Score calculation (0-100)
- Keyword analysis
- Actionable suggestions
- Word count metrics
- Paid unlockable detailed insights

#### 4. **Portfolio Builder**
- Multiple template support
- Customizable design
- Public portfolio URLs
- Inquiry form responses
- Social integration

#### 5. **Application Tracking**
- Save application versions per company
- Track multiple resumes/cover letters per application
- Application history
- Company tracking

#### 6. **Profile Management**
- Education tracking
- Experience history
- Skills management
- GitHub sync (auto-import projects/skills)
- Social links

#### 7. **AI Features**
- Resume optimization suggestions
- Cover letter generation
- Content improvement
- Job-specific tailoring
- Magic resume creation

#### 8. **Authentication**
- Email/password signup
- Google OAuth
- GitHub OAuth
- Email verification
- Password reset
- Session management

---

## 11. Integration Points

### External Services

#### **AI Providers**
- **Google GenAI (Gemini)**: Primary LLM for content generation
- **Groq**: Open-source models for specific use cases

#### **Email Service**
- **Resend**: Transactional email delivery

#### **File Storage**
- **ImageKit**: Cloud storage for images and documents

#### **OAuth Providers**
- **Google OAuth 2.0**: User authentication and profile data
- **GitHub OAuth 2.0**: User authentication, project/skills sync

#### **Database**
- **PostgreSQL**: Primary data store
- **Prisma Migration**: Schema versioning and migrations

---

## 12. Development Workflow

### Running the Project

```bash
# Backend (builtforjob-be)
cd builtforjob-be
bun install
bun run db:generate      # Generate Prisma client
bun run db:push         # Push schema to DB
bun run dev             # Start dev server (--watch mode)

# Frontend (BuildForJob-FE)
cd BuildForJob-FE
npm install
npm run dev             # Start Next.js dev server

# Admin (admin/)
cd admin
bun install
bun run dev             # Start on port 5173
```

### Database Management

```bash
# Migrations
bun run db:migrate      # Create and run migration
bun run db:deploy       # Deploy migrations to production
bun run db:push         # Push schema changes (dev only)
bun run db:studio       # Open Prisma Studio GUI
bun run db:generate     # Regenerate Prisma client
```

### Environment Variables

```env
# Backend (.env in builtforjob-be/)
DATABASE_URL=postgresql://user:password@localhost/buildforjob
JWT_SECRET=your_jwt_secret
GOOGLE_GENAI_API_KEY=your_google_api_key
GROQ_API_KEY=your_groq_api_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
RESEND_API_KEY=your_resend_key
FRONTEND_URL=http://localhost:3000 (or production URL)
```

---

## 13. Scalability & Performance

### Current Architecture Supports
- **Database**: PostgreSQL with connection pooling (Prisma)
- **API**: Express.js on Bun runtime (fast JavaScript execution)
- **Frontend**: Next.js with SSR/SSG for optimized rendering
- **CDN**: ImageKit for media delivery

### Optimization Strategies
- **API Caching**: Consider Redis for token blacklisting and session storage
- **Database Indexing**: Applied on frequently queried columns (email, tokens, OTP)
- **Pagination**: Implement for large datasets (users, resumes, applications)
- **Rate Limiting**: Implement on auth and AI endpoints
- **Compression**: Gzip compression for API responses
- **Image Optimization**: ImageKit for responsive images

### Future Scaling Considerations
- Microservices architecture for AI services
- Message queues (Bull, RabbitMQ) for async operations
- Caching layer (Redis) for frequently accessed data
- Database read replicas for scaling reads
- CDN for static assets
- API Gateway for routing and rate limiting

---

## 14. Error Handling

### Error Middleware Flow
```
Express Router
    ↓ [Thrown error or error passed to next()]
Error Middleware
    ↓ [Categorize error type]
    ↓ [Validation error, Auth error, DB error, Server error]
    ↓ [Format error response]
Response → Client (Error details, HTTP status code)
```

### Error Types Handled
- **400**: Validation errors, bad requests
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Resource not found
- **409**: Conflict (duplicate email, etc.)
- **500**: Server errors
- **503**: Service unavailable (AI provider down, etc.)

---

## 15. Testing Strategy

### Test Coverage Areas
- **Unit Tests**: Service logic, utilities, validators
- **Integration Tests**: API endpoints, database operations
- **E2E Tests**: Complete user flows (signup → resume creation → ATS scoring)
- **Security Tests**: CORS, CSRF, SQL injection, XSS prevention

### Tools
- **Frontend**: Jest, React Testing Library
- **Backend**: Vitest or Jest
- **E2E**: Playwright or Cypress

---

## 16. Deployment

### Frontend Deployment
- **Hosted on**: Vercel
- **Domain**: buildforjob.rupeshhh.in, build-for-job-fe.vercel.app
- **Auto-deploy**: On push to main branch

### Backend Deployment
- **Container**: Docker (Dockerfile provided)
- **Registry**: Docker Hub (via push_dockerhub.sh)
- **Platforms**: Can be deployed to Render, Railway, AWS ECS, Vercel (with serverless functions)
- **Database**: PostgreSQL (managed service recommended)

### Deployment Checklist
- Environment variables configured
- Database migrations deployed
- CORS origins updated
- Security headers verified
- Error logging configured
- Monitoring and alerts set up

---

## 17. Project Statistics

### Database Models: 13
User, Resume, ResumeVersion, CoverLetter, Skill, Experience, Education, Project, OTP, PasswordResetToken, ApplicationVersion, AtsReport, CompanyProfile, UserCompany, Portfolio, PortfolioResponse, Admin

### API Endpoints: 50+
Across 11 route modules (auth, user, resume, cover-letter, ats, ai, portfolio, versions, companies, otp, admin)

### Frontend Components: 25+
Organized by feature domain (resume-builder, cover-letter, portfolio, dashboard, etc.)

### Tech Dependencies
- **Frontend**: 16 production, 6 dev
- **Backend**: 15 production, 5 dev
- **Admin**: 5 production, 2 dev

---

## 18. Future Roadmap

### Planned Features
- [ ] Interview preparation module
- [ ] Job alert system
- [ ] LinkedIn integration
- [ ] Resume parsing from LinkedIn profiles
- [ ] Mock interview with AI
- [ ] Cover letter template marketplace
- [ ] Resume analytics dashboard
- [ ] Team collaboration (for agencies)
- [ ] Email tracking for application submissions
- [ ] Batch resume generation for multiple jobs

### Technical Improvements
- [ ] GraphQL API alternative
- [ ] Real-time notifications (WebSocket)
- [ ] Advanced search and filtering
- [ ] A/B testing framework
- [ ] Analytics dashboard for admins
- [ ] Webhook integrations for third-party apps

---

## 19. Troubleshooting Guide

### Common Issues

**Database Connection Issues**
- Verify DATABASE_URL in .env
- Check PostgreSQL is running
- Ensure network access to database

**AI Service Timeouts**
- Check API keys are valid
- Monitor API rate limits
- Implement request timeouts

**File Upload Failures**
- Verify ImageKit credentials
- Check file size limits
- Ensure CORS is configured

**Authentication Issues**
- Check JWT_SECRET is consistent
- Verify token expiration times
- Check cookie settings

---

## 20. Frontend UI Design

### 20.1 Login Page

#### **Design Overview**
The login page is a modern, responsive authentication interface with support for email/password and OAuth (Google, GitHub).

#### **Features**
- Email/password authentication
- OAuth integration buttons (Google, GitHub)
- Password visibility toggle
- "Forgot Password" link
- "Sign Up" redirect link
- Responsive design (mobile-first)
- Dark mode support via next-themes
- Form validation with visual feedback

#### **UI Components**
- Input fields with icons and labels
- Styled buttons for email login
- OAuth provider buttons
- Link to sign-up page
- Loading state indicator
- Error message display

#### **Code Snippet - Login Component**

```tsx
// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react';
import axios from '@/apis/axiosInstance';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider: 'google' | 'github') => {
    window.location.href = `/api/auth/${provider}-callback`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your BuildForJob account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader className="w-4 h-4 animate-spin" />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">Or continue with</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleOAuthLogin('google')}
            className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 c0-3.331,2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.461,2.268,15.365,1,12.545,1 C6.477,1,1.54,5.937,1.54,12s4.937,11,11.005,11c6.068,0,11.005-4.937,11.005-11c0-0.811-0.067-1.537-0.311-2.29H12.545z"/>
            </svg>
            Google
          </button>

          <button
            type="button"
            onClick={() => handleOAuthLogin('github')}
            className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
```

---

### 20.2 Dashboard Page

#### **Design Overview**
The dashboard is a comprehensive hub for job seekers to access all BuildForJob features. It features a sidebar navigation, header with user profile, and main content area with various sections.

#### **Features**
- Responsive sidebar navigation
- Header with user profile dropdown
- Quick action cards
- Resume library section
- Recent applications section
- ATS score widgets
- AI suggestions panel
- Dark mode support
- Mobile-responsive layout

#### **UI Structure**
```
┌─────────────────────────────────────────────────┐
│  Header (Logo, Profile Menu, Notifications)    │
├──────────────┬────────────────────────────────────┤
│   Sidebar    │                                    │
│  Navigation  │    Dashboard Main Content          │
│              │  - Quick Stats Cards               │
│              │  - Resume Library                  │
│              │  - Recent Applications             │
│              │  - ATS Reports                     │
│              │  - AI Suggestions                  │
│              │                                    │
└──────────────┴────────────────────────────────────┘
```

#### **Code Snippet - Dashboard Layout**

```tsx
// app/dashboard/layout.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  X,
  FileText,
  PenTool,
  Zap,
  BookOpen,
  Settings,
  LogOut,
  Bell,
  User,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

const SIDEBAR_ITEMS = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: FileText,
    badge: null,
  },
  {
    label: 'Resumes',
    href: '/dashboard/resume-builder',
    icon: FileText,
    badge: '3',
  },
  {
    label: 'Cover Letters',
    href: '/dashboard/cover-letter',
    icon: PenTool,
    badge: '2',
  },
  {
    label: 'ATS Optimizer',
    href: '/dashboard/ats',
    icon: Zap,
    badge: null,
  },
  {
    label: 'Portfolio',
    href: '/dashboard/portfolio',
    icon: BookOpen,
    badge: null,
  },
  {
    label: 'Profile',
    href: '/dashboard/profile',
    icon: User,
    badge: null,
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    badge: null,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const router = useRouter();
  const { signOut } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">BuildForJob</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-700 rounded-lg transition"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition text-slate-200 hover:text-white group"
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={() => signOut(() => router.push('/'))}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition text-slate-200 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  JD
                </div>
                {sidebarOpen && (
                  <>
                    <span className="text-sm font-medium text-gray-700">John Doe</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </>
                )}
              </button>

              {/* Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <Link
                    href="/dashboard/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => signOut(() => router.push('/'))}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-b-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

#### **Code Snippet - Dashboard Home Page**

```tsx
// app/dashboard/page.tsx
'use client';

import Link from 'next/link';
import { FileText, PenTool, Zap, TrendingUp, Plus, ArrowRight } from 'lucide-react';

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      {/* Quick Stats Section */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Resumes Card */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Resumes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
              </div>
              <FileText className="w-10 h-10 text-blue-500 opacity-50" />
            </div>
          </div>

          {/* Cover Letters Card */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Cover Letters</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">2</p>
              </div>
              <PenTool className="w-10 h-10 text-purple-500 opacity-50" />
            </div>
          </div>

          {/* Applications Card */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Applications</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-500 opacity-50" />
            </div>
          </div>

          {/* ATS Score Card */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg ATS Score</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">78%</p>
              </div>
              <Zap className="w-10 h-10 text-orange-500 opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/resume-builder"
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-lg">Create Resume</h4>
                <p className="text-blue-100 text-sm mt-1">Build a new resume</p>
              </div>
              <Plus className="w-6 h-6" />
            </div>
          </Link>

          <Link
            href="/dashboard/cover-letter"
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-lg">Write Cover Letter</h4>
                <p className="text-purple-100 text-sm mt-1">AI-powered writing</p>
              </div>
              <Plus className="w-6 h-6" />
            </div>
          </Link>

          <Link
            href="/dashboard/ats"
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow p-6 text-white hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-lg">Optimize for ATS</h4>
                <p className="text-orange-100 text-sm mt-1">Increase match score</p>
              </div>
              <Plus className="w-6 h-6" />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Resumes Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Recent Resumes</h3>
          <Link href="/dashboard/resume-builder" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Senior Developer', company: 'Tech Company', date: '2 days ago' },
            { name: 'Full Stack Engineer', company: 'Startup', date: '1 week ago' },
            { name: 'React Developer', company: 'Agency', date: '2 weeks ago' },
          ].map((resume, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
              <FileText className="w-8 h-8 text-blue-500 mb-3" />
              <h4 className="font-semibold text-gray-900">{resume.name}</h4>
              <p className="text-gray-600 text-sm">{resume.company}</p>
              <p className="text-gray-400 text-xs mt-2">{resume.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Applications Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Recent Applications</h3>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Company</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Position</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Applied</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { company: 'Google', position: 'Senior Developer', date: '3 days ago', status: 'In Review' },
                { company: 'Microsoft', position: 'Software Engineer', date: '1 week ago', status: 'Rejected' },
                { company: 'Amazon', position: 'Full Stack Engineer', date: '2 weeks ago', status: 'Applied' },
              ].map((app, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{app.company}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{app.position}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{app.date}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        app.status === 'In Review'
                          ? 'bg-blue-100 text-blue-700'
                          : app.status === 'Rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

---

## 21. Additional Resources

- **Prisma Docs**: https://www.prisma.io/docs
- **Express.js**: https://expressjs.com
- **Next.js**: https://nextjs.org/docs
- **Google GenAI**: https://ai.google.dev
- **Groq**: https://groq.com/docs
- **ImageKit**: https://docs.imagekit.io
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Lucide Icons**: https://lucide.dev

---

**Document Version**: 2.0  
**Last Updated**: 2026-09-01  
**Maintained by**: BuildForJob Development Team
