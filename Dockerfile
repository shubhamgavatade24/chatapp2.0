FROM node:alpine

WORKDIR /backend

COPY /package.json .
COPY /package-lock.json .

RUN npm install

COPY /backend/. .

CMD ["npm", "start"]