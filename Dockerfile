FROM node:20-alpine
LABEL authors="Akavi"

RUN mkdir -p ./app
ADD . /app
WORKDIR /app

COPY ./ /app
RUN npm i -g yarn --force
RUN yarn install
RUN yarn tsc
CMD ["node", "."]
