JS_FILES = $(CLASS_FILES) $(OTHER_FILES)
CLASS_FILES = $(wildcard src/class/*.js)
OTHER_FILES = src/utilityFunctions.js src/initializationFnctions.js
OUTPUT_FILE = dist/form_lib_20240912.js

all: $(OUTPUT_FILE)

$(OUTPUT_FILE): $(JS_FILES)
	@cat $(JS_FILES) > $(OUTPUT_FILE)
	@echo "JavaScript files combined into $(OUTPUT_FILE)"

clean:;	@rm -f $(OUTPUT_FILE)
