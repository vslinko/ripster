# Executables

WEBPACK = ./node_modules/.bin/webpack
ESLINT = ./node_modules/.bin/eslint
NODE = node

# Directories

BUILD_DIR = build
SRC_DIR = src
DIST_DIR = dist

# Commands

all:
	$(WEBPACK)

clean:
	rm -rf $(DIST_DIR)

start:
	$(NODE) server.js

lint:
	$(ESLINT) $(BUILD_DIR) $(SRC_DIR) *.js

.PHONY: all clean start lint
