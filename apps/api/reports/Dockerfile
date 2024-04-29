FROM node:20.2-alpine3.17

WORKDIR /app

COPY package.json yarn.lock ./

COPY libs libs

COPY apps/api/reports apps/api/reports

RUN yarn install --frozen-lockfile

RUN yarn workspace @channel360/core build

RUN yarn workspace reports build

WORKDIR /app/apps/api/reports

CMD ["node","dist/index.js"]
