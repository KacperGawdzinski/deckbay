FROM node:16.6.1-alpine3.14
WORKDIR /app
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install
COPY . .

EXPOSE 5000
ENTRYPOINT ["npm", "start"]