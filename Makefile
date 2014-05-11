REPORTER = spec
REPORTER_COV = html-cov

clean-test:
	@echo "\nCleanning Environment..."
	@rm -f target/coverage.html
	@rm -fr lib-cov
	@rm -f benchmark/spinal-*.html
	@rm -fr docs/**/*.*
	
clean-target:
	@echo "\nCleanning Environment..."
	@rm -fr target/libs
	@rm -f target/build.txt
	@rm -f target/spinal*.js

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
		--coverage > target/coverage.html

test: clean-test coverage test-all test-cov

install-dependencies:
	@echo "\nInstalling Dependencies..."
	@bower install

doc-all:
	@echo "\nCreating Documentation (YUIDOC)...\n"
	@node ./node_modules/yuidocjs/lib/cli -c ./yuidoc.json --exclude libs ./src
	 
doc: clean doc-all

build-all:
	@echo "\nBuilding Spinal..."
	@node ./bin/spinal -v

build: clean-target install-dependencies doc-all build-all

benchmark:
	@node ./bin/spinal -b

run:
	@echo "\nRunning server..."
	@node run

.PHONY: clean-test clean-target coverage test-all test-cov build-all test install-dependencies doc-all doc build benchmark run