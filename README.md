# grbpwr.com site

## Building the project

```shell script
   npm i
```

## Run

```shell script
    make run
```

## Build docker image

```shell script
    make image
```

## Run in docker

```shell script
    make image-run
```

## Github secrets needed for deploy 

```shell script
BASE_HREF=https://grbpwr.com  # url for prod build 

```
```shell script
SSH_HOST=1.1.1.1
SSH_PASS=xxx
SSH_USER=xxx
```