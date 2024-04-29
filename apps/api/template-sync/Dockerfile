FROM node:20.2-alpine3.17

WORKDIR /app

COPY package.json yarn.lock ./

COPY libs/Core libs/Core

COPY apps/api/template-sync apps/api/template-sync

RUN yarn install --frozen-lockfile

RUN yarn workspace @channel360/core build

RUN yarn workspace template-sync build

WORKDIR /app/apps/api/template-sync

CMD ["node","dist/index.js"]
