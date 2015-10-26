/**
*	Master Pass Test on IoC full implementation
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/context',
	'ui/view',
	'ui/container',
	'specs/ioc.spec',
	'specs/plugin.spec'], function(Context, View, Container, IocSpec, PluginSpec) {

	describe('IoC Master Pass', function() {

		before(function() {
			this.context = new Context();
		});

		after(function() {
			delete this.context;
		});

		describe('IoC Spec', function() {

			it('Should Wire IoC Spec', function(done) {
				this.context.on(Context.EVENTS.complete, _.bind(function(type, spec) {
					// Non-module test case
					var nested = this.context.bone('nested').bone();
					var s = this.context.bone('s').bone();
					expect(nested[0].deep.prop).to.be(s);

					// Module test cases
					var globalView = this.context.bone('global').bone();
					var content = this.context.bone('content').bone();
					var holder = this.context.bone('holder').bone();
					var simple = this.context.bone('simple').bone();
					var model = this.context.bone('model').bone();

					expect(globalView.views.size()).to.be(3);
					expect(content.get(0)).to.be.a(View);
					expect(content.get(0).id).to.be(simple.id);
					expect(holder.subcontent).to.be.a(View);
					expect(holder.subcontent.id).to.be(content.get(1).id);

					simple.on(View.EVENTS.update, _.bind(function(view) {
						expect(view.model.get('prop')).to.be('Hello IoC!');
						this.context.off();
						done();
					}, this));

					model.set('prop', 'Hello IoC!');
				}, this));
				this.context.wire(IocSpec);
			});

		});

		describe('Plugin Spec', function() {

			it('Should wire and setup plugins from Spec', function(done) {
				this.context.on(Context.EVENTS.plugin, _.bind(function(ctx, type, packages) {
					expect(ctx).to.be.a(Context);
					expect(packages).to.be.an('array');
					expect(packages).to.have.length(2);
					ctx.off(Context.EVENTS.plugin);
				}, this));

				this.context.wire(PluginSpec, _.bind(function(ctx) {
					expect(ctx).to.be.a(Context);

					// Modules cases
					var globalView = ctx.bone('global').bone();
					var account = ctx.bone('account').bone();
					var cart = ctx.bone('cart').bone();
					expect(account).to.be.a(Container);
					expect(cart).to.be.a(View);
					expect(globalView.views.size()).to.be(4);

					// Plugins
					expect(ctx.getEngine().plugins.size()).to.be(2);
					expect(Spinal.load).to.be.a('function');
					expect(Spinal.html).to.be.a('function');
					expect(Spinal.changeTheme).to.be.a('function');
					expect(Spinal.currentTheme).to.be.a('function');

					// HTML
					var template = Spinal.html('cart.cartitem', { cls: 'myitem', name: 1 });
					expect(template).to.be.a('string');
					expect($(template).text()).to.be('Cart Item 1');

					// ThemePlugin
					var theme = Spinal.currentTheme();
					expect(theme).to.be.a('object');
					expect(theme.name).to.be('spinal');

					ctx.off();
					done();
				}, this));
			});

		});

	});

});
