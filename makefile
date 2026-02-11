BINPATH = bin
FRONT_PREFIX = frontend

.PHONY: build
build: build-front build-panel build-pam

.PHONY: build-panel
build-panel:
	go build -o $(BINPATH)/panel cmd/panel/main.go

.PHONY: build-pam-socks
build-pam-socks:
	go build -o $(BINPATH)/pam cmd/pam-socks/main.go

.PHONY: build-front
build-front:
	npm --prefix $(FRONT_PREFIX) run build -- --minify

.PHONY: watch
watch:
	$(MAKE) -j2 watch-panel watch-front

.PHONY: watch-panel
watch-panel:
	go run github.com/air-verse/air@latest \
	--build.cmd "$(MAKE) build-panel" \
	--build.bin "$(BINPATH)/panel" \
	--build.include_ext "go,html,css,js" \
	--build.include_dir "$(FRONT_PREFIX)/dist" \
	--build.exclude_dir "bin"

.PHONY: watch-front
watch-front:
	npm --prefix $(FRONT_PREFIX) run build -- --watch

.PHONY: install-deps
install-deps:
	npm --prefix $(FRONT_PREFIX) install
	go mod download
