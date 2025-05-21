#!/bin/sh
[ ! -f .env ] || export $(sed 's/#.*//g' .env | xargs)

echo "$VK_AUTH_MOCK"
npx autocannon -c 100 -m 'POST' -b '{"vkId": "507511668","name": "Габриэль Лепёхин","sex": "2","age": 33}' -H 'Content-Type: application/json' -H "auth: $VK_AUTH_MOCK" 'http://localhost:3005/users/login/'
