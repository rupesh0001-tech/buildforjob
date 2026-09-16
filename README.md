# BuildForJob Monorepo

Welcome to the **BuildForJob** monorepo powered by [Turborepo](https://turbo.build/repo) and `pnpm`.

## Repository Structure

```text
buildforjob/
├── apps/
│   ├── frontend/   # Next.js Frontend Application
│   ├── backend/    # Express + Bun + Prisma Backend API
│   └── admin/      # Admin Dashboard Application
├── packages/       # Shared internal packages
├── turbo.json      # Turborepo configuration
└── package.json    # Root monorepo configuration
```

## Getting Started

### Prerequisites

- Node.js (>= 20)
- pnpm (>= 9) or bun (>= 1.1)

### Development

To run all applications in development mode simultaneously:

```bash
pnpm dev
```

To run a specific app:

```bash
pnpm --filter frontend dev
# or
pnpm --filter backend dev
# or
pnpm --filter admin dev
```

### Build

To build all apps:

```bash
pnpm build
```

## License

Private repository - All rights reserved.
