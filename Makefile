VERSION=0.5.0
.PHONY: build

build:
	gcloud config set project visprex && gcloud builds submit --tag eu.gcr.io/visprex/visprex:$(VERSION)