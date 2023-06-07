FROM node:16-alpine as development

WORKDIR /usr/src/app
COPY package*.json yarn.lock ./
RUN yarn install

COPY . .

RUN yarn build

FROM node:16-alpine as production
WORKDIR /usr/src/app
COPY package*.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/config ./config

EXPOSE 3001

CMD [ "node", "dist/index.js" ]