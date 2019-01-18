clean-swagger:
	rm -r gen/

clean-dist:
	rm dist/*

clean-node_modules:
	rm -r node_modules/

clean-all: clean-swagger clean-dist clean-node_modules

gen/redirector-client/: api.yml
	mkdir gen
	docker run \
		--rm \
		-it \
		-v ${PWD}:/app \
		-w /app \
		--user $(shell id -u) \
		swaggerapi/swagger-codegen-cli \
		generate \
		-i api.yml \
		-l typescript-fetch \
		-D withInterfaces=true,npmName=redirector-client,supportsES6=true \
		-o gen/redirector-client/


gen/redirector-client/node_modules/: gen/redirector-client/
	cd gen/redirector-client && npm install && npm run build

node_modules/: package.json package-lock.json
	npm ci

dist/index.html: gen/redirector-client/ gen/redirector-client/node_modules/ node_modules/
	npm run build
