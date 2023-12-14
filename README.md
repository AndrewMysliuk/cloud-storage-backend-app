# Cloud Storage Node.js Backend

### Install Dependencies

```
make install
```

### Run Backend (Development Mode)

```
make run
```

### Build And Run (Locally)

```
make build
```

### Build And Run Docker-Compose

```
make docker-compose-start
```

### Enter To Supertokens Dashboard

```
http://localhost:3001/api/dashboard
```

### Create User For Supertokens Dashboard

```
curl --location --request POST 'http://localhost:3567/recipe/dashboard/user' \
--header 'rid: dashboard' \
--header 'api-key: test-api-key-for-my-cloud-storage' \
--header 'Content-Type: application/json' \
--data-raw '{"email": "<YOUR_EMAIL>","password": "<YOUR_PASSWORD>"}'
```
