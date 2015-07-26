# Variables

LOCALES = en ifeq
DUMP_FEATURES ?= true
BROWSER ?= chrome
BROWSER_ENGINE ?= jsdom
CUCUMBER_FORMAT ?= pretty

# Executables

WEBPACK = ./node_modules/.bin/webpack
ESLINT = ./node_modules/.bin/eslint
PO2JSON = ./node_modules/.bin/po2json
BABEL = ./node_modules/.bin/babel
SELENIUM_STANDALONE = ./node_modules/.bin/selenium-standalone
WDIO = ./node_modules/.bin/wdio
BABEL_NODE = ./node_modules/.bin/babel-node
NODE = node

# Directories

BUILD_DIR = build
SRC_DIR = src
DIST_DIR = dist
PUBLIC_DIR = $(SRC_DIR)/public
PUBLIC_DIST_DIR = $(DIST_DIR)/public
LOCALE_DIR = $(SRC_DIR)/locale
SCRIPT_DIR = scripts
HOOK_DIR = hooks
HOOK_DIST_DIR = .git/hooks
CUCUMBER_DIR = features
CUCUMBER_DIST_DIR = features-dist
SELENIUM_CACHE_DIR = node_modules/selenium-standalone/.selenium

# Files

PUBLIC_FILES = $(shell find $(PUBLIC_DIR) -type f)
PUBLIC_DIST_FILES = $(subst $(PUBLIC_DIR)/,$(PUBLIC_DIST_DIR)/,$(PUBLIC_FILES))

SOURCE_FILES = $(shell find $(SRC_DIR) -type f -name '*.js')

TRANSLATE_FILES = $(filter-out $(SRC_DIR)/webserver/template.js,$(SOURCE_FILES))
POT_FILE = $(LOCALE_DIR)/messages.pot
LOCALE_PO_FILES = $(LOCALES:%=$(LOCALE_DIR)/%.po)
LOCALE_JSON_FILES = $(LOCALE_PO_FILES:%.po=%.json)

HOOK_FILES = $(shell find $(HOOK_DIR) -type f)
HOOK_DIST_FILES = $(subst $(HOOK_DIR)/,$(HOOK_DIST_DIR)/,$(HOOK_FILES))

CUCUMBER_JS_FILES = $(shell find $(CUCUMBER_DIR) -type f -name '*.js')
CUCUMBER_DIST_JS_FILES = $(subst $(CUCUMBER_DIR)/,$(CUCUMBER_DIST_DIR)/,$(CUCUMBER_JS_FILES))

# Commands

all: $(PUBLIC_DIST_FILES) $(LOCALE_JSON_FILES)
	$(WEBPACK)

clean:
	rm -rf $(DIST_DIR) $(CUCUMBER_DIST_DIR)

start: $(PUBLIC_DIST_FILES)
	$(NODE) server.js

lint:
	$(ESLINT) $(BUILD_DIR) $(CUCUMBER_DIR) $(SCRIPT_DIR) $(SRC_DIR) *.js

hooks: $(HOOK_DIST_FILES)

selenium: $(SELENIUM_CACHE_DIR)
	$(SELENIUM_STANDALONE) start

acceptance_test: $(CUCUMBER_DIST_JS_FILES)
ifdef DUMP_FEATURES
	./bin/dump_features
endif
	./bin/load_fixtures
ifeq ($(BROWSER_ENGINE), selenium)
	BROWSER=$(BROWSER) BROWSER_ENGINE=$(BROWSER_ENGINE) \
		./node_modules/.bin/cucumber-js --format $(CUCUMBER_FORMAT) features-dist
else
	BROWSER_ENGINE=$(BROWSER_ENGINE) \
		./node_modules/.bin/cucumber-js --format $(CUCUMBER_FORMAT) features-dist
endif

.PHONY: all clean start lint hooks selenium acceptance_test

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

$(HOOK_DIST_DIR)/%: $(HOOK_DIR)/%
	cp "$<" "$@"
	chmod a+x "$@"

$(CUCUMBER_DIST_DIR)/%.js: $(CUCUMBER_DIR)/%.js
	@mkdir -p "$(shell dirname $@)"
	$(BABEL) $< -o $@

$(SELENIUM_CACHE_DIR):
	$(SELENIUM_STANDALONE) install
