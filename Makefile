REPORTER = spec
REPORTER_COV = html-cov

check-dependencies:
	@echo "\nChecking Dependencies..."
	@./node_modules/bower/bin/bower \
		install

clean:
	@echo "\nCleanning Environment..."
	@rm -f lib/spinal*.js
	@rm -fr lib-cov
	@rm -f lib/coverage.html
	@rm -f benchmark/spinal-*.html
	@rm -fr docs/**/*.*

coverage:
	@./node_modules/jscoverage/bin/jscoverage \
		src lib-cov --exclude libraries

test-all:
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
		--coverage > lib/coverage.html

test: clean check-dependencies coverage test-all test-cov

doc-all:
	@echo "\nCreating Documentation (YUIDOC)...\n"
	@node ./node_modules/yuidocjs/lib/cli -c ./yuidoc.json --exclude libraries ./src
	 
doc: clean doc-all

build-all:
	@echo "\nBuilding Spinal...\n"
	@node ./bin/spinal -v

build: check-dependencies test doc-all build-all

benchmark:
	@node ./bin/spinal -b

run:
	@echo "\nRunning server..."
	@node run

.PHONY: clean coverage check-dependencies test-all test-cov build-all test doc-all doc build benchmark run