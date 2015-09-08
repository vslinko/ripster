# Variables

LOCALES = en ru
CUCUMBER_FORMAT ?= pretty

# Executables

WEBPACK = ./node_modules/.bin/webpack
PO2JSON = ./node_modules/.bin/po2json
BABEL = ./node_modules/.bin/babel
NODE = node

# Directories

SRC_DIR = src
DIST_DIR = dist
PUBLIC_DIR = $(SRC_DIR)/public
PUBLIC_DIST_DIR = $(DIST_DIR)/public
LOCALE_DIR = $(SRC_DIR)/locale
CUCUMBER_DIR = features
CUCUMBER_DIST_DIR = features-dist

# Files

PUBLIC_FILES = $(shell find $(PUBLIC_DIR) -type f)
PUBLIC_DIST_FILES = $(subst $(PUBLIC_DIR)/,$(PUBLIC_DIST_DIR)/,$(PUBLIC_FILES))

SOURCE_FILES = $(shell find $(SRC_DIR) -type f -name '*.js')

TRANSLATE_FILES = $(filter-out $(SRC_DIR)/webserver/template.js,$(SOURCE_FILES))
POT_FILE = $(LOCALE_DIR)/messages.pot
LOCALE_PO_FILES = $(LOCALES:%=$(LOCALE_DIR)/%.po)
LOCALE_JSON_FILES = $(LOCALE_PO_FILES:%.po=%.json)

CUCUMBER_JS_FILES = $(shell find $(CUCUMBER_DIR) -type f -name '*.js')
CUCUMBER_DIST_JS_FILES = $(subst $(CUCUMBER_DIR)/,$(CUCUMBER_DIST_DIR)/,$(CUCUMBER_JS_FILES))

# Commands

all: $(PUBLIC_DIST_FILES) $(LOCALE_JSON_FILES)
	$(WEBPACK)

clean:
	rm -rf $(DIST_DIR) $(CUCUMBER_DIST_DIR)

acceptance_test: $(CUCUMBER_DIST_JS_FILES)
	./node_modules/.bin/cucumber-js --format $(CUCUMBER_FORMAT) features-dist

.PHONY: all clean acceptance_test

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

$(CUCUMBER_DIST_DIR)/%.js: $(CUCUMBER_DIR)/%.js
	@mkdir -p "$(shell dirname $@)"
	$(BABEL) $< -o $@
