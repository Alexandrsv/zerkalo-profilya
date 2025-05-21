#!/bin/bash

export $(grep -v '^#' .env | xargs -d '\n')
echo "$POSTGRES_PORT"

#pg_dump -h zbc.su -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" > dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql
#pg_dump --dbname="postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@zbc.su:$POSTGRES_PORT/$POSTGRES_DB" > dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql
#docker-compose exec postgres pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" > dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql
#docker-compose exec postgres pg_dump --dbname=postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@zbc.su:$POSTGRES_PORT/$POSTGRES_DB
#> dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql

#docker-compose exec -T postgres  psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" <dump_16-11-2022_21_31_18.sql


unset $(grep -v '^#' .env | sed -E 's/(.*)=.*/\1/' | xargs)
echo "$POSTGRES_PORT"
