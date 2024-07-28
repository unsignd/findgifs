FROM --platform=linux/amd64 node:20.5.1

WORKDIR /usr/app

COPY ./ /usr/app

RUN npm install

RUN npm run build

EXPOSE 8000

CMD npm start