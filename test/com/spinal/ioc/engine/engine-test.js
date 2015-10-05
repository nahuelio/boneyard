/**
*	com.spinal.ioc.engine.Engine Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/engine',
	'util/factories/async-factory'], function(Engine, AsyncFactory) {

	describe('com.spinal.ioc.engine.Engine', function() {

		before(function() {
			this.factory = {
				set: function() {},
				load: function() {},
				create: function() {}
			};
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
			this.engine = null;

			this.getFactoryStub = null;
		});

		after(function() {
			this.factoryMock.restore();
			delete this.factoryMock;

			this.processorsMock.restore();
			delete this.processorsMock;

			delete this.getFactoryStub;

			delete this.factory;
			delete this.processors;
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
				var method = sinon.spy();

				this.processorsMock
					.expects('isEmpty')
					.once()
					.returns(true);
				//this.factoryMock

				//var result = this.engine.
				// CONTINUE HERE...
			});

			it('Should NOT trigger Engine initialization (processors already loaded and ready)');

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
