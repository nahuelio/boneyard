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

			it('Should Wire Simple specs (Boolean, String, Numbers, Object, Array, Date, RegExp, etc)', function(done) {
				this.appContext.on(Context.EVENTS.initialized, _.bind(function(ctx) {
					expect(ctx).to.be.ok();
					this.appContext.off();
					done();
				}, this)).on(Context.EVENTS.plugin + ' ' + Context.EVENTS.created, _.bind(function(result) {
					expect(result).to.be.ok();
					expect(result).to.be.an('array');
				}, this)).on(Context.EVENTS.ready, _.bind(function(result) {
					expect(result).to.be.ok();
					var model = this.appContext.getBone('model');
					expect(model.get('_o')).to.be.an('object');
					expect(model.get('_b')).to.be.an('boolean');
					expect(model.get('_a')[0]).to.be.equal(model.get('_n'));
					expect(model.get('_o').prop).to.be.equal(model.get('_s'));
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
					expect(result).to.be.an('array');
				}, this)).on(Context.EVENTS.ready, _.bind(function(result) {
					expect(result).to.be.ok();
					var model = this.appContext.getBone('model'),
						theme = this.appContext.getBone('theme');
					expect(model.get('_string')).to.be.equal(theme);
				}, this));

				this.appContext.wire(AdvancedSpec, function(ctx) {
					expect(ctx).to.be.ok();
					expect(ctx.spec).to.be.ok();
					expect(ctx.spec.viewC).to.be.ok();
				});
			});

			it('Should NOT wire Specs (Spect format is invalid)', function() {
				expect(_.bind(function() {
					this.appContext.wire('non-valid-format');
				}, this)).to.throwException(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be.equal(ContextException.TYPES.InvalidSpecFormat);
				});
			});

		});

		/**
		*	Context#wire() Test Cases for possible semantics errors in Specs
		*/
		describe('#wire() - Semantics Errors', function() {

			it('Error:', function() {
				var errorSpec = {};
			});

			// Continue adding more error test cases

		});

		/**
		*	Context#getBonesBy() test
		**/
		describe('#getBonesBy()', function() {

			it('Should return a list of bones by a predicate', function() {
				var bones = this.appContext.getBonesBy(function(bone, id) {
					return (bone.id && bone.id.indexOf('content') != -1);
				});
				expect(bones).to.have.length(2);
				expect(bones[0]).to.be.a(Container);
			});

			it('Should return an empty list of bones by a predicate', function() {
				var bones = this.appContext.getBonesBy(function(bone, id) {
					return (bone.id && bone.id === 'non-existent');
				});
				expect(bones).to.have.length(0);
			});

		});

		/**
		*	Context#getBonesByClass() test
		**/
		describe('#getBonesByClass()', function() {

			it('Should return a list of bones filtered by class', function() {
				var bones = this.appContext.getBonesByClass(View.NAME);
				expect(bones).to.have.length(5);
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
		describe('#wire() - PluginSpec', function() {

			it('Should Wire Plugin Spec (Plugins tasks)', function(done) {
				this.appContext.on(Context.EVENTS.initialized, _.bind(function(ctx) {
					expect(ctx).to.be.ok();
					this.appContext.off();
					done();
				}, this)).on(Context.EVENTS.plugin + ' ' + Context.EVENTS.created, _.bind(function(result) {
					expect(result).to.be.ok();
					expect(result).to.be.an('array');
				}, this)).on(Context.EVENTS.ready, _.bind(function(result) {
					expect(result).to.be.ok();
				}, this));

				this.appContext.wire(PluginSpec, function(ctx) {
					expect(ctx).to.be.ok();
					expect(ctx.spec).to.be.ok();
				});
			});

		});

	});

});
