FROM node:24-alpine AS react-builder
WORKDIR /app
COPY  . . 
RUN npm ci 
RUN npm run build

#RUNNER 
FROM nginx:latest
COPY --from=react-builder /app/dist  /usr/share/nginx/html
