FROM node:20.2-alpine3.17

WORKDIR /app

COPY package.json yarn.lock ./

COPY libs libs

COPY apps/api/logging apps/api/logging

RUN yarn install

RUN yarn workspace @channel360/core build

RUN yarn workspace logging build

WORKDIR /app/apps/api/logging

CMD ["node", "dist/index.js"]
