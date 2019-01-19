clean-swagger:
	rm -r gen/ || true

clean-dist:
	rm dist/* || true

clean-node_modules:
	rm -rf node_modules/ || true

clean-all: clean-swagger clean-dist clean-node_modules

gen/redirector-client/: api.yml
	mkdir gen
	docker run \
		--rm \
		-it \
		-v ${PWD}:/app \
		-w /app \
		--user $(shell id -u) \
		swaggerapi/swagger-codegen-cli:2.4.1 \
		generate \
		-i api.yml \
		-l typescript-fetch \
		-D withInterfaces=true,npmName=redirector-client,supportsES6=true,npmRepository=github.com/c0va23/redirector-ui \
		-o gen/redirector-client/
	cd gen/redirector-client && npm install --no-save && npm run build

node_modules/: package.json gen/redirector-client/
	npm ci

dist/index.html: node_modules/
	npm run build
