FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production

RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# ⭐️ thêm dòng này để ép server.js chạy đúng cổng
ENV PORT=4200

# Copy standalone output
COPY --from=builder /app/.next/standalone ./

# Copy static files
COPY --from=builder /app/.next/static ./.next/static

# Copy public files if needed
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

EXPOSE 4200

CMD ["node", "server.js"]
