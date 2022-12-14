FROM node:16 

WORKDIR /usr/src/app 

COPY package.json ./
COPY yarn.lock ./ 

RUN yarn 

COPY . . 

ENV NODE_ENV production 

EXPOSE 6969 

CMD ["node", ""]