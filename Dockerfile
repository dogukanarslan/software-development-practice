FROM node:14

WORKDIR /home/node/app

# Install app dependncies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

CMD ["npm", "start"]
