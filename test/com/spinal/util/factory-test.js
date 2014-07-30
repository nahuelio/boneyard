/**
*	com.spinal.util.Factory Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/factory',
		'util/error/types/factory-exception',
		'ui/view',
		'mvc/model'], function(Factory, FactoryException, View, Model) {

	describe('com.spinal.util.Factory', function() {

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
				var view = this.factory._construct(View, [{ id: 'view1', model: new Model() }]);
				expect(view).to.be.ok();
				expect(view).to.be.an(View);
			});

		});

		/**
		*	Factory#register() test
		**/
		describe('#register()', function() {

			it('Should register a new constructor function in the factory', function() {
				var viewConstructor = this.factory.register(View.NAME, View);
				var modelConstructor = this.factory.register(Model.NAME, Model);
				expect(viewConstructor).to.be.ok();
				expect(this.factory.factories.size()).to.be.ok(2);
				expect(new viewConstructor({ id: 'view1'})).to.be.an(View);
			});

			it('Should NOT register an existing factory constructor function, it should return the existing one', function() {
				var viewConstructor = this.factory.register(View.NAME, View);
				expect(viewConstructor).to.be.ok();
				expect(this.factory.factories.size()).to.be.ok(2);
			});

			it('Should NOT register an existing factory constructor function, (id or constructor parameters are null)', function() {
				var constructorId = this.factory.register(null, View);
				expect(constructorId).not.be.ok();
				var constructorNull = this.factory.register(View.NAME, null);
				expect(constructorNull).not.be.ok();
				expect(this.factory.factories.size()).to.be.ok(2);
			});

		});

		/**
		*	Factory#getFactory() test
		**/
		describe('#getFactory()', function() {

			it('Should return the Constructor function retrieved by factory id', function() {
				var modelfactory = this.factory.getFactory('Model');
				expect(modelfactory).to.be.ok();
				expect(modelfactory.id).to.be.ok();
				expect(modelfactory.create).to.be.ok();
				expect(modelfactory.id).to.be.equal('Model');
				expect(modelfactory.create).to.be.a(Function);
			});

			it('Should throw an Exception: Factory Constructor function was not registered', function() {
				var factoryNonExistent = this.factory.getFactory('Non-Existent');
				expect(factoryNonExistent).not.be.ok();
			});

		});

		/**
		*	Factory#create() test
		**/
		describe('#create()', function() {

			it('Should instanciate an object from the factory constructor function', function() {
				var model = this.factory.create('Model', { prop: 'myprop'});
				expect(model).to.be.ok();
				expect(model).to.be.an(Model);
				expect(model.get('prop')).to.be.equal('myprop');
			});

			it('Should throw an Exception: Factory Constructor function was not registered', function() {
				expect(_.bind(function() {
					this.factory.create('Non-Existent');
				}, this)).to.throwException(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be.equal(FactoryException.getMessage('UnregisteredFactory', { id: 'Non-Existent' }));
				});
			});

		});

		/**
		*	Factory#unregister() test
		**/
		describe('#unregister()', function() {

			it('Should unregister an existing constructor function previously registered in the factory', function() {
				var viewfactory = this.factory.unregister('View');
				expect(viewfactory).to.be.ok();
				expect(viewfactory.id).to.be.ok();
				expect(viewfactory.create).to.be.ok();
				expect(viewfactory.id).to.be.equal('View');
				expect(viewfactory.create).to.be.a(Function);
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
