# Dockerfile for bot

FROM node:16-alpine

# Install app dependencies
COPY package.json yarn.lock ./

RUN yarn install

# Bundle app source
COPY . .

RUN yarn build

EXPOSE 80
EXPOSE 443
EXPOSE 8000

CMD [ "yarn", "node", "dist/bot", "-c", "todjrekt,jbezzo,retrocouchpotato,knifebyt,cdash01,fussybalel,robzen42,patkilo,funkadelicfungi,wolajo,will_frad,jim6452,bb_rose,redheadsista,steve_boots,generalmills66,viandepoule,ryoutakeshi"]
