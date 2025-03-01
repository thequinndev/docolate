FROM node:alpine

RUN apk update && apk add --no-cache git

WORKDIR /usr/docolate
COPY . /usr/docolate

RUN npm i -g

WORKDIR /usr/migration-manager

RUN mkdir /tmp/mock-git
COPY ./examples/migration-manager/docolate-migrate /tmp/mock-git/migration-manager
COPY ./examples/migration-manager/docolate-migrate.yml /tmp/mock-git/migration-manager/docolate-migrate.yml
COPY ./docker/migration-manager/mock-git/1.0.0 /tmp/mock-git/1.0.0
COPY ./docker/migration-manager/mock-git/1.1.0 /tmp/mock-git/1.1.0

RUN git config --global user.email "mock@migration-manager"
RUN git config --global user.name "migration-manager"

RUN git init

RUN cp -r /tmp/mock-git/1.0.0/* /usr/migration-manager/

RUN git add . && git commit -m "v1.0.0" && git tag 1.0.0

RUN cp -rf /tmp/mock-git/1.1.0/* /usr/migration-manager/

RUN git add . && git commit -m "v1.1.0" && git tag 1.1.0

RUN cp -r /tmp/mock-git/migration-manager/* /usr/migration-manager/

#docker-compose run migration-manager docolate-migrate /usr/docolate/examples/migration-manager