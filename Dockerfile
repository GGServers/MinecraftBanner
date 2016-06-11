FROM node:argon
# Create app directory
RUN apt-get update && apt-get install -y libgd2-dev
RUN mkdir -p /usr/src/banner
WORKDIR /usr/src/banner

# Install app dependencies
COPY ./src/package.json /usr/src/banner/
RUN npm install

# Bundle app source
COPY ./src/* /usr/src/banner/

EXPOSE 8080
CMD [ "npm", "start" ]
