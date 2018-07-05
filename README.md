# Redirector UI

WEB UI for [redirector](https://github.com/c0va23/redirector)

[![Build Status](https://travis-ci.org/c0va23/redirector-ui.svg?branch=master)](https://travis-ci.org/c0va23/redirector-ui)

## Run

### Run with docker

```bash
docker run -p 8080:80 -e API_URL=http://myhost.org c0va23/redirector-ui
```

When `API_URL` is url of redirector server. Can be skipped.

## Build

### Requires

Build tested with:

- nodejs (version 8.11.3)
- make (version 4.1)
- docker (version 18.03.1-ce)

```bash
# Prepare
make swagger-gen
npm ci

# CI
npm run lint
npm run build

# Build
npm run build

# Show result
ls dist/*
```
