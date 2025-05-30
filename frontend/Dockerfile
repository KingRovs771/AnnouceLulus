# STEP 1: Build the Vue.js application
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Ganti dengan perintah build yang sesuai untuk proyek Vue Anda
# Misalnya: npm run build, yarn build, vue-cli-service build
RUN npm run build

# STEP 2: Serve the Vue.js application with Nginx
FROM nginx:alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Jika Anda punya custom nginx config untuk Vue, copy di sini
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]