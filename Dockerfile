

FROM node:18



WORKDIR /app

COPY package*.json ./


RUN npm ci

COPY . .

RUN npm run build

COPY .env ./dist


CMD [ "npm", "run", "start:prod" ]