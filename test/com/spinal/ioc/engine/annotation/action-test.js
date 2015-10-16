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

			this.dependencyPrototypeMock = sinon.mock(Dependency.prototype);
		});

		after(function() {
			delete this.actionSpy;

			this.injectorMock.restore();
			delete this.injectorMock;
			delete this.injector;

			this.dependencyPrototypeMock.restore();
			delete this.dependencyPrototypeMock;

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
				this.actionSimple.target = {};
				expect(this.actionSimple.getTarget()).to.be.ok();
			});

		});

		describe('#resolve()', function() {

			it('Should resolve action target bone method\'s reference to the operation', function() {
				var getIdStub = sinon.stub(this.actionSimple, 'getId').returns('$bone!model.set');
				var getInjectorStub = sinon.stub(this.actionSimple, 'getInjector').returns(this.injector);

				var dependency = {
					expression: '$bone!simple.listenTo',
					target: this.actionSimple,
					property: '_id',
					bone: this.actionSimple
				};
				var dependencyMock = sinon.mock(dependency);

				this.dependencyPrototypeMock
					.expects('constructor')
					.once()
					.withArgs(dependency)
					.returns(dependency);
				this.injectorMock
					.expects('inject')
					.once()
					.returns(dependency);

				var result = this.actionSimple.resolve();
				expect(result).to.be.ok();
				expect(result.getTarget().expression).to.be(dependency.expression);

				this.dependencyPrototypeMock.verify();
				this.injectorMock.verify();

				dependencyMock.restore();
				this.actionSimple.getId.restore();
				this.actionSimple.getInjector.restore();
			});

		});

		describe.skip('#parameters()', function() {

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
				var getTargetStub = sinon.stub(this.actionSimple, 'getTarget').returns(true);
				var getIdStub = sinon.stub(this.actionSimple, 'getId').returns(this.actionSpy)
				var parametersStub = sinon.stub(this.actionSimple, 'parameters').returns(['value'])

				this.actionSimple.execute();
				expect(this.actionSpy.calledOnce);

				this.actionSimple.getTarget.restore();
				this.actionSimple.getId.restore();
			});

			it('Should NOT execute the operation on a target that it has not been resolve yet', function() {
				var getTargetStub = sinon.stub(this.actionSimple, 'getTarget').returns(null);

				this.actionSimple.execute();

				this.actionSimple.getTarget.restore();
			});

		});

		describe('static#only()', function() {
			var result = Action.only(SimpleSpec);
			expect(result).to.be.ok();
			expect(result.$id).to.be(undefined);
			expect(result.$specs).to.be(undefined);
			expect(result.$plugins).to.be(undefined);
			expect(result.$actions).to.be.ok();
		});

	});

});
