FROM node:16

WORKDIR /app

COPY . /app/

RUN yarn

RUN yarn prebuild \
	&& yarn build

CMD [ "yarn", "start:dev" ]
