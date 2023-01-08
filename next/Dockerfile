FROM node:18.2.0
WORKDIR /usr/src/app
COPY ./ ./
RUN npm ci && mkdir -p /usr/src/app/node_modules/.cache && chmod -R 777 /usr/src/app/node_modules/.cache
CMD ["npm", "run", "dev"]
