# Base image
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Pass environment file for build
ARG BUILD_ENV=prod
COPY .env.${BUILD_ENV} .env

RUN npm run build

# Production image
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 4200

CMD ["npm", "start"]

