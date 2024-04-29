FROM node:20.3-alpine3.17

WORKDIR /app

COPY package.json yarn.lock ./

COPY libs libs

COPY apps/api/send-campaign apps/api/send-campaign

RUN yarn install

RUN yarn workspace @channel360/core build

RUN yarn workspace send-campaign build

WORKDIR /app/apps/api/send-campaign

CMD ["node", "dist/index.js"]
