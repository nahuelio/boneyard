/**
*	com.spinal.ioc.Context Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/context',
		'specs/simple.spec',
		'specs/advanced.spec'], function(Context, SimpleSpec, AdvancedSpec) {

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

			it('Should Wire Simple specs (String, Numbers, Array, Date, etc)', function(done) {
				this.appContext.on(Context.EVENTS.initialized, _.bind(function(ctx) {
					expect(ctx).to.be.ok();
					this.appContext.off();
					done();
				}, this)).on(Context.EVENTS.changed, _.bind(function(result) {
					expect(result).to.be.ok();
					expect(result.type).to.be.ok();
					expect(result.data).to.be.ok();
				}, this));

				this.appContext.wire(SimpleSpec, function(ctx) {
					expect(ctx).to.be.ok();
					expect(ctx.spec).to.be.ok();
					expect(ctx.spec.header).to.be.ok();
				});
			});

			it('Should Wire Advanced specs (Module dependencies)', function(done) {
				this.appContext.on(Context.EVENTS.initialized, _.bind(function(ctx) {
					expect(ctx).to.be.ok();
					this.appContext.off();
					console.log('----------------------------');
					console.log(this.appContext.spec['content'].$module.params);
					console.log(this.appContext.spec['viewC'].$module.params);
					done();
				}, this)).on(Context.EVENTS.changed, _.bind(function(result) {
					expect(result).to.be.ok();
					expect(result.type).to.be.ok();
					expect(result.data).to.be.ok();
				}, this));

				this.appContext.wire(AdvancedSpec, function(ctx) {
					expect(ctx).to.be.ok();
					expect(ctx.spec).to.be.ok();
				});
			});

		});

	});

});
