# Use a Node.js base image
FROM node:20.2-alpine3.17

WORKDIR /app

# Copy the root package.json and yarn.lock.json files into the container
COPY package.json yarn.lock ./

# Copy the entire "libs" directory into the container
COPY libs libs

# Copy the client directory into the container
COPY apps/frontend/admin apps/frontend/admin

# Install dependencies from the root package.json
RUN yarn install

RUN yarn workspace @channel360/ui-core build

WORKDIR /app/apps/frontend/admin

RUN yarn build

CMD ["yarn", "start"]
