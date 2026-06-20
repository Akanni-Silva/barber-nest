FROM node:18-alpine

WORKDIR /usr/src/app

# install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# copy source and build
COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["node", "dist/main.js"]
