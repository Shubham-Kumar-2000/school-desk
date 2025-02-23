# school-desk

## Backend

Installation steps

- Install Postgres Server
- Install Kafka cluster
- Get a AWS account with access to SNS.
- Get Gemini API Keys
- Open `backend` as root directory
- Get a Firebase account generate service key and store in `backend` as `firebase-secret.json`
- Copy the `sample.env` and create a `.env` with proper values.
- Run `npm i`
- Run `npm run initBackend <admin_name> <email> <password>`. This will init the database and create a admin with the given values.
- To start backend server run `npm start`
- To start scheduler service `npm run cron`
- To start kafka consumer `npm run kafka


## Frontend

Installation steps

- Open `frontend` as root directory
- Get a Firebase account generate vapid key and client config to store in `src/utils` as `firebase.js`
- Copy the `sample.env` and create a `.env` with proper values.
- Run `npm i & npm build`
- Run `npm start`. 


Thus you get

- Teachers Admin panel as : `<backend_url>/admin`
- Parents Dashboard as: `<frontend_url>`

You may also import the postman collection using `School Desk.postman_collection.json`

