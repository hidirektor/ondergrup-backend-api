FROM api-base:latest

WORKDIR /usr/src/app

COPY rest-api /usr/src/app

RUN mkdir -p /usr/src/app/data/profilePhoto /usr/src/app/data/hydraulicUnits /usr/src/app/data/partList

RUN npm install

CMD node server.js

EXPOSE 3000
