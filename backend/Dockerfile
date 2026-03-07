#BUILD STEP  
FROM node:24 AS node-builder
RUN mkdir /build
WORKDIR /build
COPY  package*.json  /
RUN npm ci
COPY . .

#RUNNER 
FROM alpine:lastet
# create node user 
RUN apk add --update nodejs
RUN add group -S node && adduser -S node -G node
USER node 
#make working directory 
RUN mkdir /usr/nft-app 
WORKDIR /usr/nft-app
#copy file build files into working directory 
COPY --from=node-builder --chown=node:node /build .

#run command
CMD [ "npm", "start"]