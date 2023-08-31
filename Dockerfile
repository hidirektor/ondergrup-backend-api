FROM api-base:latest

WORKDIR /usr/src/app

COPY rest-api /usr/src/app

RUN npm install

CMD node app.js

EXPOSE 3000
