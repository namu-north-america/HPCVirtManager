# Node Builder
FROM node:22-bookworm AS builder

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN cd /usr/src/app/public/ && git clone https://github.com/novnc/noVNC.git

RUN cd /usr/src/app && npm install && npm run build

# Install the 'file' utility
RUN apt-get update && apt-get install -y file

# NGINX Image
FROM nginx:1.27-alpine

RUN mkdir -p /etc/nginx/location.d/

RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl && \
    chmod +x ./kubectl && mv ./kubectl /usr/local/bin

COPY 91-startkubectl.sh /docker-entrypoint.d

COPY conf/*.conf /etc/nginx/conf.d/

RUN chmod +x /docker-entrypoint.d/91-startkubectl.sh

COPY --from=builder /usr/src/app/build /usr/share/nginx/html
