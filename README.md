# Runtime

A Vercel-like cloud deployment platform that automatically builds, analyzes, and deploys user applications from GitHub. It uses isolated AWS ECS build environments, Kafka-driven job orchestration, real-time build logs, AI-powered deployment summaries with RAG search, and secure S3-based artifact storage with CDN delivery, enabling developers to deploy projects seamlessly while gaining intelligent insights into every build.


## Repository structure

- `apps/web`: frontend application powered by [Next.js](https://nextjs.org/)
- `apps/backend`: backend application
- `packages/db`: shared database package using Prisma
- `packages/kafka`: shared Kafka package
- `packages/ui`: shared React UI components
- `packages/eslint-config`: shared ESLint configuration
- `packages/typescript-config`: shared TypeScript configuration

### Tech Stack

* **Frontend:** Next.js, React, TypeScript, Tailwind CSS
* **Backend:** Node.js, Express.js, TypeScript
* **Database:** PostgreSQL, Prisma ORM
* **Message Queue / Event Streaming:** Apache Kafka (KafkaJS)
* **AI Layer:** LLM APIs, Embeddings, RAG pipeline
* **Vector Database:** Qdrant
* **Cloud Infrastructure:** AWS ECS Fargate (isolated build runners), AWS ECR services
* **Storage:** AWS S3 (deployment artifacts & build outputs)
* **CDN / Hosting:** AWS CloudFront, Isolated ECS Task
* **Containerization:** Docker
* **CI/CD Workflow:** GitHub repository integration, automated build pipelines
* **Authentication & Security:** GitHub OAuth, Presigned S3 URLs, IAM roles
* **Build System:** Custom sandboxed build execution environment
* **Logging & Monitoring:** Kafka-based real-time build logs, AWS CloudWatch
* **Package Management:** pnpm monorepo
* **Deployment Architecture:** Event-driven microservices architecture with ECS task orchestration


## Requirements

- Node.js >= 18
- pnpm

## Setup

Install dependencies from the repository root:

```sh
pnpm install
```

If you need to install Turborepo globally, run:

```sh
pnpm add -g turbo
```

## Root scripts

From the repository root, use these commands:

```sh
pnpm build
pnpm dev
pnpm lint
pnpm format
pnpm check-types
```

These map to the root Turbo commands defined in `package.json`.

## Turbo commands

From the repository root, run the monorepo task pipeline:

With global `turbo`:

```sh
turbo build
``` 

Without global `turbo`:

```sh
pnpm exec turbo build
```

## Running a specific app

Use Turbo filters to target a specific package.

```sh
pnpm exec turbo dev --filter=web
pnpm exec turbo dev --filter=backend
pnpm exec turbo build --filter=web
pnpm exec turbo build --filter=backend
```

## Package details

- `apps/web` depends on `@repo/ui`
- `apps/backend` depends on `@repo/db` and `@repo/kafka`
- `packages/db` runs `prisma generate` as part of its build

## Notes

- `packages/ui` is a private package used by `apps/web`
- `packages/db` and `packages/kafka` are shared libraries used by the backend
- `packages/eslint-config` and `packages/typescript-config` provide workspace-wide lint/type settings
