FROM node:20.3-alpine3.17

WORKDIR /app

COPY package.json yarn.lock ./

COPY libs libs

COPY apps/api/scheduler apps/api/scheduler

RUN yarn install

RUN yarn workspace @channel360/core build

RUN yarn workspace scheduler build

WORKDIR /app/apps/api/scheduler

CMD ["node", "dist/index.js"]