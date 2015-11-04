/**
*	com.boneyard.ioc.engine.helpers.Dependency Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/helpers/dependency',
	'ioc/engine/helpers/injector',
	'ioc/engine/engine'], function(Dependency, Injector, Engine) {

	describe('com.boneyard.ioc.engine.helpers.Dependency', function() {

		before(function() {
			this.dependency = null;
			this.fakeBone = {
				bone: function() {},
				isModule: function() {},
				getEngine: function() {},
				isCreated: function() {},
				getBoneExpression: function() {}
			};
			this.data = {
				expression: '$bone!str',
				property: 'test',
				target: { test: '$bone!str' },
				bone: this.fakeBone
			};
		});

		beforeEach(function() {
			this.fakeInjector = {
				get: function() {},
				inject: function(dependency) { return dependency; },
				hold: function(dependency) { return dependency; }
			};
			this.fakeEngine = { bone: function() {}, getFactory: function() {} };
			this.engineMock = sinon.mock(this.fakeEngine);
			this.boneMock = sinon.mock(this.fakeBone);
		});

		afterEach(function() {
			delete this.fakeInjector;

			this.engineMock.restore();
			delete this.engineMock;
			delete this.fakeEngine;

			this.boneMock.restore();
		});

		after(function() {
			delete this.dependency;
			delete this.fakeBone;
			delete this.data;
			delete this.boneMock;
		});

		describe('#new()', function() {

			it('Should return an instance of a dependency', function() {
				var validStub = sinon.stub(Dependency.prototype, 'valid').returns(undefined);
				this.dependency = new Dependency(this.data);

				expect(this.dependency).to.be.ok();
				expect(this.dependency).to.be.a(Dependency);

				validStub.restore();
			});

		});

		describe('#valid()', function() {

			it('Should NOT throw an error: constructor parameters are valid', function() {
				expect(this.dependency.valid(this.data)).to.be(undefined);
			});

			it('Should throw an error: No Constructor parameters passed', function() {
				expect(_.bind(function() {
					new Dependency();
				}, this)).to.throwException(function(e) {
					expect(e.message).to.be('Dependency Target is not defined');
				});
			});

			it('Should throw an error: target undefined or target not an object', function() {
				expect(_.bind(function() {
					this.dependency.valid(_.pick(this.data, 'expression', 'property'));
				}, this)).to.throwException(function(e) {
					expect(e.message).to.be('Dependency Target is not defined');
				});

				expect(_.bind(function() {
					this.dependency.valid({ target: 'non-an-object' });
				}, this)).to.throwException(function(e) {
					expect(e.message).to.be('Dependency Target is not defined');
				});
			});

			it('Should throw an error: property undefined', function() {
				expect(_.bind(function() {
					this.dependency.valid(_.pick(this.data, 'expression', 'target'));
				}, this)).to.throwException(function(e) {
					expect(e.message).to.be('Dependency Target Property is not defined');
				});
			});

			it('Should throw an error: property on target undefined', function() {
				expect(_.bind(function() {
					this.dependency.valid({ target: this.data.target, property: 'unexistentInData' });
				}, this)).to.throwException(function(e) {
					expect(e.message).to.be('Dependency Target property doesn\'t exists in Dependency Target');
				});
			});

			it('Should throw an error: bone reference is not defined', function() {
				expect(_.bind(function() {
					this.dependency.valid(_.omit(this.data, 'bone'));
				}, this)).to.throwException(function(e) {
					expect(e.message).to.be('Dependency Bone Reference is not defined');
				});
			});

		});

		describe('#getEngine()', function() {

			it('Should return a reference to IoC Engine', function() {
				this.boneMock.expects('getEngine')
					.once()
					.returns(this.fakeEngine);

				var result = this.dependency.getEngine();
				expect(result).to.be.ok();
				expect(result.bone).to.be.ok();

				this.boneMock.verify();
			});

		});

		describe('#resolve()', function() {

			it('Should resolve dependency right away', function() {
				var canResolveStub = sinon.stub(this.dependency, 'canResolve').returns(true);
				var injectorSpy = sinon.spy(this.fakeInjector, 'inject');
				var result = this.dependency.resolve(this.fakeInjector);

				expect(result).to.be.ok();
				expect(result).to.be(this.dependency);
				expect(injectorSpy.calledOnce);

				canResolveStub.restore();
				this.fakeInjector.inject.restore();
			});

			it('Should not resolve dependency (dependency was resolved already)', function() {
				var canResolveSpy = sinon.spy(this.dependency, 'canResolve');
				var isResolvedStub = sinon.stub(this.dependency, 'isResolved').returns(true);

				expect(this.dependency.resolve(this.fakeInjector, this.fakeEngine.getFactory()))
					.to.be.an(Dependency);
				expect(canResolveSpy.called).to.be(false);

				this.dependency.isResolved.restore();
				this.dependency.canResolve.restore();
			});

			it('Should put the dependency on hold', function() {
				var canResolveStub = sinon.stub(this.dependency, 'canResolve').returns(false);
				var injectorSpy = sinon.spy(this.fakeInjector, 'hold');
				var result = this.dependency.resolve(this.fakeInjector);

				expect(result).to.be.ok();
				expect(result).to.be(this.dependency);
				expect(injectorSpy.calledOnce);

				canResolveStub.restore();
				this.fakeInjector.hold.restore();
			});

		});

		describe('#canResolve()', function() {

			it('Should return true: dependency is not a module', function() {
				var getIdStub = sinon.stub(this.dependency, 'getId').returns('str');
				var getEngineStub = sinon.stub(this.dependency, 'getEngine').returns(this.fakeEngine);

				this.boneMock.expects('isModule').once().returns(false);
				this.boneMock.expects('isCreated').never();
				this.engineMock.expects('bone').once().returns(this.fakeBone);

				expect(this.dependency.canResolve()).to.be(true);

				this.boneMock.verify();
				this.engineMock.verify();

				getIdStub.restore();
				getEngineStub.restore();
			});

			it('Should return true: dependency is a module and it\'s available to retrieve', function() {
				var getIdStub = sinon.stub(this.dependency, 'getId').returns('str');
				var getEngineStub = sinon.stub(this.dependency, 'getEngine').returns(this.fakeEngine);

				this.boneMock.expects('isModule').once().returns(true);
				this.boneMock.expects('isCreated').once().returns(true);
				this.engineMock.expects('bone').once().returns(this.fakeBone);

				expect(this.dependency.canResolve()).to.be(true);

				this.boneMock.verify();
				this.engineMock.verify();

				getIdStub.restore();
				getEngineStub.restore();
			});

			it('Should return false: dependency is was not found', function() {
				var getIdStub = sinon.stub(this.dependency, 'getId').returns('non-existent');
				var getEngineStub = sinon.stub(this.dependency, 'getEngine').returns(this.fakeEngine);

				this.boneMock.expects('isModule').never();
				this.boneMock.expects('isCreated').never();
				this.engineMock.expects('bone').once().returns(null);

				expect(this.dependency.canResolve()).to.be(false);

				this.boneMock.verify();
				this.engineMock.verify();

				getIdStub.restore();
				getEngineStub.restore();
			});

		});

		describe('#get()', function() {

			it('Should return dependency as an object', function() {
				var compound = 'str';
				var getCompoundStub = sinon.stub(this.dependency, 'getCompound').returns(compound);
				var getEngineStub = sinon.stub(this.dependency, 'getEngine').returns(this.fakeEngine);

				this.engineMock.expects('bone').once().withArgs(sinon.match.string).returns(this.fakeBone);
				this.boneMock.expects('bone').once().returns(compound);

				expect(this.dependency.get()).to.be(compound);

				this.engineMock.verify();
				this.boneMock.verify();

				getCompoundStub.restore();
				getEngineStub.restore();
			});

			it('Should return dependency method as a function', function() {
				var compound = { id: 'obj', method: 'method' };
				var getCompoundStub = sinon.stub(this.dependency, 'getCompound').returns(compound);
				var getEngineStub = sinon.stub(this.dependency, 'getEngine').returns(this.fakeEngine);

				this.engineMock.expects('bone')
					.once().withArgs(sinon.match.string)
					.returns(this.fakeBone);
				this.boneMock.expects('bone').once().returns({ id: 'object', method: function() {} });

				expect(this.dependency.get()).to.be.a('function');

				getCompoundStub.restore();
				getEngineStub.restore();
			});

			it('Should return null: dependency not found', function() {
				var getCompoundStub = sinon.stub(this.dependency, 'getCompound').returns(null);
				var getEngineStub = sinon.stub(this.dependency, 'getEngine').returns(this.fakeEngine);

				this.engineMock.expects('bone').never();

				expect(this.dependency.get()).not.be.ok();

				getCompoundStub.restore();
				getEngineStub.restore();
			});

		});

		describe('#getId()', function() {

			it('Should return dependency id', function() {
				var getExpressionStub = sinon.stub(this.dependency, 'getExpression').returns('$bone!str');
				this.boneMock.expects('getBoneExpression').once().returns('$bone!');

				expect(this.dependency.getId()).to.be('str');

				this.boneMock.verify();
				getExpressionStub.restore();
			});

			it('Should return null: dependency expression not valid', function() {
				var getExpressionStub = sinon.stub(this.dependency, 'getExpression').returns('$b!str');
				this.boneMock.expects('getBoneExpression').once().returns('$bone!');

				expect(this.dependency.getId()).not.to.be('str');

				this.boneMock.verify();
				getExpressionStub.restore();
			});

		});

		describe('#getCompound()', function() {

			it('Should return a simple dependency reference', function() {
				var getIdStub = sinon.stub(this.dependency, 'getId').returns('str');

				expect(this.dependency.getCompound()).to.be('str');

				getIdStub.restore();
			});

			it('Should return a complex dependency reference (id and method)', function() {
				var getIdStub = sinon.stub(this.dependency, 'getId').returns('obj.method');

				var result = this.dependency.getCompound();
				expect(result).to.be.an('object');
				expect(result.id).to.be('obj');
				expect(result.method).to.be('method');

				getIdStub.restore();
			});

			it('Should return null: dependency by id not found', function() {
				var getIdStub = sinon.stub(this.dependency, 'getId').returns(null);

				expect(this.dependency.getCompound()).not.be.ok();

				getIdStub.restore();
			});

		});

		describe('#getExpression()', function() {

			it('Should return dependency expression', function() {
				expect(this.dependency.getExpression()).to.be(this.data.expression);
			});

		});

		describe('#getTarget()', function() {

			it('Should return dependency target', function() {
				expect(this.dependency.getTarget()).to.be.an('object');
				expect(this.dependency.getTarget().test).to.be(this.data.target.test);
			});

		});

		describe('#getProperty()', function() {

			it('Should return dependency target property', function() {
				expect(this.dependency.getProperty()).to.be(this.data.property);
			});

		});

	});

});
