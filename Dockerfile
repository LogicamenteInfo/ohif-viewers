FROM nginx:stable-alpine

WORKDIR /analytics

RUN apk add --no-cache wget curl supervisor nodejs npm

RUN npm -g install javascript-obfuscator

RUN wget https://github.com/prometheus/node_exporter/releases/download/v1.3.1/node_exporter-1.3.1.linux-amd64.tar.gz
RUN tar xvfz node_exporter-*.*-amd64.tar.gz

RUN wget https://github.com/nginxinc/nginx-prometheus-exporter/releases/download/v0.10.0/nginx-prometheus-exporter_0.10.0_linux_amd64.tar.gz
RUN tar xvfz nginx-prometheus-exporter*.*amd64.tar.gz

RUN wget https://github.com/prometheus/prometheus/releases/download/v2.32.1/prometheus-2.32.1.linux-amd64.tar.gz
RUN tar xvfz prometheus-*-amd64.tar.gz

COPY .docker/Viewer-v2.x/entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

COPY .docker/Viewer-v2.x/update-config.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/update-config.sh

ADD ./.docker/Viewer-v2.x/default.conf /etc/nginx/conf.d/default.conf
ADD ./.docker/Viewer-v2.x/supervisord.conf /etc/supervisor.d/default.ini
ADD ./.docker/Viewer-v2.x/prometheus.yml /analytics/prometheus.yml
ADD ./.docker/Viewer-v2.x/prometheus.web.yml /analytics/web.yml

COPY ./platform/viewer/dist /usr/share/nginx/html
ADD ./.docker/Viewer-v2.x/app-config.js /usr/share/nginx/html/app-config.js.sample

EXPOSE 80
EXPOSE 443
EXPOSE 9090