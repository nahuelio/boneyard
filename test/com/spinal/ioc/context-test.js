/**
*	com.spinal.ioc.Context Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/context',
		'specs/content.spec'], function(Context, ProductSpec) {

	describe('com.spinal.ioc.Context', function() {

		this.appContext = null;

		before(function() {
			$('body').append('<div class="global"></div>');
		});

		after(function() {
			// delete applicationcontext here...
		});

		describe('#new()', function() {

			it('Should Initialize IoC Container', function(done) {
				this.appContext = Context.Initialize(_.bind(function(ctx) {
					expect(ctx).to.be.ok();
					expect(ctx.bones.size()).to.be.equal(0);
					done();
				}, this));
			});

		});

		describe('#wire()', function() {

			it('Should Wire Specs', function(done) {
				this.appContext.wire(ProductSpec, _.bind(function(ctx) {
					expect(ctx).to.be.ok();
					//console.log(ctx.bones.collection);
					done();
				}, this));
			});

		});

	});

});
