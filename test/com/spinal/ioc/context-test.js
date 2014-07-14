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
			delete this.appContext;
		});

		/**
		*	Constructor test
		**/
		describe('#new()', function() {

			it('Should Initialize IoC Container', function(done) {
				this.appContext = Context.Initialize(_.bind(function(ctx) {
					expect(ctx).to.be.ok();
					expect(ctx.spec).to.be.ok();
					done();
				}, this));
			});

		});

		/**
		*	Context#wire() test
		**/
		describe('#wire()', function() {

			it('Should Wire Specs', function(done) {
				this.appContext.on(Context.EVENTS.initialized, function(ctx) {
					console.log('Context Initialized!');
				}).on(Context.EVENTS.changed, _.bind(function(result) {
					expect(result).to.be.ok();
					expect(result.type).to.be.ok();
					expect(result.data).to.be.ok();
					console.log('Changed: ', result.type, result.data);
					/**if(Context['CreateProcessor'] &&
						result.type === Context['CreateProcessor'].constructor.EVENTS.ready) {
						done();
					}**/
					done();
				}, this));

				this.appContext.wire(ProductSpec, function(ctx) {
					expect(ctx).to.be.ok();
					expect(ctx.spec).to.be.ok();
					expect(ctx.spec.header).to.be.ok();
				});

			});

		});

	});

});
