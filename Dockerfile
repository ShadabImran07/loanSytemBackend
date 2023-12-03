FROM node:alpine

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma/
COPY .env ./



RUN npm install
RUN npx prisma generate

COPY . .

EXPOSE 5000

CMD ["npm","run","dev"]
