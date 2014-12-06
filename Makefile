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
	@rm -fr dist/*

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
	@node ./node_modules/yuidocjs/lib/cli -q -c ./yuidoc.json --exclude libs ./src

## Build

build:
	@echo "\nBuilding SpinalJS..."
	@make test && make doc
	@make clean-build
	@node ./tools/spinal/build

## Composer

composer:
	@node ./bin/composer -l

## Benchmark

benchmark:
	@echo "\nBenchmark SpinalJS..."

## Spin Server

run:
	@echo "\nRunning server..."
	@node run

.PHONY: clean clean-coverage clean-benchmark clean-docs clean-build install-dependencies test doc build composer benchmark run
