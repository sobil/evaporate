FROM node:12
MAINTAINER SEEK Ltd.

RUN yarn add evaporate -g

ENTRYPOINT ["./evaporate"]
