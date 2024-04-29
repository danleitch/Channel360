FROM node:20.3-alpine3.17

WORKDIR /app

COPY package.json yarn.lock ./

COPY libs libs

COPY apps/api/templates apps/api/templates

RUN yarn install --frozen-lockfile

RUN yarn workspace @channel360/core build

RUN yarn workspace templates build

WORKDIR /app/apps/api/templates

CMD ["node","dist/index.js"]
