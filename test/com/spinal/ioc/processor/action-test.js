/**
*	com.spinal.ioc.processor.ActionProcessor Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/processor/action',
	'ioc/context',
	'ioc/engine/annotation/bone',
	'ioc/engine/annotation/action',
	'ui/view',
	'specs/simple.spec'], function(ActionProcessor, Context, Bone, Action, View, SimpleSpec) {

	describe('com.spinal.ioc.processor.ActionProcessor', function() {

		before(function() {
			this.processor = null;
			this.engineMock = sinon.mock(Context.engine);

			this.fakeViewBone = {
				id: 'for-view',
				isModule: function() {},
				isCreated: function() {},
				bone: function() {}
			};
			this.fakeModelBone = {
				id: 'for-model',
				isModule: function() {},
				isCreated: function() {},
				bone: function() {}
			};
			this.boneViewMock = sinon.mock(this.fakeViewBone);
			this.boneModelMock = sinon.mock(this.fakeModelBone);

			this.model = new Backbone.Model({ value: 'initial' });
			this.view = new View(_.extend(SimpleSpec.simple.$params, { model: this.model }));
			this.action = new Action(SimpleSpec.$actions[0]);
		});

		after(function() {
			this.boneModelMock.restore();
			delete this.boneModelMock;

			this.boneViewMock.restore();
			delete this.boneViewMock;

			delete this.fakeModelBone;
			delete this.fakeViewBone;

			this.engineMock.restore();
			delete this.engineMock;

			delete this.model;
			delete this.view;
			delete this.action;
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
				var invokeStub = sinon.stub(this.action.getInjector().getDependencies(), 'invoke', _.bind(function() {
					var dependencyA = this.action.getDependencies().get(0);
					var dependencyB = this.action.getDependencies().get(1);
					return [
						this.action.getInjector().inject(dependencyA),
						this.action.getInjector().inject(dependencyB)
					];
				}, this));

				this.boneViewMock
					.expects('bone')
					.twice()
					.returns(this.view);
				this.boneModelMock
					.expects('bone')
					.once()
					.returns(this.model);

				this.engineMock
					.expects('bone')
					.withExactArgs('simple')
					.twice()
					.returns(this.fakeViewBone);
				this.engineMock
					.expects('bone')
					.withExactArgs('model')
					.once()
					.returns(this.fakeModelBone);

				var result = this.processor.process(this.action);
				expect(result).to.be.a(Action);
				expect(result.getId()).to.be.a('function');
				expect(result.getValue()).to.be.an('array');
				expect(result.getValue()[0].get('value')).to.be(this.model.get('value'));

				this.engineMock.verify();
				this.boneViewMock.verify();
				this.boneModelMock.verify();

				this.action.getInjector().getDependencies().invoke.restore();
			});

		});

		describe('#execute()', function() {

			it('Should trigger processor process over all the actions', function() {
				var superDoneStub = sinon.stub(ActionProcessor.__super__, 'done')
					.withArgs(ActionProcessor.NAME)
					.returns(this.processor);
				var processStub = sinon.stub(this.processor, 'process').returns([]);

				var result = this.processor.execute();
				expect(result).to.be.a(ActionProcessor);

				ActionProcessor.__super__.done.restore();
				this.processor.process.restore();
			});

		});

	});

});
