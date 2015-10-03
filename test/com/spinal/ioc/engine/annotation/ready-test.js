/**
*	com.spinal.ioc.engine.annotation.Ready Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/annotation/ready',
	'ioc/engine/helpers/dependency',
	'specs/simple.spec'], function(Ready, Dependency, SimpleSpec) {

	describe('com.spinal.ioc.engine.annotation.Ready', function() {

		before(function() {
			this.readySimple = null;
			this.readyAdvanced = null;

			this.operationSpy = sinon.spy();
			this.dependency = {
				expression: '$bone!model.set',
				target: this.readySimple,
				property: '_id',
				bone: this.readySimple
			};
			this.dependencyMock = sinon.mock(this.dependency);

			this.injector = { inject: function() {} };
			this.injectorMock = sinon.mock(this.injector);

			this.dependencyPrototypeMock = sinon.mock(Dependency.prototype);
		});

		after(function() {
			delete this.operationSpy;

			this.injectorMock.restore();
			delete this.injectorMock;
			delete this.injector;

			this.dependencyPrototypeMock.restore();
			delete this.dependencyPrototypeMock;

			this.dependencyMock.restore();
			delete this.dependencyMock;
			delete this.dependency;

			delete this.readySimple;
			delete this.readyAdvanced;
		});

		describe('#new()', function() {

			it('Should return an instance of Ready Annotation', function() {
				this.readySimple = new Ready(SimpleSpec.$ready[0]);
				expect(this.readySimple).to.be.ok();

				this.readyAdvanced = new Ready(SimpleSpec.$ready[1]);
				expect(this.readyAdvanced).to.be.ok();
			});

		});

		describe('#getTarget()', function() {

			it('Should retrieve Ready target', function() {
				this.readySimple.target = {};
				expect(this.readySimple.getTarget()).to.be.ok();
			});

		});

		describe('#resolve()', function() {

			it('Should resolve ready target bone method\'s reference to the operation', function() {
				var getIdStub = sinon.stub(this.readySimple, 'getId').returns('$bone!model.set');
				var getInjectorStub = sinon.stub(this.readySimple, 'getInjector').returns(this.injector);
				var getTargetStub = sinon.stub(this.readySimple, 'getTarget').returns(this.operationSpy);

				this.dependencyPrototypeMock
					.expects('constructor')
					.once()
					.withArgs(this.dependency)
					.returns(this.dependency);
				this.injectorMock
					.expects('inject')
					.once()
					.returns(this.operationSpy);

				var result = this.readySimple.resolve();
				expect(result).to.be.ok();
				expect(result.getTarget()).to.be.a('function');

				this.dependencyPrototypeMock.verify();
				this.injectorMock.verify();

				this.readySimple.getId.restore();
				this.readySimple.getInjector.restore();
				this.readySimple.getTarget.restore();
			});

		});

		describe('#execute', function() {

			it('Should execute the operation on a target that it has been resolve', function() {
				var getTargetStub = sinon.stub(this.readySimple, 'getTarget').returns(this.operationSpy);

				this.readySimple.execute();
				expect(this.operationSpy.calledOnce);

				this.readySimple.getTarget.restore();
			});

			it('Should NOT execute the operation on a target that it has not been resolve yet', function() {
				var getTargetStub = sinon.stub(this.readySimple, 'getTarget').returns(null);

				this.readySimple.execute();

				this.readySimple.getTarget.restore();
			});

		});

		describe('static#only()', function() {
			var result = Ready.only(SimpleSpec);
			expect(result).to.be.ok();
			expect(result.$id).to.be(undefined);
			expect(result.$specs).to.be(undefined);
			expect(result.$plugins).to.be(undefined);
			expect(result.$ready).to.be.ok();
		});

	});

});
