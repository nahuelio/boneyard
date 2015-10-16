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
			this.dependency = {
				expression: '$bone!simple.listenTo',
				target: this.actionSimple,
				property: '_id',
				bone: this.actionSimple
			};
			this.dependencyMock = sinon.mock(this.dependency);

			this.injector = { inject: function() {} };
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

			this.dependencyMock.restore();
			delete this.dependencyMock;
			delete this.dependency;

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

				this.dependencyPrototypeMock
					.expects('constructor')
					.once()
					.withArgs(this.dependency)
					.returns(this.dependency);
				this.injectorMock
					.expects('inject')
					.once()
					.returns(this.actionSpy);

				var result = this.actionSimple.resolve();
				expect(result).to.be.ok();
				expect(result.getTarget()).to.be.a('function');

				this.dependencyPrototypeMock.verify();
				this.injectorMock.verify();

				this.actionSimple.getId.restore();
				this.actionSimple.getInjector.restore();
			});

		});

		describe('#parameters()', function() {

			it('Should resolve all dependencies on Action\'s parameters', function() {

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
