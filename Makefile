ARTIFACTS_DIR ?= build

# (...)

.PHONY: build
build:
	rm -rf dist || true
	python3 -m build -w

.PHONY: build_layer
build_layer: build
	rm -rf "$(ARTIFACTS_DIR)/python" || true
	mkdir -p "$(ARTIFACTS_DIR)/python"
	python3 -m pip install -r requirements.txt -t "$(ARTIFACTS_DIR)/python"
	python3 -m pip install dist/*.whl -t "$(ARTIFACTS_DIR)/python"

.PHONY: package_layer
package_layer: build build_layer
	cd "$(ARTIFACTS_DIR)"; zip -rq ../out/layer.zip python

.PHONY: build_functions
build_functions:
	zip -rq ./out/functions.zip functions

.PHONY: build_all
build_all: package_layer build_functions

.PHONY: deploy_zips
deploy_zips: build_all
	aws s3 cp out/functions.zip s3://my-cdk-assets/
	aws s3 cp out/layer.zip s3://my-cdk-assets/
