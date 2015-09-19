/**
*	com.spinal.ioc.Context Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/context',
		'ioc/engine/engine',
		'ui/view',
		'ui/container',
		'specs/simple.spec',
		'specs/advanced.spec',
		'specs/plugin.spec'], function(Context, Engine, View, Container,
			SimpleSpec, AdvancedSpec, PluginSpec) {

	describe.skip('com.spinal.ioc.Context', function() {

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
					expect(ctx).to.be.a(Context);
					expect(ctx.getEngine()).to.be.ok();
					done();
				}, this));
				expect(this.appContext).to.be.ok();
				expect(this.appContext).to.be.a(Context);
			});

		});

		/**
		*	Context#wire() test
		**/
		describe('#wire()', function() {

			it.skip('Should Wire Simple specs (Boolean, String, Numbers, Object, Array, Date, RegExp, etc)', function(done) {
				this.appContext.off().on(Context.EVENTS.start, _.bind(function(ctx) {
					expect(ctx).to.be.ok();
				}, this)).on(Context.EVENTS.complete, _.bind(function(ctx, type, spec) {
					expect(ctx).to.be.ok();
					expect(type).to.be(Engine.EVENTS.wire);
					expect(spec).to.be.an('object');
					done();
				}, this));

				this.appContext.wire(SimpleSpec, _.bind(function(ctx) {
					expect(ctx).to.be.ok();
					expect(ctx).to.be.a(Context);

					var globalView = ctx.bone('global');
					console.log(globalView);
					// 	model = ctx.bone('model'),
					// 	simple = ctx.bone('simple');

					// expect(globalView).to.be.a(Container);
					// expect(globalView.$el.hasClass('chrome')).to.be(true);
					//
					// expect(model.get('_o')).to.be.an('object');
					// expect(model.get('_b')).to.be.an('boolean');
					// expect(model.get('_a')[0]).to.be.equal(model.get('_n'));
					// expect(model.get('_o').prop).to.be.equal(model.get('_s'));
					// expect(model.get('_nested')[0].deep.prop).to.be.equal(model.get('_o').prop);
					// expect(model.get('_nested')[1].prop).to.be.equal(model.get('_n'));
					// // Check out $ready first command, _test is being changed
					// expect(model.get('_test')).to.be(simple.toString());
				}, this));
			});

			it.skip('Should Wire Advanced Spec (Module Dependency)', function(done) {
				this.appContext.off().on(Context.EVENTS.initialize, _.bind(function(ctx) {
					expect(ctx).to.be.ok();
				}, this)).on(Context.EVENTS.complete, _.bind(function(ctx) {
					expect(ctx).to.be.ok();
					done();
				}, this));

				this.appContext.wire(AdvancedSpec, function(ctx) {
					expect(ctx).to.be.ok();
					var model = ctx.getBone('model'),
						theme = ctx.getBone('theme'),
						content = ctx.getBone('content'),
						subcontent = ctx.getBone('subcontent'),
						integrity = ctx.getBone('integrity'),
						viewC = ctx.getBone('viewC');

					expect(model.get('_string')).to.be.equal(theme);

					expect(theme).to.be('chrome');

					expect(content.get(0)).to.be(viewC);

					expect(subcontent.model).to.be.ok();
					expect(subcontent.model.get('_int')).to.be.equal(10);
					expect(subcontent.get(0).lookup(function(view) { return (view.id === 'subcontent'); })).to.be(subcontent);

					expect(integrity.get('anotherView').$el).to.be.ok();
					expect(integrity.get('schema')).to.be.ok();
					expect(integrity.get('schema')._float).to.be('float');

					expect(viewC.lookup(function(view) { return (view.id === 'content'); })).to.be(content);
					expect(viewC.get(1)).to.be(ctx.getBone('view2'));
				});
			});

			it.skip('Should NOT wire Specs (Spect format is invalid)', function() {
				expect(_.bind(function() {
					this.appContext.wire('non-valid-format');
				}, this)).to.throwException(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be.equal(ContextException.TYPES.InvalidSpecFormat());
				});
			});

		});

		/**
		*	Context#getBonesByClass() test
		**/
		describe.skip('#getBonesByClass()', function() {

			it('Should return a list of bones filtered by class', function() {
				var bones = this.appContext.getBonesByClass(View.NAME);
				expect(bones).to.have.length(8);
				_.each(bones, function(b) { expect(b).to.be.an(View); });
			});

		});

		/**
		*	Context#getBonesByType() test
		**/
		describe.skip('#getBonesByType()', function() {

			it('Should return a list of bones filtered by type', function() {
				var bones = this.appContext.getBonesByType(Container);
				expect(bones).to.have.length(6);
				_.each(bones, function(b) { expect(b).to.be.an(Container); });
			});

		});

		/**
		*	Context#wire() test
		*	Plugin Specs
		**/
		describe.skip('#wire() - PluginSpec', function() {

			it('Should Wire Plugin Spec (Plugins tasks)', function(done) {
				this.appContext.off().on(Context.EVENTS.initialize, _.bind(function(ctx) {
					expect(ctx).to.be.ok();
					done();
				}, this)).on(Context.EVENTS.complete, _.bind(function(ctx) {
					expect(ctx).to.be.ok();
				}, this));

				this.appContext.wire(PluginSpec, function(ctx) {
					expect(ctx).to.be.ok();
					// Checks Context wrapped methods from plugins
					// Theme
					expect(Spinal.changeTheme).to.be.ok();
					expect(Spinal.currentTheme).to.be.ok();
					expect(Spinal.resetTheme).to.be.ok();
					// HTML Plugin
					expect(Spinal.isTemplateLoaded).to.be.ok();
					expect(Spinal.loadTemplate).to.be.ok();
					expect(Spinal.tpl).to.be.ok();
				});
			});

			it.skip('HTMLPlugin: Should Retrieve a template with params', function(done) {
				var evaluation = _.bind(function() {
					var output = Spinal.tpl('my.content.menu', { cls: 'menu' });
					expect($(output).attr('class')).to.be.equal('menu');
					expect($(output).prop('tagName').toLowerCase()).to.be.equal('div');
					done();
				}, this);
				(!Spinal.isTemplateLoaded('my')) ?
					this.appContext.off().on(Engine.EVENTS.plugin, _.bind(evaluation, this)) :
					evaluation();
			});

			it.skip('HTMLPlugin: Should Load a new Template package at runtime', function(done) {
				this.appContext.off();
				Spinal.loadTemplate('other', _.bind(function() {
					var output = Spinal.tpl('other.content.other', { cls: 'myclass' });
					expect($(output).hasClass('myclass')).to.be.equal(true);
					expect($(output).prop('tagName').toLowerCase()).to.be.equal('p');
					// Without params
					output = Spinal.tpl('other.content.rule');
					expect($(output).prop('tagName').toLowerCase()).to.be.equal('hr');
					// Javascript Logic though the usage of _$ symbol (simple 'cls' class check with default 'default')
					output = Spinal.tpl('other.content.other', {});
					expect($(output).hasClass('default')).to.be.equal(true);
					done();
				}, this));
			});

			it.skip('HTMLPlugin: Should Retrieve a template using the default provided by spinal', function() {
				// span
				var output = Spinal.tpl('tag', { tagName: 'span', id: 'testId', cls: 'testCls' });
				expect($(output).prop('tagName').toLowerCase()).to.be.equal('span');
				expect($(output).attr('id')).to.be.equal('testId');
				expect($(output).attr('class')).to.be.equal('testCls');
				// link
				var output = Spinal.tpl('tag', { tagName: 'a', attrs: { href: 'testHref' } });
				expect($(output).prop('tagName').toLowerCase()).to.be.equal('a');
				expect($(output).attr('href')).to.be.equal('testHref');
			});

			it.skip('HTMLPlugin: Errors', function() {
				// No Route
				var output = Spinal.tpl();
				expect(output).to.be.empty();
				// Query with no package
				var output = Spinal.tpl('non.existent');
				expect(output).to.be.equal('');
				// No Template Package name specified
				Spinal.loadTemplate();
			});

			it.skip('ThemePlugin: Should Change the theme (with Bootstrap active)', function() {
				// Bootstrap Active
				var $linkBootstrap = $('head > link[theme="bootstrap"]');
				expect($linkBootstrap.length).to.be.equal(1);

				// User-defined default theme "My"
				var $linkMy = $('head > link[theme="my"]');
				var $linkYours = $('head > link[theme="yours"]');
				expect($linkMy.length).to.be.equal(1);
				expect($linkYours.length).to.be.equal(0);
				expect(Spinal.currentTheme().name).to.be.equal('my');

				Spinal.changeTheme('yours');

				// "Yours" Theme active
				var $linkMy = $('head > link[theme="my"]');
				var $linkYours = $('head > link[theme="yours"]');
				expect($linkMy.length).to.be.equal(0);
				expect($linkYours.length).to.be.equal(1);
				expect(Spinal.currentTheme().name).to.be.equal('yours');
			});

		});

	});

});
