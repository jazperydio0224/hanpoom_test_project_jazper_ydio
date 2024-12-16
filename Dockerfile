FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

# docker build -t hanpoom-test-project-docker .
# docker run -p 3000:3000 hanpoom-test-project-docker
