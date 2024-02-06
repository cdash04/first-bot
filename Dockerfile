# Dockerfile for bot

FROM node:20-alpine

# Install app dependencies
COPY package.json yarn.lock ./

RUN yarn install

# Bundle app source
COPY . .

RUN yarn build

EXPOSE 80
EXPOSE 443
EXPOSE 8000

CMD [ "yarn", "node", "dist/bot"]
