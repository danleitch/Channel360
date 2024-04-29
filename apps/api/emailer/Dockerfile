FROM node:20.2-alpine3.17

WORKDIR /app

COPY package.json yarn.lock ./

COPY libs libs

COPY apps/api/emailer apps/api/emailer

RUN yarn install

RUN yarn workspace @channel360/core build

WORKDIR /app/apps/api/emailer

CMD ["yarn", "start"]