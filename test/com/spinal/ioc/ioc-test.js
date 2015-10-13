/**
*	Master Pass Test on IoC full implementation
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/context',
	'specs/simple.spec'], function(Context, SimpleSpec) {

	describe.skip('IoC Master Pass', function() {

		before(function() {
			this.context = null;
		});

		after(function() {
			delete this.context;
		});

		describe('Simple Spec', function() {

			it('Should Wire Simple Spec', function(done) {
				this.context = new Context();
				this.context.on(Context.EVENTS.complete, _.bind(function(type, spec) {
					console.log('------------- FINAL --------------');
					console.log(this.context.bone('nested').bone());
					console.log(this.context.bone('simple').bone());
					console.log('Content container: ', this.context.bone('content').bone());
					done();
				}, this));
				this.context.wire(SimpleSpec);
			});

		});

		describe('Advanced Spec', function() {

		});

		describe('Plugin Spec', function() {

		});

	});

});
