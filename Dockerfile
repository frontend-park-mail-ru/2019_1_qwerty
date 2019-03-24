FROM node:8.15-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run tmpl

FROM nginx:alpine

LABEL maintainer="vekshin.roman@student.bmstu.ru"

RUN addgroup -g 1000 -S www-data \
 && adduser -u 1000 -D -S -G www-data www-data

ENV PORT 80

EXPOSE $PORT

COPY site /etc/nginx/sites-enabled

COPY --from=builder /app/src/public /usr/share/nginx/html

