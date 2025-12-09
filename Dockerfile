FROM node:lts-alpine AS deps

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

FROM node:lts-alpine AS builder

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules

COPY . .

RUN npm run build

FROM node:lts-alpine AS runtime

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

# RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# RUN chown -R appuser:appgroup /usr/src/app
# RUN chmod -R 750 /usr/src/app
# USER appuser

CMD ["node", "dist/main.js"]