## Clean

clean:
	@echo "\nCleanning Environment..."
	@make clean-coverage && make clean-benchmark && make clean-docs && make clean-build

clean-coverage:
	@echo "\nCleanning Coverage Reports..."
	@rm -fr coverage

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

## Test & CodeCoverage via Karma

test:
	@make install-dependencies && make clean-coverage
	@echo "\nKarma executing Unit Tests...\n"
	@karma start karma.conf.js --single-run

## Documentation

doc:
	@make clean-docs
	@echo "\nCreating API DOCS (YUIDOC)...\n"
	@node ./node_modules/yuidocjs/lib/cli -c ./yuidoc.json --exclude libs ./src

## Build

build:
	@echo "\nBuilding SpinalJS..."
	@make test && make doc
	@make clean-build
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

.PHONY: clean clean-coverage clean-benchmark clean-docs clean-build install-dependencies test doc build benchmark run
