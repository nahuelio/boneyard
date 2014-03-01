REPORTER = spec
REPORTER_COV = html-cov

comma:= ,
space:=
space+=

clean:
	rm -f lib/spinal*.js
	rm -fr lib-cov
	rm -f lib/coverage.html
	rm -f benchmark/spinal-*.html
	rm -fr docs/**/*.*

coverage:
	@./node_modules/jscoverage/bin/jscoverage \
		--no-highlight \
		src lib-cov
		
check-dependencies:
	@./node_modules/bower/bin/bower \
		install

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

test: clean coverage check-dependencies test-all test-cov

doc-all:
	@node ./node_modules/yuidocjs/lib/cli -c ./yuidoc.json ./src
	 
doc: clean doc-all

build-selective:
	@node build selective $(subst $(comma),$(space),$(modules))

build-all:
	@node build all

build: test doc-all build-all

benchmark:
	@node build benchmark

run:
	@node run

.PHONY: clean coverage check-dependencies test-all test-cov build-selective build-all test doc-all doc build benchmark run