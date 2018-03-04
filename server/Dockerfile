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

WORKDIR $GOPATH/src/github.com/AlecAivazis/feynman

# copy server source over
ADD . .

# install dependencies
RUN go get ./...

# build the server binary
RUN go build .

# run the server
EXPOSE 8081
# start the server at the exposed port
CMD ["feynman"]
