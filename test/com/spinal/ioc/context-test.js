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

			it('Should Initialize IoC Container', function(done) {
				Spinal.applicationContext = Context.Initialize(_.bind(function(ctx) {
					expect(ctx).to.be.ok();
					expect(ctx.bones.size()).to.be.equal(0);
					done();
				}, this));
			});

		});

		describe('#wire()', function() {

			it('Should Wire Specs', function(done) {
				Spinal.applicationContext.wire(ProductSpec, _.bind(function(ctx) {
					expect(ctx).to.be.ok();
					done();
				}, this));
			});

		});

	});

});
