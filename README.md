
Start 
`docker build -t da-back . `
`docker compose  up -d `
to run migration `docker-compose exec da-back npm exec knex migrate:up`

update