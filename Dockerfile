FROM resin/nuc-node:4.0

RUN apt-get update
RUN apt-get install -y libgstreamer1.0-0
RUN apt-get install -y gstreamer1.0-plugins-base
RUN apt-get install -y gstreamer1.0-plugins-good

COPY package.json /usr/src/app/package.json

WORKDIR /usr/src/app

RUN npm install

COPY . /usr/src/app

CMD ["npm", "start"]