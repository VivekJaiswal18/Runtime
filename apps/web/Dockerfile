FROM node:22-alpine AS builder

RUN apk add --no-cache git

RUN corepack enable

WORKDIR /home/app

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm --filter web build

FROM node:22-alpine

RUN corepack enable

WORKDIR /home/app

COPY --from=builder /home/app/apps/web/.next/standalone ./
COPY --from=builder /home/app/apps/web/.next/static ./.next/static
COPY --from=builder /home/app/apps/web/public ./public

EXPOSE 3000

CMD ["node", "server.js"]