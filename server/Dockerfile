FROM golang

# upgrade apt and install deps
RUN apt update && \
    apt upgrade -y && \
    apt install -y \
        imagemagick \
        texlive-science

RUN apt install -y texlive-latex-extra

# copy server source over
ADD . /go/src/github.com/alecaivazis/feynman
# install dependencies
RUN go get github.com/alecaivazis/feynman/...
RUN go install github.com/alecaivazis/feynman

# run the server
EXPOSE 8081
# start the server at the exposed port
CMD ["feynman"]
