/**
*	Master Pass Test on IoC full implementation
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/context',
	'ui/view',
	'ui/container',
	'specs/simple.spec',
	'specs/advanced.spec'], function(Context, View, Container, SimpleSpec, AdvancedSpec) {

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
					// Non-module test case
					var nested = this.context.bone('nested').bone();
					var s = this.context.bone('s').bone();
					expect(nested[0].deep.prop).to.be(s);

					// Module test cases
					var content = this.context.bone('content').bone();
					var holder = this.context.bone('holder').bone();
					var simple = this.context.bone('simple').bone();

					expect(content.get(0)).to.be.a(View);
					expect(content.get(0).id).to.be(simple.id);
					expect(holder.subcontent).to.be.a(View);
					expect(holder.subcontent.id).to.be(content.get(1).id);

					done();
				}, this));
				this.context.wire(SimpleSpec);
			});

		});

		describe('Advanced Spec', function() {

			it('Should Wire Advanced Spec');

		});

		describe('Plugin Spec', function() {

		});

	});

});
