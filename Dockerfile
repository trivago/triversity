FROM node:10

LABEL maintainers="GyuminLee <gyumin.lee@rwth-aachen.de>, EJang <de.eajang@gmail.com>"

EXPOSE 8888

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
# RUN npm run build

CMD [ "npm", "run", "dev" ]
