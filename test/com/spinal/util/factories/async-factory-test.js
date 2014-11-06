/**
*	com.spinal.util.Factory Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/factories/async-factory',
		'util/exception/factory',
		'ui/view',
		'mvc/model'], function(AsyncFactory, FactoryException, View, Model) {

	describe('com.spinal.util.factories.AsyncFactory', function() {

		/**
		*	AsyncFactory#new() test
		**/
		describe('#new()', function() {

			it('Should Instanciate AsyncFactory Class', function() {
				this.asyncfactory = new AsyncFactory();
				expect(this.asyncfactory).to.be.ok();
				expect(this.asyncfactory.factories).to.be.ok();
			});

		});

	});

});
