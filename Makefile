IMAGE_NAME ?= node-backend

install:
	yarn install

run:
	yarn dev

build:
	yarn build && yarn start

docker-build:
	docker build . -t ${IMAGE_NAME}

docker-run:
	docker run -p 3001:3001 -d ${IMAGE_NAME}

.PHONY: install run build docker-build docker-run

# docker run -p 3567:3567 -e API_KEYS="test-api-key-for-my-cloud-storage" -d registry.supertokens.io/supertokens/supertokens-postgresql:7.0
# http://localhost:3001/api/dashboard/