FROM node:20.2-alpine3.17

WORKDIR /app

COPY package.json yarn.lock ./

COPY libs libs

COPY apps/api/organization apps/api/organization

RUN yarn install

RUN yarn workspace @channel360/core build

RUN yarn workspace organization build

WORKDIR /app/apps/api/organization

CMD ["node", "dist/index.js"]
