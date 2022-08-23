# Audiofiler

## Prerequisites
- Download [Docker](https://docs.docker.com/get-docker/)

## Run the app locally
```
// Download the source code
git clone git@github.com:TODO

// Build and start the containers in Docker
docker-compose --env-file=./config/.dev.env up --build

// Check api in browser
http://localhost:3000/songs

// Check client in browser
http://localhost:3001
```

## Docker
Setup based on tutorial [here](https://www.section.io/engineering-education/build-and-dockerize-a-full-stack-react-app-with-nodejs-and-nginx/)

### Create new container
- Add new folder in root 
- Add Dockerfile
- Add .dockerignore
- Build Image
    - `docker build -f Dockerfile -t client .`
- Run container and expose port for testing
    - `docker run it -p <exposedPort:dockerPort> <nameOfImage>`
    - `docker run -it -p 3000:3000 client`
- Now check http://localhost:3000



## TODO
- Test deployment to production
- Add mysql database
    - Create all the tables
    - Populate some dummy data
- Add file server
    - Populate some dummy files
- Consider setup with k8s/tilt
