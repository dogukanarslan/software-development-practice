FROM node:14

COPY . /

EXPOSE 3000

RUN npm install

CMD ["npm", "start"]
