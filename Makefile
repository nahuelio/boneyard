REPORTER = spec
REPORTER_COV = html-cov
SRC = $(shell find src -name "*.js" -type f | sort)

clean:
	rm -f lib/spinal*.js
	rm -fr lib-cov
	rm -f lib/coverage.html

coverage:
	@./bin/jscoverage \
		--no-highlight \
		$(SRC) \
		lib-cov

test:
	@./bin/mocha \
		--reporter $(REPORTER) \
		-c test/*.js

test-cov:
	@./bin/mocha \
		--reporter $(REPORTER_COV) \
		-c test/*.js \
		--coverage > lib-cov

build:
	@node build $(SRC)

test-all: clean coverage test test-cov

build-all: test-all build-lib

.PHONY: clean coverage test test-cov build test-all build-all