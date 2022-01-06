FROM node:16

WORKDIR /var/www/native

COPY . .

RUN yarn global add expo-cli

RUN yarn

CMD [ "yarn", "start" ]
