FROM resin/nuc-node:4.0

ENV INITSYSTEM on

RUN apt-get update
RUN apt-get install -y libgstreamer0.10-0
RUN apt-get install -y gstreamer0.10-tools
RUN apt-get install -y gstreamer0.10-plugins-base
RUN apt-get install -y gstreamer0.10-plugins-good
RUN apt-get install -y gstreamer0.10-plugins-bad

COPY package.json /usr/src/app/package.json

WORKDIR /usr/src/app

RUN npm install

COPY . /usr/src/app

CMD ["npm", "start"]