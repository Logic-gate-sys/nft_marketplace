#BUILD STEP  
FROM node:24 AS node-builder
RUN mkdir /build
WORKDIR /build
COPY  package*.json  /
RUN npm ci
COPY . .

#RUNNER 
FROM node:alpine

USER node 
#make working directory 
WORKDIR /app
#copy file build files into working directory 
COPY --from=node-builder --chown=node:node /build .

#run command
CMD [ "npm", "start"]