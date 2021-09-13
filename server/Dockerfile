FROM node:16

WORKDIR /app

COPY . /app/

RUN yarn

RUN npm install -g @nestjs/cli

RUN nest update

CMD [ "yarn", "start" ]
