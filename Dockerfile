# Dockerfile
FROM node:19
FROM prom/prometheus:lastest
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 9000
CMD ["node", "cluster/master.js"]
