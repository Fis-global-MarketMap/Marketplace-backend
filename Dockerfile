FROM node:16-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN npm install -g nodemon 
RUN npm install pm2 -g
RUN yarn 
COPY . .
EXPOSE 3000
# Define environment variable
ENV NODE_ENV production
ENV MONGO_URI $MONGO_URI
ENV PORT $PORT
ENV EMAIL $EMAIL
ENV PASSWORD $PASSWORD
ENV FRONTEND_URL $FRONTEND_URL
# Start app with PM2
#CMD ["pm2-runtime", "start", "ecosystem.config.js"]
CMD nodemon
#CMD yarn start