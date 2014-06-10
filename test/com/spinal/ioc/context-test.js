/**
*	com.spinal.ioc.Context Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	TODO:
*		- Define mechanism for context templating (decorate context specs)
*		- Write Unit Tests for com.spinal.util.factories.Factory Before moving in this unit tests.
**/
define(['ioc/context',
		'specs/content.spec'], function(Context, ProductSpec) {

	describe('com.spinal.ioc.Context', function() {

		before(function() {
			$('body').append('<div class="global"></div>');
		});

		after(function() {
			//delete Spinal.applicationContext.getBone('_global').removeAll();
		});

		describe('#new()', function() {

			it('Should Initialize IoC Container', function() {
				Spinal.applicationContext = Context.Create();
				expect(Spinal.applicationContext).to.be.ok();
				expect(Spinal.applicationContext.bones.size()).to.be.equal(0);
			});

		});

		describe('#wire()', function() {

			it('Should Wire Specs', function() {
				Spinal.applicationContext.wire(ProductSpec);
			});

		});

	});

});
