FROM node:20.2-alpine3.17

WORKDIR /app

COPY package.json yarn.lock ./

COPY libs libs

COPY apps/api/subscriber apps/api/subscriber

RUN yarn install --frozen-lockfile

RUN yarn workspace @channel360/core build

RUN yarn workspace subscriber build

WORKDIR /app/apps/api/subscriber

RUN yarn global add pm2

ENV PM2_PUBLIC_KEY 8ayaxg9tr5pqb9x
ENV PM2_SECRET_KEY iew3elzcb4l2w29


CMD ["pm2-runtime","dist/index.js"]
