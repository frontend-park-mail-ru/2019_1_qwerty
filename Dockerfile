FROM node:8.15-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src /app

EXPOSE 8000
CMD ["node", "server.js"]
