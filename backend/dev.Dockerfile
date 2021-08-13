FROM node:16.6.1-alpine3.14
WORKDIR /app
COPY ["package.json", "./"]
RUN npm install
RUN npm install -g socketio
COPY . .

ENTRYPOINT ["npm", "start"]