# BuildForJob Monorepo

Welcome to the **BuildForJob** monorepo powered by [Turborepo](https://turbo.build/repo) and [Bun](https://bun.sh/).

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

- Bun (>= 1.1)

### Installation

```bash
bun install
```

### Development

To run all applications in development mode simultaneously:

```bash
bun dev
```

To run a specific app:

```bash
bun --filter frontend dev
# or
bun --filter backend dev
# or
bun --filter admin dev
```

### Build

To build all apps:

```bash
bun build
```

## License

Private repository - All rights reserved.
