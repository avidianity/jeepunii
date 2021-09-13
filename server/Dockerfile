FROM node:16

WORKDIR /app

COPY . /app/

RUN yarn

RUN npm install -g @nestjs/cli

CMD [ "yarn", "start" ]
