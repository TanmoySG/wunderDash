FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
RUN apk add jq
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
RUN npm install --global serve  
COPY . .
RUN chown -R node /usr/src/app
EXPOSE 3000
USER node
ENTRYPOINT [ "sh", "/usr/src/app/scripts/start-up.sh", "/usr/src/app" ]
