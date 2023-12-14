install:
	yarn install

run:
	yarn dev

build:
	yarn build && yarn start

docker-compose-stop:
	docker-compose down

docker-compose-start:
	docker-compose up -d --build

docker-compose-restart:
	stop start

.PHONY: install run build docker-compose-stop docker-compose-start docker-compose-restart
