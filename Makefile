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

# docker run --ulimit nofile=262144:262144 -v ./:/centrifugo -p 8000:8000 centrifugo/centrifugo:v5 centrifugo -c centrifugo-config.json
# "token_hmac_secret_key": "c7a7ac19-41dd-47cd-ab88-e1b1ebf75139",