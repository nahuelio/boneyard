REPORTER = spec
REPORTER_COV = html-cov
SRC = $(shell find src -name "*.js" -type f | sort)

clean:
	rm -f lib/spinal*.js
	rm -fr lib-cov
	rm -f lib/coverage.html
	rm -f benchmark/spinal-*.html

coverage:
	@./node_modules/jscoverage/bin/jscoverage \
		--no-highlight \
		src lib-cov

test-all:
	@UT=1 \
	./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		-c test/**/*.js

test-cov:
	@UT=1 \
	./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER_COV) \
		-c test/**/*.js \
		--coverage > lib/coverage.html

test: clean coverage test-all test-cov

build-module:
	@node build module $(mod)

build-all:
	@node build all $(SRC)

build: test-all build-all

run:
	@node run

.PHONY: clean coverage test-all test-cov build-module build-all test build run