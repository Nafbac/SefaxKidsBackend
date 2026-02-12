FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN \
  if [ -f yarn.lock ]; then yarn install; \
  else npm install; \
  fi

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
