/**
*	com.boneyard.ioc.processor.BoneProcessor Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/processor/processor',
	'ioc/engine/engine',
	'util/factories/async-factory',
	'util/adt/collection',
	'util/exception/ioc/processor'], function(Processor, Engine, AsyncFactory, Collection, ProcessorException) {

	describe('com.boneyard.ioc.processor.Processor', function() {

		before(function() {
			this.processor = null;
			this.engine = new Engine();
			this.engineMock = sinon.mock(this.engine);
			this.engineRequiredEx = new ProcessorException('EngineRequired');
		});

		after(function() {
			delete this.engineRequiredEx;
			this.engineMock.restore();
			delete this.engineMock;
			delete this.engine;
			delete this.processor;
		});

		describe('#new()', function() {

			it('Should return an instance of a Processor', function() {
				this.processor = new Processor(this.engine);
				expect(this.processor).to.be.ok();
				expect(this.processor.engine).to.be.ok();
			});

			it('Should throw an error: engine not defined or is not an instance of Engine ', function() {
				expect(function() {
					new Processor();
				}).to.throwException(_.bind(function(e) {
					expect(e.message).to.be(this.engineRequiredEx.message);
				}, this));
			});

		});

		describe('#getEngine()', function() {

			it('Should return an instance of engine', function() {
				expect(this.processor.getEngine()).to.be.an(Engine);
			});

		});

		describe('#getFactory()', function() {

			it('Should return an engine\'s factory instance', function() {
				expect(this.processor.getFactory()).to.be.an(AsyncFactory);
			});

		});

		describe('#getSpecs()', function() {

			it('Should return a reference to engine\'s spec collection', function() {
				expect(this.processor.getSpecs()).to.be.an(Collection);
			});

		});

		describe('#execute()', function() {

			it('Should execute predicate function over each bones passed by parameters', function() {
				var bones = [
					{ boneA: 'valueA' },
					{ boneB: '$bone!boneA' },
					{ boneC: { $module: 'ui/view', $params: { id: 'boneC' } }
				}];
				var callbackSpy = sinon.spy();
				var result = this.processor.execute(bones, callbackSpy);

				expect(result).to.be.an('array');
				expect(result).to.have.length(3);
				expect(callbackSpy.calledThrice);
				expect(callbackSpy.secondCall.args[0]).to.only.have.key('boneB');
			});

			it('Should not execute predicate over each bone: predicate is not defined or not a function', function() {
				var bones = [
					{ boneA: 'valueA' },
					{ boneB: '$bone!boneA' },
					{ boneC: { $module: 'ui/view', $params: { id: 'boneC' } }
				}];
				var result = this.processor.execute(bones);
				expect(result).to.be.an('array');
				expect(result).to.have.length(3);
			});

		});

		describe('#done()', function() {

			it('Should fire done event', function(done) {

				this.processor.on(Processor.EVENTS.done, function(type) {
					expect(type).to.be.ok();
					expect(type).to.be(Processor.NAME);
					done();
				});
				this.processor.done(Processor.NAME);

			});

		});

	});

});
