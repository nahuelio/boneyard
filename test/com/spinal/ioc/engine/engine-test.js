/**
*	com.spinal.ioc.engine.Engine Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/engine',
	'util/factories/async-factory',
	'specs/simple.spec'], function(Engine, AsyncFactory, SimpleSpec) {

	describe('com.spinal.ioc.engine.Engine', function() {

		before(function() {
			this.engine = null;
		});

		beforeEach(function() {
			this.factory = new AsyncFactory();
			this.factoryMock = sinon.mock(this.factory);
			this.processors = {
				set: function() {},
				isEmpty: function() {},
				hasNext: function() {},
				next: function() {},
				rewind: function() {},
				once: function() {}
			};
			this.processorsMock = sinon.mock(this.processors);

			if(this.engine) {
				// Mock Injections
				this.engine.processors = this.processors;
				this.engine.factory = this.factory;
			}
		});

		afterEach(function() {
			this.factoryMock.restore();
			delete this.factoryMock;

			this.processorsMock.restore();
			delete this.processorsMock;

			delete this.factory;
			delete this.processors;
		});

		after(function() {
			delete this.engine;
		});

		describe('#new()', function() {

			it('Should return an instanciate of an Engine class', function() {
				this.engine = new Engine();
				expect(this.engine).to.be.ok();
				expect(this.engine.wire).to.be.a('function');
				expect(this.engine.unwire).to.be.a('function');
			});

		});

		describe('#getFactory()', function() {

			it('Should return engine\'s asynchronous factory reference', function() {
				expect(this.engine.getFactory()).to.be.a(AsyncFactory);
			});

		});

		describe('#setup()', function() {

			it('Should Setup Engine initialization by loading processors', function() {
				var ctx = {}, callback = sinon.spy();
				callback.withArgs(ctx);
				// FIXME: Review this stub: It might not be a good idea to mock the this.ready handler...
				var readyStub = sinon.stub(this.engine, 'ready', _.bind(function(method, spec, callback, ctx) {
					callback(ctx);
					return this.engine;
				}, this));

				this.processorsMock
					.expects('isEmpty')
					.once()
					.returns(true);
				this.factoryMock
					.expects('set')
					.once()
					.returns(this.factory);
				this.factoryMock
					.expects('load')
					.once()
					.yields(callback)
					.returns(this.factory);

				var result = this.engine.setup(function() {}, SimpleSpec, callback, ctx);
				expect(result).to.be.an(Engine);

				this.processorsMock.verify();
				this.factoryMock.verify();

				expect(callback.calledOnce).to.be(true);
				expect(callback.calledWith(ctx)).to.be(true);
				readyStub.restore();
			});

			it('Should NOT trigger Engine initialization (processors already loaded and ready)', function() {
				var method = sinon.spy(), callback = sinon.spy(), ctx = {};

				this.processorsMock
					.expects('isEmpty')
					.once()
					.returns(false);

				var result = this.engine.setup(method, SimpleSpec, callback, ctx);
				expect(result).to.be.an(Engine);

				this.processorsMock.verify();

				expect(method.calledOnce);
				expect(method.calledWith(SimpleSpec, callback, ctx));
			});

		});

		describe('#ready()', function() {

			it('Should trigger engine method call after engine initialization is complete (spec defined)');

			it('Should NOT trigger engine method call after engine initialization is complete (spec NOT defined)');

		});

		describe('#execute()', function() {

			it('Should fire up engine\'s processor battery execution');

		});

		describe('#wire()', function() {

			it('Should wire a new spec with callback');

			it('Should wire a new spec without callback');

		});

		describe('#unwire()', function() {

			it('Should unwire an existing spec with callback');

			it('Should unwire an existing spec without callback');

		});

		describe('#done()', function() {

			it('Should execute callback whenever done strategy is executed');

			it('Should NOT execute a callback whenever done strategy is executed (Callback not defined or not a function)');

		});

		describe('#extractPlugins()', function() {

			it('Should extract $plugins from spec ($plugins annotation found)');

			it('Should NOT extract $plugins from spec ($plugins annotation not found)');

		});

		describe('#addSpec()', function() {

			it('Should Add a new spec into engine\'s spec collection');

			it('Should Add a new spec and parent specs defined');

			it('Should NOT add a new spec (spec already exists)');

		});

		describe('#removeSpec()', function() {

			it('Should Remove an existing spec from engine\'s spec collection');

			it('Should Remove an existing spec and parent specs from engine\'s spec collection');

			it('Should NOT remove an existing spec (spec doesn\'t exists)');

		});

		describe('#spec()', function() {

			it('Should return a spec instance by id');

			it('Should NOT return a spec instance by id (spec not found)');

		});

		describe('#allSpecs()', function() {

			it('Should return all specs from engine\'s spec collection');

			it('Should return an empty array of specs from engine\'s spec collection');

		});

		describe('#allBones()', function() {

			it('Should return all bones from all specs from engine\'s spec collection');

			it('Should return an empty array of bones from engine\'s spec collection');

		});

		describe('#bone()', function() {

			it('Should return a bone instance by id');

			it('Should NOT return a bone instance by id (bone not found)');

		});

		describe('#bonesByType()', function() {

			it('Should return an array of bones by type');

			it('Should return an empty array of bones by type');

		});

		describe('#bonesByClass()', function() {

			it('Should return an array of bones by class');

			it('Should return an empty array of bones by class');

		});

	});

});
