### STAGE 1: Build ###
FROM node:14.1-alpine AS s1
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build.prod

### STAGE 2: Run ###
FROM nginx:1.17-alpine
COPY --from=s1 /usr/src/app/dist/finance-otter-web /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/ssl/ /var/certificates/
