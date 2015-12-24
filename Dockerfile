FROM resin/nuc-node

RUN apt-get install -y libgstreamer1.0-0
RUN apt-get install -y gstreamer1.0-plugins-base
RUN apt-get install -y gstreamer1.0-plugins-good