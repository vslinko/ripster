# Variables

LOCALES = en ru

# Executables

WEBPACK = ./node_modules/.bin/webpack
ESLINT = ./node_modules/.bin/eslint
PO2JSON = ./node_modules/.bin/po2json
NODE = node

# Directories

BUILD_DIR = build
SRC_DIR = src
DIST_DIR = dist
PUBLIC_DIR = $(SRC_DIR)/public
PUBLIC_DIST_DIR = $(DIST_DIR)/public
LOCALE_DIR = $(SRC_DIR)/locale

# Files

PUBLIC_FILES = $(shell find $(PUBLIC_DIR) -type f)
PUBLIC_DIST_FILES = $(subst $(PUBLIC_DIR)/,$(PUBLIC_DIST_DIR)/,$(PUBLIC_FILES))

SOURCE_FILES = $(shell find $(SRC_DIR) -type f -name '*.js')

TRANSLATE_FILES = $(filter-out $(SRC_DIR)/webserver/template.js,$(SOURCE_FILES))
POT_FILE = $(LOCALE_DIR)/messages.pot
LOCALE_PO_FILES = $(LOCALES:%=$(LOCALE_DIR)/%.po)
LOCALE_JSON_FILES = $(LOCALE_PO_FILES:%.po=%.json)

# Commands

all: $(PUBLIC_DIST_FILES) $(LOCALE_JSON_FILES)
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

$(POT_FILE): $(TRANSLATE_FILES)
	xgettext --from-code UTF-8 -o "$@" $(TRANSLATE_FILES)

$(LOCALE_DIR)/%.po: $(POT_FILE)
	@touch "$@"
	msgmerge -U --backup=none "$@" "$<"

$(LOCALE_DIR)/%.json: $(LOCALE_DIR)/%.po
	$(PO2JSON) -pf jed $< $@
