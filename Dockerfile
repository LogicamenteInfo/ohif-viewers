FROM nginx:stable-alpine

RUN apk add --no-cache nodejs npm

RUN npm -g install javascript-obfuscator

ADD ./.docker/Viewer-v2.x/default.conf /etc/nginx/conf.d/default.conf

COPY .docker/Viewer-v2.x/update-config.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/update-config.sh

COPY ./platform/viewer/dist /usr/share/nginx/html
ADD ./.docker/Viewer-v2.x/app-config.js /usr/share/nginx/html/app-config.js.sample

EXPOSE 80
EXPOSE 443