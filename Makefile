REPORTER = spec
REPORTER_COV = html-cov
SRC = $(shell find src -name "*.js" -type f | sort)

clean:
	rm -f lib/spinal*.js
	rm -fr lib-cov
	rm -f lib/coverage.html

coverage:
	@./node_modules/jscoverage/bin/jscoverage \
		--no-highlight \
		src lib-cov

test:
	@UT=1 \
	./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		-c test/*.js

test-cov:
	@UT=1 \
	./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER_COV) \
		-c test/*.js \
		--coverage > lib/coverage.html

build:
	@node build $(SRC)

test-all: clean coverage test test-cov

build-all: test-all build-lib

.PHONY: clean coverage test test-cov build test-all build-all