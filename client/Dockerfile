FROM node:18.2.0
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm ci --legacy-peer-deps
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache
ARG DB_SERVER_BASE_URL
ARG FILE_SERVER_BASE_URL
CMD ["npm", "run", "start"]