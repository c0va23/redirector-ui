#!/bin/sh

ESCAPED_API_URI=$(echo $API_URI | sed -e 's/\//\\\//g')

sed \
    -i /app/index.html \
    -e "s/data-api-uri=\"\"/data-api-uri=\"$ESCAPED_API_URI\"/g"

nginx -g 'daemon off;'
