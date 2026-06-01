FROM node:22-alpine

RUN corepack enable

WORKDIR /home/app

COPY pnpm-lock.yaml ./pnpm-lock.yaml
COPY pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY package.json ./package.json

COPY packages/kafka/package.json ./packages/kafka/package.json
COPY packages/kafka/tsconfig.json ./packages/kafka/tsconfig.json
COPY packages/kafka/src ./packages/kafka/src

COPY packages/db/package.json ./packages/db/package.json
COPY packages/db/tsconfig.json ./packages/db/tsconfig.json
COPY packages/db/prisma.config.ts ./packages/db/prisma.config.ts
COPY packages/db/prisma ./packages/db/prisma
COPY packages/db/src/index.ts ./packages/db/src/index.ts

COPY apps/build-server/tsconfig.json ./apps/build-server/tsconfig.json
COPY apps/build-server/package.json ./apps/build-server/package.json
COPY apps/build-server/src/index.ts ./apps/build-server/src/index.ts

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @repo/db build 
RUN pnpm --filter @repo/kafka build 
RUN pnpm --filter build-server build

WORKDIR /home/app/apps/build-server

ENTRYPOINT ["node", "dist/index.js"]