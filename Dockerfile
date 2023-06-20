FROM node:18-alpine AS base

RUN npm i -g pnpm

FROM base AS dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpx prisma generate
RUN pnpm build
# RUN pnpx prisma db push


FROM base AS deploy

WORKDIR /app
COPY package*.json pnpm-lock.yaml tsconfig.build.json .env ./
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/node_modules ./node_modules

CMD ["pnpm", "run", "start:prod"]

EXPOSE 3000