FROM node:12-alpine
WORKDIR /app
COPY . .
RUN npm config set registry http://registry.npmjs.org
RUN npm install
RUN npm run build
CMD ["npm", "run", "start:prod"]