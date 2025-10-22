#stage 1
ARG ANGULAR_ENV=prod
FROM node:22-alpine as node
# https://benkyriakou.com/posts/docker-args-empty
ARG ANGULAR_ENV
RUN echo "Building Angular configuration: $ANGULAR_ENV"
WORKDIR /app
COPY . .
RUN npm install -g corepack
RUN corepack enable
RUN cd frontend && pnpm install
#RUN cd frontend && pnpm run build --prod
RUN cd frontend && (pnpm exec ng build -c $ANGULAR_ENV)
RUN cd admin && pnpm install
RUN cd admin && (pnpm exec ng build -c $ANGULAR_ENV)


#stage 2
FROM nginx:alpine
COPY --from=node /app/dist /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf

RUN echo "daemon off;" >> /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["/usr/sbin/nginx"]
