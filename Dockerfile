FROM node:20-alpine AS base

FROM base AS dependencies

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm run build
RUN npm prune --production

FROM base AS dev

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm install --frozen-lockfile

CMD ["npm", "run", "dev"]

FROM base AS deploy

WORKDIR /app
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/node_modules ./node_modules

CMD [ "node", "dist/src/main.js" ]