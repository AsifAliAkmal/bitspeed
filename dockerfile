FROM node:18-alpine

#Create a app directory
WORKDIR /app

# Set environment variables
ENV DB_NAME=bitspeed
ENV DB_USER=root
ENV DB_PASSWORD=asdfghjk
ENV DB_HOST=host.docker.internal
ENV DB_DIALECT=mysql

#Install app dependencies
COPY package*.json ./

#Run npm install
RUN npm install

#Bundle app source
COPY . .

EXPOSE 8080


CMD ["npm","start"]