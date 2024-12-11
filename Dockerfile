FROM node:18.12.1-alpine
WORKDIR /app

COPY . .

RUN npm install
RUN yarn build

EXPOSE 3000
ENV NODE_ENV production
ENV PORT 3000

CMD ["yarn", "start"]
