mkdir -p ./layer/nodejs
cp ./package.json ./layer/nodejs
cd ./layer/nodejs
yarn install --production
rm -rf ./node_modules/aws-sdk