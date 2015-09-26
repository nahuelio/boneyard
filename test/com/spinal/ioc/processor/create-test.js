/**
*	com.spinal.ioc.processor.CreateProcessor Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/processor/create',
	'ioc/engine/engine',
	'specs/simple.spec'], function(CreateProcessor, Engine, SimpleSpec) {

	describe('com.spinal.ioc.processor.CreateProcessor', function() {

		before(function() {
			this.create = null;
			this.engine = new Engine();
			this.engineMock = sinon.mock(this.engine);
		});

		beforeEach(function() {

		});

		afterEach(function() {

		});

		after(function() {
			this.engineMock.restore();
			delete this.engineMock;
			delete this.engine;
			delete this.create;
		});

		describe('#new()', function() {

			it('Should return an instance of CreateProcessor', function() {
				this.create = new CreateProcessor(this.engine);
				expect(this.create).to.be.ok();
				expect(this.create).to.be.an(CreateProcessor);
			});

		});

		describe('#getPositions()', function() {

			it('Should return an array of resources positions inside the factory stack');

		});

		describe('#enqueue()', function() {

			it('Should enqueue a new resource inside the factory stack');

		});

		describe('#sort()', function() {

			it('Should sort existing resources in the factory stack');

		});

		describe('#create()', function() {

			it('Should instanciate a group of module bones and pass them to the bone injector.assign()');

		});

		describe('#process()', function() {

			it('Should determine if the current bone should be enqueued or resolve dependencies by itself via injector');

		});

		describe('#execute()', function() {

			it('Should execute processor\'s strategy over bones and call factory load');

		});

		describe('#done()', function() {

			it('Should finish processor\'s strategy by calling super class done method');

		});

	});

});
