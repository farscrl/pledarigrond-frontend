#stage 1
ARG ANGULAR_ENV=prod
FROM node:latest as node
# https://benkyriakou.com/posts/docker-args-empty
ARG ANGULAR_ENV
RUN echo "Building Angular configuration: $ANGULAR_ENV"
WORKDIR /app
COPY . .
RUN cd frontend && npm install
#RUN cd frontend && npm run build --prod
RUN cd frontend && (node_modules/.bin/ng build -c $ANGULAR_ENV)
RUN cd admin && npm install
RUN cd admin && (node_modules/.bin/ng build -c $ANGULAR_ENV)


#stage 2
FROM nginx:alpine
EXPOSE 8080
COPY --from=node /app/dist /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
# Fix for a Jelastic issue (see: https://guillermo.at/jelastic-docker-cmd)
CMD nginx -g "daemon off;"
