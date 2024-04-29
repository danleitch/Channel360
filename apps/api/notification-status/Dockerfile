FROM node:20.2-alpine3.17

WORKDIR /app

COPY package.json yarn.lock ./

COPY libs libs

COPY apps/api/notification-status apps/api/notification-status

RUN yarn install --frozen-lockfile

RUN yarn workspace @channel360/core build

RUN yarn workspace notification-status build

WORKDIR /app/apps/api/notification-status

CMD ["node", "dist/index.js"]