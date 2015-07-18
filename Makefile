# Executables

WEBPACK = ./node_modules/.bin/webpack
ESLINT = ./node_modules/.bin/eslint
NODE = node

# Directories

BUILD_DIR = build
SRC_DIR = src
DIST_DIR = dist
PUBLIC_DIR = $(SRC_DIR)/public
PUBLIC_DIST_DIR = $(DIST_DIR)/public

# Files

PUBLIC_FILES = $(shell find $(PUBLIC_DIR) -type f)
PUBLIC_DIST_FILES = $(subst $(PUBLIC_DIR)/,$(PUBLIC_DIST_DIR)/,$(PUBLIC_FILES))

# Commands

all: $(PUBLIC_DIST_FILES)
	$(WEBPACK)

clean:
	rm -rf $(DIST_DIR)

start: $(PUBLIC_DIST_FILES)
	$(NODE) server.js

lint:
	$(ESLINT) $(BUILD_DIR) $(SRC_DIR) *.js

.PHONY: all clean start lint

# Targets

$(PUBLIC_DIST_DIR)/%: $(PUBLIC_DIR)/%
	@mkdir -p "$(shell dirname $@)"
	cp "$<" "$@"
