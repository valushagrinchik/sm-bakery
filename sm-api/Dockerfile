FROM node:22-alpine as base
WORKDIR /app
COPY package.json ./
RUN npm i
EXPOSE 3000/tcp

FROM base AS builder_api

WORKDIR /app
COPY . .

RUN npm run build

FROM base AS builder_email_service

WORKDIR /app
COPY . .

RUN npm run email-service:build

FROM base AS builder_sms_service

WORKDIR /app
COPY . .

RUN npm run sms-service:build

FROM base AS builder_catalog_parsing_service

WORKDIR /app
COPY . .

RUN npm run catalog-parsing-service:build

FROM base AS builder_notification_service

WORKDIR /app
COPY . .

RUN npm run notification-service:build

FROM base as production_api

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder_api /app/dist ./dist
COPY --from=builder_api /app/node_modules ./node_modules
COPY nest-cli.json tsconfig.json .env ./

CMD ["node", "./dist/apps/san-martin-api/main.js"]

FROM base as production_email_service

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder_email_service /app/dist ./dist
COPY --from=builder_email_service /app/node_modules ./node_modules
COPY nest-cli.json tsconfig.json .env ./

CMD ["node", "./dist/apps/email-service/main.js"]

FROM base as production_sms_service

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder_sms_service /app/dist ./dist
COPY --from=builder_sms_service /app/node_modules ./node_modules
COPY nest-cli.json tsconfig.json .env ./

CMD ["node", "./dist/apps/sms-service/main.js"]

FROM base as catalog_parsing_service

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder_catalog_parsing_service /app/dist ./dist
COPY --from=builder_catalog_parsing_service /app/node_modules ./node_modules
COPY nest-cli.json tsconfig.json .env ./

CMD ["node", "./dist/apps/catalog-parsing-service/main.js"]

FROM base as notification_service

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder_notification_service /app/dist ./dist
COPY --from=builder_notification_service /app/node_modules ./node_modules
COPY nest-cli.json tsconfig.json .env ./

CMD ["node", "./dist/apps/notification-service/main.js"]

FROM base as migration

WORKDIR /app
COPY . .

RUN npm run migration:up

FROM base AS test

WORKDIR /app

COPY . .
COPY nest-cli.json tsconfig.json .env ./
