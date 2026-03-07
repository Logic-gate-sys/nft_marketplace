#BUILD STEP  
FROM node:24 AS node-builder
RUN mkdir /build
WORKDIR /build
COPY  package*.json  /
RUN npm ci
COPY . .

#RUNNER 
FROM alpine:latest
# create node user 
RUN apk add --update nodejs
RUN addgroup -S node && adduser -S node -G node
USER node 
#make working directory 
WORKDIR /app
#copy file build files into working directory 
COPY --from=node-builder --chown=node:node /build .

#run command
CMD [ "npm", "start"]