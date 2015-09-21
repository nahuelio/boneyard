/**
*	com.spinal.ioc.engine.helpers.Dependency Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/helpers/dependency',
	'ioc/engine/helpers/injector',
	'ioc/engine/engine'], function(Dependency, Injector, Engine) {

	describe('com.spinal.ioc.engine.helpers.Dependency', function() {

		before(function() {
			this.data = {
				expression: '$bone!str',
				property: 'test',
				target: { test: '$bone!str' }
			};
			this.dependency = null;
			this.fakeInjector = {
				inject: function(dependency) { return dependency; },
				hold: function(dependency) { return dependency; }
			};
		});

		after(function() {
			delete this.data;
			delete this.dependency;
			delete this.fakeInjector;
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

		});

		describe('#getEngine()', function() {

			it('Should return a reference to IoC Engine', function() {
				var result = this.dependency.getEngine();
				expect(result).to.be.ok();
				expect(result).to.be.an(Engine);
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

			// CONTINUE HERE...
			it('Should return true: dependency is not a module');

			it('Should return true: dependency is a module and it\'s available to retrieve');

			it('Should return false: dependency is was not found');

		});

		describe('#get()', function() {

			it('Should return dependency as an object');

			it('Should return dependency method as a function');

			it('Should return null: dependency not found');

		});

		describe('#getId()', function() {

			it('Should return dependency id');

			it('Should return null: dependency expression not valid');

		});

		describe('#getCompound()', function() {

			it('Should return a simple dependency reference');

			it('Should return a complex dependency reference (id and method)');

			it('Should return null: dependency by id not found');

		});

		describe('#getExpression()', function() {

			it('Should return dependency expression', function() {
				expect(this.dependency.getExpression()).to.be(this.data.expression);
			});

		});

		describe('#getTarget()', function() {

			it('Should return dependency target', function() {
				expect(this.dependency.getTarget()).to.be(this.data.target);
			});

		});

		describe('#getProperty()', function() {

			it('Should return dependency target property', function() {
				expect(this.dependency.getProperty()).to.be(this.data.property);
			});

		});

	});

});
