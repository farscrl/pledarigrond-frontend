#stage 1
FROM node:latest as node
WORKDIR /app
COPY . .
RUN cd frontend && npm install
#RUN cd frontend && npm run build --prod
RUN cd frontend && (node_modules/.bin/ng -c=test)
RUN cd admin && npm install
RUN cd admin && (node_modules/.bin/ng -c=test)


#stage 2
FROM nginx:alpine
COPY --from=node /app/dist /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
