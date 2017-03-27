FROM golang

# upgrade apt and install deps
RUN apt update && \
    apt upgrade -y && \
    apt install -y \
        imagemagick \
        texlive-latex-recommended \
        texlive-latex-extra \
        texlive-science \
        texlive-math-extra \
        texlive-latex-extra \
        texlive-fonts-recommended \
        texlive-fonts-extra

# copy server source over
ADD . /go/src/github.com/alecaivazis/feynman
# install dependencies
RUN go get github.com/alecaivazis/feynman/...

WORKDIR $GOPATH/src/github.com/alecaivazis/feynman

RUN go build .

# run the server
EXPOSE 8081
# start the server at the exposed port
CMD ["feynman"]
