# Base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN yarn install --ignore-engines

# Copy source code
COPY . .

# Copy environment file into container (rename to .env)
COPY env/prod.env .env

# Build NestJS
RUN yarn build

# Expose NestJS port (tuỳ bạn config, mặc định là 3000 hoặc 3001)
EXPOSE 3000

# Start: chạy migration trước khi start server
CMD ["sh", "-c", "npm run migrate:prod && npm run start:prod"]