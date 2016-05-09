FROM phusion/baseimage

RUN apt-get update
RUN apt-get upgrade -y

RUN apt-get install -y nodejs npm imagemagick texlive-full
RUN ln -s /usr/bin/nodejs /usr/bin/node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

RUN npm run build-production

expose 4000
CMD node_modules/gulp/bin/gulp.js runserver --port 4000
