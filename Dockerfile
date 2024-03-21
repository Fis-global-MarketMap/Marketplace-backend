FROM node:14-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN npm install -g nodemon 
RUN npm install pm2 -g
RUN yarn 
COPY . .
EXPOSE 3000
# Define environment variable
ENV NODE_ENV production
# Start app with PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
#CMD yarn start