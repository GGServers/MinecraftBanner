FROM node:latest
# Create app directory
RUN apt-get update && apt-get install -y libgd-dev
RUN mkdir -p /usr/src/banner/{lib,template,cache}

WORKDIR /usr/src/banner/

# Copy appropiate files
COPY src/ /usr/src/banner/

# Install app dependencies
RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]
