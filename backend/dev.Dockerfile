FROM node:16.6.1-alpine3.14
WORKDIR /app

ENTRYPOINT ["npm", "start"]