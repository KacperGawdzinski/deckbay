FROM node:16.6.1-alpine3.14
WORKDIR /app
COPY ["package.json", "./"]
RUN npm config set unsafe-perm true
RUN npm install
RUN chown -R node.node /app
COPY . .
USER node
ENTRYPOINT ["npm", "start"]