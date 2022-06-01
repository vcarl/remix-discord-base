FROM node:16-alpine as build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production=false

COPY remix.config.js tailwind.config.js knexfile.ts tsconfig.json .eslint* .prettierignore ./
COPY app ./app
COPY migrations ./migrations
COPY scripts ./scripts

RUN npm run build

# Build the production image with minimal footprint
FROM node:16-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/node_modules /app/node_modules
ADD package.json package-lock.json ./
RUN npm prune --production

COPY --from=build /app/build ./build
COPY --from=build /app/public ./public

CMD ["npm", "run", "start"]
