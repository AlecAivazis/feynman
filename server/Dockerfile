FROM phusion/baseimage

# upgrade apt and install deps
RUN apt update && \
    apt upgrade -y && \
    apt install -y \
        imagemagick \
        texlive-science

RUN apt install -y python3-pip

# prepare the working directory
RUN mkdir -p /usr/feynman
WORKDIR /usr/feynman

# setup environment
ENV LC_ALL_=C.UTF-8
ENV LANG=C.UTF-8

# copy and install dependencies over first
COPY ./requirements.txt /usr/feynman
RUN pip3 install -r /usr/feynman/requirements.txt

# copy server source over
VOLUME . /usr/feynman

# run the server
EXPOSE 4000
# start the server at the exposed port
CMD ["python3", "app.py", "--port", "4000", "--debug=true"]
