/**
*	com.boneyard.ioc.engine.annotation.Plugin Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/annotation/plugin',
	'ioc/engine/helpers/injector',
	'ioc/plugins/plugin',
	'ioc/context',
	'specs/plugin.spec'], function(Plugin, Injector, IoCPlugin, Context, PluginSpec) {

	describe('com.boneyard.ioc.engine.annotation.Plugin', function() {

		before(function() {
			this.plugin = null;
		});

		after(function() {
			delete this.plugin;
		});

		describe('#new()', function() {

			it('Should return an instance of a Plugin', function() {

				this.plugin = new Plugin(_.pick(PluginSpec.$plugins, 'html'));
				expect(this.plugin).to.be.ok();
				expect(this.plugin.toString()).to.be('[object Plugin]');
				expect(this.plugin.getId()).to.be('html');
				expect(this.plugin.getValue()).to.be.an('object');
				expect(this.plugin.getValue().account).to.be.ok();
				expect(this.plugin.getValue().cart).to.be.ok();
				expect(this.plugin.getInjector().getDependencies().size()).to.be(2);
			});

		});

		describe('#create()', function() {

			it('Should instanciate a given plugin', function() {
				var genericPlugin = new IoCPlugin({ engine: Context.engine });
				var createStub = sinon.stub(this.plugin.getInjector(), 'create');
				var pluginStub = sinon.stub(this.plugin, 'plugin').returns(genericPlugin);

				var result = this.plugin.create();
				expect(result).to.be.a(IoCPlugin);

				this.plugin.getInjector().create.restore();
				this.plugin.plugin.restore();
			});

		});

		describe('#resolve()', function() {

			it('Should resolve plugin dependencies', function() {
				// Dependency resolution simulation
				var createStub = sinon.stub(this.plugin.getInjector(), 'resolve', _.bind(function() {
					var account = this.plugin.getDependencies().get(0),
						cart = this.plugin.getDependencies().get(1);
					account.getTarget()[account.getProperty()] = PluginSpec.account_html;
					cart.getTarget()[cart.getProperty()] = PluginSpec.cart_html;
				}, this));

				var result = this.plugin.resolve();
				expect(result).to.be.a(Plugin);
				expect(result.getValue().account).to.be.a('object');
				expect(result.getValue().account.path).to.be('html/account.json');
				expect(result.getValue().cart).to.be.a('object');
				expect(result.getValue().cart.path).to.be('html/cart.json');

				this.plugin.getInjector().resolve.restore();
			});

		});

		describe('#run()', function() {

			it('Should execute plugin runner', function() {
				var runSpy = sinon.spy();
				this.plugin._$created = { run: runSpy };
				var isCreatedStub = sinon.stub(this.plugin, 'isCreated').returns(true);

				expect(this.plugin.run()).to.be.ok();
				expect(runSpy.calledOnce);

				delete this.plugin._$created;
				this.plugin.isCreated.restore();
			});

			it('Should NOT execute a plugin runner if it\'s not instanciated', function() {
				expect(this.plugin.run()).to.be.ok();
			});

		});

		describe('#isModule()', function() {

			it('Should return true (Plugin is always a module)', function() {
				expect(this.plugin.isModule()).to.be(true);
			});

		});

		describe('#isCreated()', function() {

			it('Should return true when plugin is instanciated', function() {
				this.plugin._$created = { run: function() {} };
				expect(this.plugin.isCreated()).to.be(true);
			});

		});

		describe('static#only()', function() {

			it('Should extract only plugins', function() {
				var result = Plugin.only({ $id: 'something', $specs: [], bone: true, $plugins: { pluginA: {} } });
				expect(result).to.be.ok();
				expect(result).to.be.an('object');
				expect(result.pluginA).to.be.ok();
			});

			it('Should not extract plugins (plugins annotation not found)', function() {
				var result = Plugin.only({ $id: 'something', $specs: [], bone: true });
				expect(result).to.be.ok();
				expect(result).to.be.an('object');
				expect(result).to.be.empty();
			});

		});

	});

});
