FROM node:4.2.1-wheezy

COPY . /src
RUN cd /src; npm i

ENV COUCHDB_USERNAME <username>
ENV COUCHDB_PASSWORD <password>
ENV COUCHDB_URL https://pebblecode.cloudant.com
ENV COUCHDB_PORT 443
ENV COUCHDB_NAME pebblecode-wfh-dev

EXPOSE 3000
CMD ["node", "/src/index.js"]
