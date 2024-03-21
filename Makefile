VERSION := $(shell git describe --tags --always --long |sed -e "s/^v//")

.PHONY: proto

init: submodules clean proto

install: ## Install the web dependencies
	pnpm i

dev: ## Run the local dev server
	pnpm dev

build-dist: ## Build dist version
	pnpm build

proto:
	buf generate

clean:
	rm -rf dist
	rm -rf src/api/proto-http/*

submodules:
	git submodule update --init --recursive