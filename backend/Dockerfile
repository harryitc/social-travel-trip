######## BUILD
FROM node:20.9.0 AS build

# Thiết lập thư mục làm việc
WORKDIR /app

COPY package*.json ./

COPY . .

RUN yarn install --ignore-engines
RUN yarn build 


######## EXPORT
FROM node:20.9.0 AS runtime

WORKDIR /app_build

# Cài đặt lại các thư viện chrome cần thiết trong runtime
RUN apt-get update && apt-get install -y \
    libnss3 \
    libx11-dev \
    libxcomposite1 \
    libxrandr2 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libxss1 \
    libxtst6 \
    libnss3-dev \
    libappindicator3-1 \
    libu2f-udev \
    lsb-release \
    xdg-utils \
    libgbm1
RUN npx puppeteer browsers install chrome

COPY --from=build /app /app_build

ARG NODE_ENV=server-test
ENV NODE_ENV $NODE_ENV

ENTRYPOINT ["/bin/bash", "-c", "set -a && source /app_build/.env && exec \"$@\"","--"]

EXPOSE 3000

CMD ["node", "dist/main"]