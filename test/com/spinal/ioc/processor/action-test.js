/**
*	com.spinal.ioc.processor.ActionProcessor Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/processor/action',
	'ioc/context',
	'ioc/engine/annotation/bone',
	'ioc/engine/annotation/action',
	'ui/view',
	'specs/ioc.spec'], function(ActionProcessor, Context, Bone, Action, View, IocSpec) {

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
			this.view = new View(_.extend(IocSpec.simple.$params, { model: this.model }));
			this.action = new Action(IocSpec.$actions[0]);
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
				var injectStub = sinon.stub(this.action.getInjector(), 'inject').returns({});
				var resolveStub = sinon.stub(this.action.getInjector(), 'resolve').returns({});
				var getValueStub = sinon.stub(this.action, 'getValue').returns([
					this.model, 'change:prop', this.view
				]);
				var getIdStub = sinon.stub(this.action, 'getId').returns(this.model.listenTo);

				var getCompoundStub = sinon.stub(this.action.getTarget(), 'getCompound')
					.returns({ id: 'simple', method: 'listenTo' });

				this.boneViewMock
					.expects('bone')
					.once()
					.returns(this.view);

				this.engineMock
					.expects('bone')
					.once()
					.withArgs('simple')
					.returns(this.fakeViewBone);

				var result = this.processor.process(this.action);
				expect(result).to.be.a(Action);
				expect(result.getId()).to.be.a('function');
				expect(result.getValue()).to.be.an('array');
				expect(result.getValue()[0].get('value')).to.be(this.model.get('value'));

				this.engineMock.verify();
				this.boneViewMock.verify();

				this.action.getInjector().inject.restore();
				this.action.getInjector().resolve.restore();
				this.action.getValue.restore();
				this.action.getId.restore();
				this.action.getTarget().getCompound.restore();
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
