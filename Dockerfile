FROM node:10-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN npm install --production

COPY . .

EXPOSE 5000

CMD node index.js
