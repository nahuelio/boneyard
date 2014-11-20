/**
*	com.spinal.ioc.Context Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/context',
		'util/exception/context',
		'ui/view',
		'ui/container',
		'specs/simple.spec',
		'specs/advanced.spec',
		'specs/plugin.spec'], function(Context, ContextException, View, Container,
			SimpleSpec, AdvancedSpec, PluginSpec) {

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
					expect(ctx.engine).to.be.ok();
					done();
				}, this));
			});

		});

		/**
		*	Context#factory() test
		**/
		describe('#factory()', function() {

			it('Should NOT execute a factory method (method not defined)', function() {
				var result = this.appContext.bonefactory();
				expect(result).not.be.ok();
			});

			it('Should NOT execute a factory method (method is not declared in BoneFactory Class)', function() {
				var result = this.appContext.bonefactory('method-non-existent');
				expect(result).not.be.ok();
			});

		});

		/**
		*	Context#wire() test
		**/
		describe('#wire()', function() {

			it('Should Wire Simple specs (Boolean, String, Numbers, Object, Array, Date, RegExp, etc)', function(done) {
				this.appContext.off().on(Context.EVENTS.initialized, _.bind(function(ctx) {
					expect(ctx).to.be.ok();
					done();
				}, this)).on(Context.EVENTS.processorCompleted, _.bind(function(result) {
					expect(result).to.be.ok();
				}, this));

				this.appContext.wire(SimpleSpec, _.bind(function(ctx) {
					expect(ctx).to.be.ok();
					var model = ctx.getBone('model');
					expect(model.get('_o')).to.be.an('object');
					expect(model.get('_b')).to.be.an('boolean');
					expect(model.get('_a')[0]).to.be.equal(model.get('_n'));
					expect(model.get('_o').prop).to.be.equal(model.get('_s'));
				}));
			});

			it('Should Wire Advanced Spec (Module Dependency)', function(done) {
				this.appContext.off().on(Context.EVENTS.initialized, _.bind(function(ctx) {
					expect(ctx).to.be.ok();
					done();
				}, this)).on(Context.EVENTS.processorCompleted, _.bind(function(result) {
					expect(result).to.be.ok();
				}, this));

				this.appContext.wire(AdvancedSpec, function(ctx) {
					expect(ctx).to.be.ok();
					expect(ctx.engine).to.be.ok();
					var model = ctx.getBone('model'),
						theme = ctx.getBone('theme'),
						subcontent = ctx.getBone('subcontent'),
						integrity = ctx.getBone('integrity');
					expect(model.get('_string')).to.be.equal(theme);
					expect(subcontent.model).to.be.ok();
					expect(subcontent.model.get('_int')).to.be.equal(10);
					expect(integrity.get('simple').$el).to.be.ok();
				});
			});

			it('Should NOT wire Specs (Spect format is invalid)', function() {
				expect(_.bind(function() {
					this.appContext.wire('non-valid-format');
				}, this)).to.throwException(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be.equal(ContextException.TYPES.InvalidSpecFormat());
				});
			});

		});

		/**
		*	Context#wire() Test Cases for possible semantics errors in Specs
		*/
		describe('#wire() - Semantics Errors', function() {

			it('Error 1 - TODO', function() { var errorSpec = {}; });

			it('Error 2 - TODO', function() { var errorSpec = {}; });

			it('Error N - TODO', function() { var errorSpec = {}; });

		});

		/**
		*	Context#getBonesByClass() test
		**/
		describe('#getBonesByClass()', function() {

			it('Should return a list of bones filtered by class', function() {
				var bones = this.appContext.getBonesByClass(View.NAME);
				expect(bones).to.have.length(6);
				_.each(bones, function(b) { expect(b).to.be.an(View); });
			});

		});

		/**
		*	Context#getBonesByType() test
		**/
		describe('#getBonesByType()', function() {

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
				this.appContext.off().on(Context.EVENTS.initialized, _.bind(function(ctx) {
					expect(ctx).to.be.ok();
					done();
				}, this)).on(Context.EVENTS.plugin + ' ' + Context.EVENTS.created, _.bind(function(result) {
					expect(result).to.be.ok();
					expect(result).to.be.an('array');
				}, this)).on(Context.EVENTS.ready, _.bind(function(result) {
					expect(result).to.be.ok();
				}, this));

				this.appContext.wire(PluginSpec, function(ctx) {
					expect(ctx).to.be.ok();
					expect(ctx.engine.root).to.be.ok();
				});
			});

			it('HTMLPlugin: Should Retrieve a template with params', function() {
				var output = this.appContext.tpl('spinal!head.css', { href: 'URI' });
				expect($(output).attr('href')).to.be.equal('URI');
				expect($(output).prop('tagName').toLowerCase()).to.be.equal('link');
			});

			it('HTMLPlugin: Should Load a new Template package at runtime', function(done) {
				this.appContext.loadTemplate('ui', _.bind(function() {
					var output = this.appContext.tpl('ui!ui.div', { id: '', cls: 'myclass' });
					expect($(output).hasClass('myclass')).to.be.equal(true);
					expect($(output).prop('tagName').toLowerCase()).to.be.equal('div');
					// Without params
					output = this.appContext.tpl('ui!ui.rule');
					expect($(output).prop('tagName').toLowerCase()).to.be.equal('hr');
					done();
				}, this));
			});

			it('HTMLPlugin: Errors', function() {
				// No Route
				var output = this.appContext.tpl();
				expect(output).to.be.equal('');
				// Query with no package
				var output = this.appContext.tpl('non.existent');
				expect(output).to.be.equal('');
				// No Template Package name specified
				this.appContext.loadTemplate();
			});

			it('ThemePlugin: Should Change the theme', function() {
				// Spinal Active
				var $linkSpinal = $('head > link[theme="spinal"]');
				var $linkBootstrap = $('head > link[theme="bootstrap"]');
				expect($linkSpinal.length).to.be.equal(1);
				expect($linkBootstrap.length).to.be.equal(0);
				expect(this.appContext.theme.name).to.be.equal('spinal');

				this.appContext.changeTheme('bootstrap');

				// Bootstrap Active
				var $linkSpinal = $('head > link[theme="spinal"]');
				var $linkBootstrap = $('head > link[theme="bootstrap"]');
				expect($linkSpinal.length).to.be.equal(0);
				expect($linkBootstrap.length).to.be.equal(1);
				expect(this.appContext.theme.name).to.be.equal('bootstrap');
			});

		});

	});

});
