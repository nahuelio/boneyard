/**
*	com.boneyard.util.factories.Factory Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/factories/factory',
		'util/exception/util/factory',
		'ui/view',
		'ui/container'], function(Factory, FactoryException, View, Container) {

	describe('com.boneyard.util.factories.Factory', function() {

		/**
		*	Factory#new() test
		**/
		describe('#new()', function() {

			it('Should Instanciate Factory Class', function() {
				this.factory = new Factory();
				expect(this.factory).to.be.ok();
				expect(this.factory.factories).to.be.ok();
			});

		});

		/**
		*	Factory#_construct() test
		**/
		describe('#_construct()', function() {

			it('Should use a pseudo constructor that accept an array as arguments and creates the object', function() {
				var view = this.factory._construct(View, [{ id: 'view1', model: new Backbone.Model() }]);
				expect(view).to.be.ok();
				expect(view).to.be.an(View);
			});

			it('Should NOT use the pseudo constructor: factory passed as argument is not a constructor function', function() {
				expect(this.factory._construct('nonAFunction')).to.be('nonAFunction');
			});

		});

		/**
		*	Factory#register() test
		**/
		describe('#register()', function() {

			it('Should register a new constructor function in the factory (with and without extra options)', function() {
				var viewConstructor = this.factory.register('ui/view', View);
				var modelConstructor = this.factory.register('ui/container', Container, { interface: View });
				expect(viewConstructor).to.be.ok();
				expect(this.factory.factories.size()).to.be.ok(2);
				expect(new viewConstructor({ id: 'view1' })).to.be.an(View);
				var result = this.factory.getFactory('ui/container');
				expect(result.options).to.be.ok();
				expect(result.options).to.have.length(1);
				expect(result.options[0].interface).to.be(View);
			});

			it('Should NOT register an existing factory constructor function, it should return the existing one', function() {
				var viewConstructor = this.factory.register('ui/view', View);
				expect(viewConstructor).to.be.ok();
				expect(this.factory.factories.size()).to.be.ok(2);
			});

			it('Should NOT register an existing factory constructor function, (path or constructor parameters are null)', function() {
				var constructorId = this.factory.register(null, View);
				expect(constructorId).not.be.ok();
				var constructorNull = this.factory.register('ui/view', null);
				expect(constructorNull).not.be.ok();
				expect(this.factory.factories.size()).to.be.ok(2);
			});

		});

		/**
		*	Factory#getFactory() test
		**/
		describe('#getFactory()', function() {

			it('Should return the Constructor function retrieved by factory id', function() {
				var modelfactory = this.factory.getFactory('ui/container');
				expect(modelfactory).to.be.ok();
				expect(modelfactory.path).to.be.ok();
				expect(modelfactory.factory).to.be.ok();
				expect(modelfactory.path).to.be.equal('ui/container');
				expect(modelfactory.factory).to.be.a(Function);
			});

			it('Should throw an Exception: Factory Constructor function was not registered', function() {
				var factoryNonExistent = this.factory.getFactory('Non-Existent');
				expect(factoryNonExistent).not.be.ok();
			});

		});

		describe('#isRegistered()', function() {

			it('Should return true for registered factory', function() {
				var registered = this.factory.isRegistered('ui/container');
				expect(registered).to.be.equal(true);
				var notRegistered = this.factory.isRegistered('Non-Existent');
				expect(notRegistered).to.be.equal(false);
			});

		});

		describe('#create()', function() {

			it('Should instanciate an object from the factory constructor function with arguments inline', function() {
				var container = this.factory.create('ui/container', { id: 'myid' });
				expect(container).to.be.ok();
				expect(container).to.be.an(Container);
				expect(container.id).to.be.equal('myid');
			});

			it('Should instanciate an object from the factory constructor function with arguments stored as options', function() {
				var container = this.factory.create('ui/container');
				expect(container).to.be.ok();
				expect(container).to.be.an(Container);
				expect(container.views._interface).to.be.equal(View);
			});

			it('Should throw an Exception: Factory Constructor function was not registered', function() {
				expect(_.bind(function() {
					this.factory.create('Non-Existent');
				}, this)).to.throwException(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be.equal(FactoryException.getMessage('UnregisteredFactory', { path: 'Non-Existent' }));
				});
			});

		});

		describe('#unregister()', function() {

			it('Should unregister an existing constructor function previously registered in the factory', function() {
				var viewfactory = this.factory.unregister('ui/view');
				expect(viewfactory).to.be.ok();
				expect(viewfactory.path).to.be.ok();
				expect(viewfactory.factory).to.be.ok();
				expect(viewfactory.path).to.be.equal('ui/view');
				expect(viewfactory.factory).to.be.a(Function);
				expect(this.factory.factories.size()).to.be.equal(1);
			});

			it('Should NOT unregister an existing factory constructor function, (Non-existant factory)', function() {
				var factoryNonExistent = this.factory.unregister('Non-Existent');
				expect(factoryNonExistent).not.be.ok();
			});

			it('Should NOT unregister an existing factory constructor function, (id parameter is null)', function() {
				var factoryNonExistent = this.factory.unregister();
				expect(factoryNonExistent).not.be.ok();
			});

		});

	});

});
