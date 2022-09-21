# Audiofiler

## Install Docker

### Linux
[Install Docker](https://docs.docker.com/engine/install/ubuntu/)

[Install Docker Compose](https://docs.docker.com/compose/install/linux/#install-using-the-repository)

If you see `The repository does not have a Release file` when running `sudo apt-get update`
```
# check UBUNTU_CODENAME here
grep CODENAME /etc/os-release

# change name here to match
nano /etc/apt/sources.list.d/docker.list

# try again
sudo apt-get update
```

## Local development

Clone the repo

`git clone git@github.com:ragtagrecords/audiofiler.git`

Enter the repo and run the setup script

`cd audiofiler && sh setup.sh`

Build the docker containers

`docker-compose --env-file=./config/.dev.env up --build`

# Test in browser
_Ports and base URL's for different environments defined in /config/*.env_
- [Client](http://localhost:3000/)
- [Database Server](http://localhost:3001/songs)
- [File Server](http://localhost:3002/songs/130%20stuck%20in%20the%20ice.mp3)
- [mySQL interface](http://localhost:8080)

## Manually deploy to production
Connect to the server

`ssh user@68.101.73.99`

Update to new code

`cd ~/Apps/audiofiler && git fetch origin main && git reset origin/main`

Stop the containers

`sudo docker-compose --env-file=./config/.prod.env down`

Build and start the docker containers

`sudo docker-compose --env-file=./config/.prod.env up --build -d`