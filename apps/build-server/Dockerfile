FROM node:22-alpine

RUN apk add --no-cache git 

WORKDIR /home/app

COPY src/index.ts src/index.ts
COPY package*.json .
COPY tsconfig.json tsconfig.json
COPY main.sh main.sh

RUN npm install

RUN chmod +x main.sh

ENTRYPOINT ["/home/app/main.sh"]