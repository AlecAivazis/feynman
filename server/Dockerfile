FROM phusion/baseimage

# upgrade apt
RUN apt update
RUN apt upgrade -y

# install deps
RUN apt install -y \
    imagemagick \
    texlive-full

# copy server source over
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

# run the server
EXPOSE 4000
# start the server at the exposed port
ENTRYPOINT ["python3", "app.py", "--port", "4000"]
