FROM node:alpine as builder
RUN apk update && apk add --no-cache make git

RUN npm i -g @angular/cli

WORKDIR /usr/src/app

COPY ./ ./

RUN npm i

RUN ng build --prod

RUN pwd

RUN ls -la

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
