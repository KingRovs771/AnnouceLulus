FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production # Hanya install dependencies produksi
COPY . .

RUN npm run build

EXPOSE 3000
CMD [ "node", "app.js" ]