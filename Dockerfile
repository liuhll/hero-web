FROM node:12.13.0 as build
LABEL maintainer="1029765111@qq.com"

WORKDIR /app
COPY . .
ARG env=prod

# RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN npm config set registry https://registry.yarnpkg.com

RUN npm install && \
    npm run build:${env}

FROM nginx:latest
LABEL maintainer="1029765111@qq.com"

COPY --from=build /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]