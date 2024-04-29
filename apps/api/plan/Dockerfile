FROM node:20.2-alpine3.17

WORKDIR /app

COPY package.json yarn.lock ./

COPY libs libs

COPY apps/api/plan apps/api/plan

RUN yarn install --frozen-lockfile

RUN yarn workspace @channel360/core build

RUN yarn workspace plan build

WORKDIR /app/apps/api/plan

CMD ["node","dist/index.js"]
