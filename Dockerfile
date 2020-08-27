FROM node:12

WORKDIR /usr/src/blog-api

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]