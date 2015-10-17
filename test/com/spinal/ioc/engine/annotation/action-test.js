/**
*	com.spinal.ioc.engine.annotation.Action Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/annotation/action',
	'ioc/engine/helpers/dependency',
	'specs/simple.spec'], function(Action, Dependency, SimpleSpec) {

	describe('com.spinal.ioc.engine.annotation.Action', function() {

		before(function() {
			this.actionSimple = null;
			this.actionSpy = sinon.spy();

			this.injector = {
				inject: function() {},
				resolve: function() {}
			};
			this.injectorMock = sinon.mock(this.injector);
		});

		after(function() {
			delete this.actionSpy;

			this.injectorMock.restore();
			delete this.injectorMock;
			delete this.injector;

			delete this.actionSimple;
		});

		describe('#new()', function() {

			it('Should return an instance of Action Annotation', function() {
				this.actionSimple = new Action(SimpleSpec.$actions[0]);
				expect(this.actionSimple).to.be.ok();
			});

		});

		describe('#getTarget()', function() {

			it('Should retrieve Action target', function() {
				expect(this.actionSimple.getTarget()).to.be.ok();
			});

		});

		describe('#getContext()', function() {

			it('Should retrieve Action context', function() {
				expect(this.actionSimple.getContext()).not.to.be.ok();
			});

		});

		describe('#resolve()', function() {

			it('Should resolve action target bone method\'s reference to the operation', function() {
				var getIdStub = sinon.stub(Action.prototype, 'getId').returns('$bone!simple.listenTo');
				var getInjectorStub = sinon.stub(Action.prototype, 'getInjector').returns(this.injector);

				this.actionSimple = new Action(SimpleSpec.$actions[0]);

				var getCompoundStub = sinon.stub(this.actionSimple.getTarget(), 'getCompound')
					.returns({ id: 'simple', method: 'listenTo' });
				var engineMock = sinon.mock(this.actionSimple.getEngine());
				var fakeBone = { bone: function() {} };
				var boneMock = sinon.mock(fakeBone);

				boneMock
					.expects('bone')
					.once()
					.returns(fakeBone);
				engineMock
					.expects('bone')
					.once()
					.withArgs('simple')
					.returns(fakeBone);
				this.injectorMock
					.expects('inject')
					.once()
					.withArgs(this.actionSimple.getTarget());

				var result = this.actionSimple.resolve();
				expect(result).to.be.ok();
				expect(result.getTarget().expression).to.be(this.actionSimple.getTarget().getExpression());

				boneMock.verify();
				engineMock.verify();
				this.injectorMock.verify();

				boneMock.restore();
				engineMock.restore();
				Action.prototype.getId.restore();
				Action.prototype.getInjector.restore();
				this.actionSimple.getTarget().getCompound.restore();
			});

		});

		describe('#parameters()', function() {

			it('Should resolve all dependencies on Action\'s parameters', function() {
				var dependencyA = {
					expression: '$bone!model',
					target: this.actionSimple,
					property: '0',
					bone: this.actionSimple,
					resolve: function() {}
				};
				var dependencyMockA = sinon.mock(dependencyA);
				var dependencyB = {
					expression: '$bone!simple.update',
					target: this.actionSimple,
					property: '2',
					bone: this.actionSimple,
					resolve: function() {}
				};
				var dependencyMockB = sinon.mock(dependencyB);
				var dependencies = [dependencyA, dependencyB];

				var dependenciesInvokeStub =
					sinon.stub(this.actionSimple.getInjector().getDependencies(), 'invoke',
						_.bind(function(action, injector) { return _.invoke(dependencies, 'resolve', injector); }, this));

				dependencyMockA
					.expects('resolve')
					.once()
					.withArgs(this.actionSimple.getInjector())
					.returns(dependencyA);
				dependencyMockB
					.expects('resolve')
					.once()
					.withArgs(this.actionSimple.getInjector())
					.returns(dependencyB);

				var result = this.actionSimple.parameters();
				expect(result).to.be.an('array');
				expect(result).to.have.length(3);

				dependencyMockA.verify();
				dependencyMockB.verify();

			});

		});

		describe('#execute', function() {

			it('Should execute the operation on a target that it has been resolve', function() {
				var getContextStub = sinon.stub(this.actionSimple, 'getContext').returns({});
				var getIdStub = sinon.stub(this.actionSimple, 'getId').returns(this.actionSpy)
				var parametersStub = sinon.stub(this.actionSimple, 'parameters').returns(['value'])

				this.actionSimple.execute();
				expect(this.actionSpy.calledOnce);

				this.actionSimple.getId.restore();
				this.actionSimple.getContext.restore();
				this.actionSimple.parameters.restore();
			});

			it('Should NOT execute the operation on a target that it has not been resolve yet', function() {
				var getContextStub = sinon.stub(this.actionSimple, 'getContext').returns(null);

				this.actionSimple.execute();

				this.actionSimple.getContext.restore();
			});

		});

		describe('static#only()', function() {

			it('Should retrieves $actions annotations', function() {
				var result = Action.only(SimpleSpec);
				expect(result).to.be.ok();
				expect(result.$id).to.be(undefined);
				expect(result.$specs).to.be(undefined);
				expect(result.$plugins).to.be(undefined);
				expect(result.$actions).to.be.ok();
			});

		});

	});

});
