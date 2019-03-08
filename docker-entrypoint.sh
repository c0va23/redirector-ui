#!/bin/sh

ESCAPED_API_URL=$(echo $API_URL | sed -e 's/\//\\\//g')

sed \
    -i /app/index.html \
    -e "s/data-api-url=\"\"/data-api-url=\"$ESCAPED_API_URL\"/g"

exec nginx -g 'daemon off;'
