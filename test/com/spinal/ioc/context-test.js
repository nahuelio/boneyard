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
		*	Context#new() test
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
		*	Context#factory() test
		**/
		describe('#factory()', function() {

			it('Should NOT execute a factory method (method not defined)', function() {
				var result = this.appContext.factory();
				expect(result).not.be.ok();
			});

			it('Should NOT execute a factory method (method is not declared in BoneFactory Class)', function() {
				var result = this.appContext.factory('method-non-existent');
				expect(result).not.be.ok();
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
				}, this)).on(Context.EVENTS.plugin + ' ' + Context.EVENTS.created, _.bind(function(result) {
					expect(result).to.be.ok();
					console.log(result);
				}, this)).on(Context.EVENTS.ready, _.bind(function(result) {
					expect(result).to.be.ok();
					console.log('----------------------------------------------------');
					console.log('Dependency: ', this.appContext.spec['global'].$module.params);
				}, this));

				this.appContext.wire(SimpleSpec);
			});

			it('Should Wire Advanced Spec (Module Dependency)', function(done) {
				this.appContext.on(Context.EVENTS.initialized, _.bind(function(ctx) {
					expect(ctx).to.be.ok();
					this.appContext.off();
					done();
				}, this)).on(Context.EVENTS.plugin + ' ' + Context.EVENTS.created, _.bind(function(result) {
					expect(result).to.be.ok();
					console.log(result);
				}, this)).on(Context.EVENTS.ready, _.bind(function(result) {
					expect(result).to.be.ok();
					console.log('----------------------------------------------------');
					console.log('Dependency: ', this.appContext.spec['content'].$module.params.dependencyA);
					console.log('Dependency: ', this.appContext.spec['viewC'].$module.params.dependencyA);
					console.log('Dependency: ', this.appContext.spec['subcontent'].$module.params.dependency1);
					console.log('Dependency: ', this.appContext.spec['subcontent'].$module.params.dependency2);
				}, this));

				this.appContext.wire(AdvancedSpec, function(ctx) {
					expect(ctx).to.be.ok();
					expect(ctx.spec).to.be.ok();
					expect(ctx.spec.viewC).to.be.ok();
				});
			});

			it('Should NOT wire Specs (Spect format is invalid)', function() {

			});

		});

	});

});
