# Audiofiler

## Run the app locally
Download [Docker](https://docs.docker.com/get-docker/) then run these commands in a linux-based terminal
```
git clone git@github.com:ragtagrecords/audiofiler.git
cd audiofiler
sh setup.sh
docker-compose --env-file=./config/.dev.env up --build
```

## Test in browser
_Ports and base URL's for different environments defined in /config/*.env_
- [Client](http://localhost:3000/)
- [Database Server](http://localhost:3001/songs)
- [File Server](http://localhost:3002/songs/130%20stuck%20in%20the%20ice.mp3)
- [mySQL interface](http://localhost:8080)

