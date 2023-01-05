# Dockerfile for bot

FROM node:16-alpine

# Create app directory

# Install app dependencies
COPY package.json yarn.lock ./

RUN yarn install

# Bundle app source
COPY . .

RUN yarn build

EXPOSE 80
CMD [ "yarn", "env-cmd", "-f", ".env.dev", "node", "dist/bot", "-c", "todjrekt,jbezzo,josnib,knifebyt,cdash01,fussybalel,robzen42,patkilo,funkadelicfungi,wolajo,will_frad,jim6452,bb_rose,redheadsista,steve_boots" ]