FROM node:20.2-alpine3.17

WORKDIR /app

COPY package.json yarn.lock ./

COPY libs libs

COPY apps/api/campaigns apps/api/campaigns

RUN yarn install --frozen-lockfile

RUN yarn workspace @channel360/core build

RUN yarn workspace campaigns build

WORKDIR /app/apps/api/campaigns

CMD ["node", "dist/index.js"]

