FROM node:22-alpine

WORKDIR /app

COPY package.json .yarnrc.yml ./
COPY .yarn ./.yarn
COPY packages/back/package.json ./packages/back/
COPY .env ./

RUN yarn workspaces focus @feedback/back --production

COPY ./packages/back ./packages/back

RUN cd packages/back && npx prisma generate

CMD [ "yarn", "back:start" ]
