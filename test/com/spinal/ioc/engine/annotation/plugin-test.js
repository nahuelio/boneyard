/**
*	com.spinal.ioc.engine.annotation.Plugin Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/annotation/plugin',
	'ioc/engine/helpers/injector'], function(Plugin, Injector) {

	describe('com.spinal.ioc.engine.annotation.Plugin', function() {

		before(function() {
			this.plugin = null;
			this.pluginHTML = {
				html: {
					account: '$bone!partials-account',
					cart: 'partials/cart'
				}
			};
			this.pluginTheme = {
				theme: {
					config: { basePath: 'themes' },
					bootstrap: ['bootstrap/css/bootstrap.min.css', 'bootstrap/css/bootstrap-theme.min.css'],
					custom: 'custom/silver.css'
				}
			};
			this.htmlDependencies = [{
				expression: '$bone!partials-account',
				target: { account: '$bone!boneObj' },
				property: 'account',
				bone: {}
			}];
		});

		after(function() {
			delete this.plugins;
			delete this.plugin;
		});

		describe('#new()', function() {

			it('Should return an instance of a Plugin', function() {
				var retrieveStub = sinon.stub(Plugin.prototype, 'retrieve').returns(this.htmlDependencies);

				this.plugin = new Plugin(this.pluginHTML);
				expect(this.plugin).to.be.ok();
				expect(this.plugin.toString()).to.be('[object Plugin]');
				expect(this.plugin.getId()).to.be('html');
				expect(this.plugin.getValue()).to.be.an('object');
				expect(this.plugin.getInjector()).to.be.a(Injector);

				retrieveStub.restore();
			});

		});

		describe('#retrieve()', function() {

			it('Should retrieve array of dependency object structure', function() {
				expect(this.plugin.getInjector().getDependencies().size()).to.be(1);
			});

			it('Should return an empty array of dependency object structures', function() {
				var noDependenciesPlugin = new Plugin({ myplugin: { config: { path: 'path/to/config' } } });
				expect(noDependenciesPlugin.getInjector().getDependencies().size()).to.be(0);
			});

		});

		describe('#run()', function() {

			it('Should execute plugin runner', function() {
				this.plugin._$created = { run: function() {} };
				var isCreatedStub = sinon.stub(this.plugin, 'isCreated').returns(true);
				var createdMock = sinon.mock(this.plugin._$created);
				createdMock.expects('run').once();

				expect(this.plugin.run()).to.be.ok();

				createdMock.verify();
				delete this.plugin._$created;
				isCreatedStub.restore();
			});

			it('Should NOT execute a plugin runner if it\'s not instanciated', function() {
				expect(this.plugin.run()).to.be.ok();
			});

		});

		describe('#isCreated()', function() {

			it('Should return true when plugin is instanciated');

		});

		describe('static#only()', function() {

			it('Should extract only plugins', function() {
				var result = Plugin.only({ $id: 'something', $specs: [], bone: true, $plugins: {} });
				expect(result).to.be.ok();
				expect(result.$id).to.be(undefined);
				expect(result.$specs).to.be(undefined);
				expect(result.$plugins).to.be.ok();
			});

		});

	});

});
