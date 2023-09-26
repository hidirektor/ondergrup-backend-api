FROM api-base:latest

WORKDIR /usr/src/app

COPY rest-api /usr/src/app

RUN mkdir -p /usr/src/rest-api/data/profilePhoto /usr/src/rest-api/data/hydraulicUnits /usr/src/rest-api/data/partList

RUN npm install

CMD node server.js

EXPOSE 3000

VOLUME ["/usr/src/app/data"]
