FROM golang

# upgrade apt and install deps
RUN apt update && \
    apt upgrade -y && \
    apt install -y \
    imagemagick \
    texlive-latex-recommended \
    texlive-latex-extra \
    texlive-science \
    texlive-latex-extra \
    texlive-fonts-recommended \
    texlive-fonts-extra

WORKDIR /usr/src/app

# copy server source over
ADD . .

# pre-copy/cache go.mod for pre-downloading dependencies and only redownloading them in subsequent builds if they change
COPY go.mod ./
RUN go mod download && go mod verify

# build the server binary
RUN go build .

# start the server at the exposed port
CMD ["feynman"]
