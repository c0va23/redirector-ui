gen/:
	mkdir gen

gen/api-client/: gen/
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
		-o gen/api-client/
