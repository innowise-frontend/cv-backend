FROM amd64/node:22-alpine AS build
WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@10 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . ./
COPY docker/.env.cv_backend .env
RUN pnpm run build

RUN corepack disable

FROM amd64/node:22-alpine AS launch
WORKDIR /usr/src/app
COPY --from=build /usr/src/app /usr/src/app
CMD ["node", "dist/src/main.js"]
