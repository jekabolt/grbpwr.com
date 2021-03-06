REPOSITORY=jekabolt
IMAGE_NAME=grbpwr.com
VERSION=1.0.0

run:
	ng serve --host 0.0.0.0


image:
	docker build -t $(REPOSITORY)/${IMAGE_NAME}:$(VERSION) -f ./Dockerfile .

image-run:
	docker run -d --name grbpwr.com -e SERVER_PORT=8080 -p 8080:8080 $(REPOSITORY)/${IMAGE_NAME}:$(VERSION)
