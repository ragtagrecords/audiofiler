FROM node:18.2.0
WORKDIR /usr/src/app
COPY ./ ./
RUN mkdir -p /usr/src/app/node_modules/.cache && chmod -R 777 /usr/src/app/node_modules/.cache && npm ci --legacy-peer-deps
ARG DB_SERVER_BASE_URL
ARG FILE_SERVER_BASE_URL
CMD ["npm", "run", "start"]
