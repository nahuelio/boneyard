REPORTER = spec
REPORTER_COV = html-cov

## Clean

clean:
	@echo "\nCleanning Environment..."
	@make clean-coverage && make clean-benchmark && make clean-docs && make clean-build

clean-coverage:
	@echo "\nCleanning Coverage Reports..."
	@rm -fr lib-cov

clean-benchmark:
	@echo "\nCleanning Benchmark..."
	@rm -f benchmark/spinal-*.html

clean-docs:
	@echo "\nCleanning API Docs..."
	@rm -fr docs/*

clean-build:
	@echo "\nCleanning Build..."
	@rm -fr target/*

## Dependencies

install-dependencies:
	@echo "\nInstalling Dependencies..."
	@bower install

## Test & CodeCoverage

coverage:
	@echo "\nInstrumenting Code Coverage..."
	@./node_modules/jscoverage/bin/jscoverage \
		src lib-cov --exclude libs

test-mocha:
	@echo "\nRunning Unit Testing and Code Coverage..."
	@UT=1 \
	./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		-c test/**/*.js

test-cov:
	@UT=1 \
	./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER_COV) \
		-c test/**/*.js \
		--coverage > target/coverage.html

test: install-dependencies clean-coverage coverage test-mocha test-cov

## Documentation

doc:
	@make clean-docs
	@echo "\nCreating Documentation (YUIDOC)...\n"
	@node ./node_modules/yuidocjs/lib/cli -c ./yuidoc.json --exclude libs ./src

## Build

build:
	@echo "\nBuilding SpinalJS..."
	@make test && make doc
	@node ./bin/spinal -v

## Benchmark

benchmark:
	@echo "\nBenchmark SpinalJS..."
	@make clean-benchmark
	@node ./bin/spinal -b

## Spin Server

run:
	@echo "\nRunning server..."
	@node run

.PHONY: clean clean-coverage clean-coverage clean-benchmark clean-docs clean-build install-dependencies coverage test-mocha test-cov test doc build benchmark run
