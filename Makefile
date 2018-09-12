swagger-clean:
	rm -r gen/

swagger-gen:
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

	cd gen/redirector-client && npm install && npm run build
