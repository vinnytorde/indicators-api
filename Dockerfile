FROM node:latest

HEALTHCHECK \
    CMD curl -f http://localhost:3000/health/readiness || exit 1

WORKDIR /app
ADD . /app

RUN npm install
RUN npm run build

ENV PORT 3000
EXPOSE 3000

CMD npm start