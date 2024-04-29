FROM node:20.2-alpine3.17

WORKDIR /app

COPY package.json yarn.lock ./

COPY libs libs

COPY apps/api/auth apps/api/auth

RUN yarn install --frozen-lockfile

RUN yarn workspace @channel360/core build

RUN yarn workspace auth build

WORKDIR /app/apps/api/auth

CMD ["node", "dist/index.js"]