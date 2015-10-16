/**
*	com.spinal.ioc.processor.ActionProcessor Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/processor/action',
	'ioc/context',
	'ioc/engine/annotation/action',
	'ui/view',
	'specs/simple.spec'], function(ActionProcessor, Context, Action, View, SimpleSpec) {

	describe('com.spinal.ioc.processor.ActionProcessor', function() {

		before(function() {
			this.processor = null;
			this.engineMock = sinon.mock(Context.engine);
			this.view = new View(SimpleSpec.simple.$params);
			this.action = new Action(SimpleSpec.$actions[0]);
		});

		after(function() {
			delete this.action;

			this.engineMock.restore();
			delete this.engineMock;

			delete this.processor;
		});

		describe('#new()', function() {

			it('Should return an instance of ActionProcessor', function() {
				this.processor = new ActionProcessor(Context.engine);
				expect(this.processor).to.be.a(ActionProcessor);
			});

		});

		describe('#process()', function() {

			it('Should process a given action', function() {
				this.engineMock
					.expects('bone')
					.once()
					.withArgs('simple')
					.returns(this.view);

				var result = this.processor.process(this.action);
				expect(result).to.be.a(Action);
				expect(result.getId()).to.be.a('function');

				this.engineMock.verify();
			});

		});

		describe('#execute()', function() {

		});

	});

});
