# Generate code from thrift-files
FROM swaggerapi/swagger-codegen-cli AS thrift

ADD api.yml /app/

RUN java -jar /opt/swagger-codegen-cli/swagger-codegen-cli.jar \
    generate \
    -i /app/api.yml \
    -l typescript-fetch \
    -D withInterfaces=true,npmName=redirector-client,supportsES6=true \
    -o /app/gen/redirector-client/


# Build static files
FROM node:10-alpine AS builder

WORKDIR /app

# Build redirect-client
COPY --from=thrift /app/gen /app/gen
RUN cd gen/redirector-client && npm install && npm run build

ADD package-lock.json package.json /app/
RUN npm ci

ADD webpack.config.js tsconfig.json /app/
ADD src/ /app/src/
RUN npm run build


# Build nginx-server image
FROM nginx:1.14-alpine

COPY --from=builder /app/dist/* /app/

ADD nginx.conf /etc/nginx/

ADD docker-entrypoint.sh /usr/bin/

CMD [ "/usr/bin/docker-entrypoint.sh" ]
