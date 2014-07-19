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
				}, this)).on(Context.EVENTS.plugin + ' ' + Context.EVENTS.created, _.bind(function(result) {
					expect(result).to.be.ok();
					console.log(result);
				}, this)).on(Context.EVENTS.ready, _.bind(function(result) {
					expect(result).to.be.ok();
					console.log(result);
					this.appContext.off();
					done();
				}, this));

				this.appContext.wire(SimpleSpec, function(ctx) {
					expect(ctx).to.be.ok();
					expect(ctx.spec).to.be.ok();
					expect(ctx.spec.content).to.be.ok();
				});
			});

			// it('Should Wiere Advanced Spec (Module Dependency)', function(done) {
			// 	this.appContext.on(Context.EVENTS.initialized, _.bind(function(ctx) {
			// 		expect(ctx).to.be.ok();
			// 		this.appContext.off();
			// 	}, this)).on(Context.EVENTS.changed, _.bind(function(result) {
			// 		expect(result).to.be.ok();
			// 		expect(result.type).to.be.ok();
			// 		expect(result.bones).to.be.ok();
			// 		console.log(result.type, result.bones);
			// 		console.log(Context['ReadyProcessor']);
			// 		if(Context['ReadyProcessor'] && result.type === Context['ReadyProcessor'].EVENTS.ready) {
			// 			console.log('----------------------------------------------------');
			// 			console.log('Dependency: ', ctx.spec['content'].$module.params);
			// 			console.log('Dependency: ', ctx.spec['viewC'].$module.params);
			// 			console.log('Dependency: ', ctx.spec['subcontent'].$module.params);
			// 			done();
			// 		}
			// 	}, this));
			//
			// 	this.appContext.wire(AdvancedSpec, function(ctx) {
			// 		expect(ctx).to.be.ok();
			// 		expect(ctx.spec).to.be.ok();
			// 		expect(ctx.spec.viewC).to.be.ok();
			// 	});
			// });

		});

	});

});
