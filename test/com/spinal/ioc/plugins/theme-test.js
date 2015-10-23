/**
*	com.spinal.ioc.plugins.ThemePlugin Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/plugins/theme',
	'ioc/context',
	'util/adt/collection',
	'specs/plugin.spec'], function(ThemePlugin, Context, Collection, PluginSpec) {

	describe('com.spinal.ioc.plugins.ThemePlugin', function() {

		before(function() {
			this.plugin = null;
		});

		after(function() {
			delete this.plugin;
		});

		describe('#new()', function() {

			it('Should return an instance of ThemePlugin', function() {
				this.plugin = new ThemePlugin({ engine: Context.engine, config: PluginSpec.$plugins.theme });
				expect(this.plugin).to.be.a(ThemePlugin);
				expect(this.plugin.themes).to.be.a(Collection);
				expect(this.plugin.themes.size()).to.be(2);
				expect(this.plugin.$header).to.be.ok();
			});

			it('Should throw an error: Engine is not specified or no constructor arguments are passed', function() {
				// Engine not specified
				expect(function() {
					new ThemePlugin({ config: PluginSpec.$plugins.theme });
				}).to.throwException(function(e) {
					expect(e.message).to.be('IoCPlugin requires an instance of a com.spinal.ioc.engine.Engine in order to work.');
				});

				// No constructor arguments are passed
				expect(function() {
					new ThemePlugin();
				}).to.throwException(function(e) {
					expect(e.message).to.be('IoCPlugin requires an instance of a com.spinal.ioc.engine.Engine in order to work.');
				});
			});

		});

		describe('#currentTheme()', function() {

			it('Should return the current theme', function() {
				// Returns null: Initially no theme is applied
				expect(this.plugin.currentTheme()).not.be.ok();
			});

		});

		describe('#useBootstrap()', function() {

			it('Should inject bootstrap-core and bootstrap-theme', function() {
				var result = this.plugin.useBootstrap();
				expect(result).to.be.a(ThemePlugin);
				expect(this.plugin.$header.find('link[theme="bootstrap-core"]').length).to.be(1);
				expect(this.plugin.$header.find('link[theme="bootstrap-theme"]').length).to.be(1);
				// Clean up
				this.plugin.$header.find('link[theme="bootstrap-core"]').remove();
				this.plugin.$header.find('link[theme="bootstrap-theme"]').remove();
			});

			it('Should inject only bootstrap-core', function() {
				var getConfigStub = sinon.stub(this.plugin, 'getConfig').returns({
					basePath: '/base/test', bootstrap: true
				});

				var result = this.plugin.useBootstrap();
				expect(result).to.be.a(ThemePlugin);
				expect(this.plugin.$header.find('link[theme="bootstrap-core"]').length).to.be(1);
				expect(this.plugin.$header.find('link[theme="bootstrap-theme"]').length).to.be(0);

				this.plugin.getConfig.restore();
				// Clean up
				this.plugin.$header.find('link[theme="bootstrap-core"]').remove();
			});

			it('Should NOT inject boostrap (core and theme)', function() {
				var getConfigStub = sinon.stub(this.plugin, 'getConfig').returns({ basePath: '/base/test' });

				var result = this.plugin.useBootstrap();
				expect(result).to.be.a(ThemePlugin);
				expect(this.plugin.$header.find('link[theme="bootstrap-core"]').length).to.be(0);
				expect(this.plugin.$header.find('link[theme="bootstrap-theme"]').length).to.be(0);

				this.plugin.getConfig.restore();
			});

		});

		describe('#useDefault()', function() {

			it('Should inject theme flagged as default');

		});

		describe('#validate()', function() {

			it('Should return false: theme name is not a String');

			it('Should return false: theme is not registered');

			it('Should return false: current theme is the same as the one being validated');

		});

		describe('#applyTheme()', function() {

			it('Should inject a given theme');

		});

		describe('#removeTheme()', function() {

			it('Should remove all themes except for bootstrap core and theme');

		});

		describe('#resolveURI()', function() {

			it('Should resolve theme URI for a given theme path');

		});

		describe('#getTheme()', function() {

			it('Should retrieve a theme object registered given a theme name');

			it('Should NOT retrieve a theme object registered given a theme name');

		});

		describe('#changeTheme()', function() {

			it('Should change the current theme with another one given a theme name');

		});

		describe('#run()', function() {

			it('Should executes plugin logic');

		});

	});

});
