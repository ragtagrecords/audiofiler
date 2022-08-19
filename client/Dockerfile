FROM node:18.2.0
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm ci --legacy-peer-deps
ARG API_BASE_URL
ENV REACT_APP_API_BASE_URL $API_BASE_URL
CMD ["npm", "run", "start"]