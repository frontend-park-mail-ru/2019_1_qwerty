FROM node:8.15-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000
CMD ["node", "src/server.js"]
