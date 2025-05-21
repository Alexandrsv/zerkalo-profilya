FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

#RUN npm install --only=prod --loglevel verbose

RUN npm ci --omit=dev

COPY . .

RUN npx prisma generate

#RUN npm run build



CMD [ "npm", "run", "start2" ]
