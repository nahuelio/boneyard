/**
*	com.boneyard.ioc.plugins.ThemePlugin Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/plugins/theme',
	'ioc/context',
	'util/adt/collection',
	'specs/plugin.spec'], function(ThemePlugin, Context, Collection, PluginSpec) {

	describe('com.boneyard.ioc.plugins.ThemePlugin', function() {

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
					expect(e.message).to.be('IoCPlugin requires an instance of a com.boneyard.ioc.engine.Engine in order to work.');
				});

				// No constructor arguments are passed
				expect(function() {
					new ThemePlugin();
				}).to.throwException(function(e) {
					expect(e.message).to.be('IoCPlugin requires an instance of a com.boneyard.ioc.engine.Engine in order to work.');
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

			it('Should inject theme flagged as default', function() {
				var changeThemeStub = sinon.stub(this.plugin, 'changeTheme')
					.withArgs('boneyard')
					.returns(this.plugin);

				var result = this.plugin.useDefault();
				expect(result).to.be.a(ThemePlugin);

				this.plugin.changeTheme.restore();
			});

			it('Should NOT inject theme flagged as default (no package flagged as default)', function() {
				var themesFindStub = sinon.stub(this.plugin.themes, 'find').returns(null);
				var changeThemeSpy = sinon.spy(this.plugin, 'changeTheme');

				var result = this.plugin.useDefault();
				expect(result).to.be.a(ThemePlugin);
				expect(changeThemeSpy.called).to.be(false);

				this.plugin.themes.find.restore();
				this.plugin.changeTheme.restore();
			});

		});

		describe('#validate()', function() {

			it('Should return false: theme name is not a String', function() {
				expect(this.plugin.validate({})).to.be(false);
			});

			it('Should return false: theme is not registered', function() {
				expect(this.plugin.validate('noExistent')).to.be(false);
			});

			it('Should return false: current theme is the same as the one being validated', function() {
				this.plugin.theme = this.plugin.themes.get(0);
				expect(this.plugin.validate('boneyard')).to.be(false);
				delete this.plugin.theme;
			});

			it('Should return true: valid theme given a name', function() {
				expect(this.plugin.validate('silver')).to.be(true);
			});

		});

		describe('#applyTheme()', function() {

			it('Should inject a given theme', function() {
				expect(this.plugin.applyTheme(this.plugin.getTheme('silver'))).to.be.a(ThemePlugin);
				expect(this.plugin.$header.find('link[theme="silver"]').length).to.be(1);
				this.plugin.$header.find('link[theme="silver"]').remove();
			});

		});

		describe('#removeTheme()', function() {

			it('Should remove all themes except for bootstrap core and theme', function() {
				// Simulation Setup

				// Bootstrap Added
				this.plugin.useBootstrap();
				expect(this.plugin.$header.find('link[theme="bootstrap-core"]').length).to.be(1);
				expect(this.plugin.$header.find('link[theme="bootstrap-theme"]').length).to.be(1);

				// Silver Theme
				this.plugin.applyTheme(this.plugin.getTheme('silver'));
				expect(this.plugin.$header.find('link[theme="silver"]').length).to.be(1);

				expect(this.plugin.removeTheme()).to.be.a(ThemePlugin);
				expect(this.plugin.$header.find('link[theme="silver"]').length).to.be(0);
				expect(this.plugin.$header.find('link[theme="bootstrap-core"]').length).to.be(1);
				expect(this.plugin.$header.find('link[theme="bootstrap-theme"]').length).to.be(1);
				this.plugin.$header.find('link[theme="bootstrap-core"]').remove();
				this.plugin.$header.find('link[theme="bootstrap-theme"]').remove();
			});

		});

		describe('#resolveURI()', function() {

			it('Should resolve theme URI for a given theme path', function() {
				var theme = this.plugin.themes.get(0);
				var result = this.plugin.resolveURI(theme.path);
				expect(result).to.be.a('string');
				expect(result).to.be('/base/test/com/boneyard/ioc/themes/boneyard.css');
			});

		});

		describe('#getTheme()', function() {

			it('Should retrieve a theme object registered given a theme name', function() {
				var result = this.plugin.getTheme('silver');
				expect(result).to.be.a('object');
				expect(result.path).to.be.a('string');
				expect(result.name).to.be.a('string');
			});

			it('Should NOT retrieve a theme object registered given a theme name', function() {
				var result = this.plugin.getTheme('cooper');
				expect(result).not.be.ok();
			});

		});

		describe('#changeTheme()', function() {

			it('Should change the current theme with another one given a theme name', function() {
				// Simulation Setup: Bootstrap Added
				this.plugin.useBootstrap();

				// Change Theme 1st time
				var result = this.plugin.changeTheme('silver');
				expect(result).to.be.a(ThemePlugin);
				expect(result.theme.name).to.be('silver');
				expect(this.plugin.$header.find('link[theme="bootstrap-core"]').length).to.be(1);
				expect(this.plugin.$header.find('link[theme="bootstrap-theme"]').length).to.be(1);
				expect(this.plugin.$header.find('link[theme="silver"]').length).to.be(1);

				// Change Theme 2nd time
				result = this.plugin.changeTheme('boneyard');
				expect(result).to.be.a(ThemePlugin);
				expect(result.theme.name).to.be('boneyard');
				expect(this.plugin.$header.find('link[theme="bootstrap-core"]').length).to.be(1);
				expect(this.plugin.$header.find('link[theme="bootstrap-theme"]').length).to.be(1);
				expect(this.plugin.$header.find('link[theme="silver"]').length).to.be(0);
				expect(this.plugin.$header.find('link[theme="boneyard"]').length).to.be(1);

				// Clean up
				this.plugin.$header.find('link[theme="bootstrap-core"]').remove();
				this.plugin.$header.find('link[theme="bootstrap-theme"]').remove();
				this.plugin.$header.find('link[theme="boneyard"]').remove();
				this.plugin.theme = null;
			});

			it('Should NOT change the current theme: name was not defined', function() {
				// Simulation Setup: Bootstrap Added
				this.plugin.useBootstrap();
				// With 1 already applied
				this.plugin.changeTheme('silver');

				var result = this.plugin.changeTheme();
				expect(result).to.be.a(ThemePlugin);
				expect(result.theme.name).to.be('silver');
				expect(this.plugin.$header.find('link[theme="silver"]').length).to.be(1);

				// Clean up
				this.plugin.$header.find('link[theme="bootstrap-core"]').remove();
				this.plugin.$header.find('link[theme="bootstrap-theme"]').remove();
				this.plugin.$header.find('link[theme="silver"]').remove();
				this.plugin.theme = null;
			});

		});

		describe('#run()', function() {

			it('Should executes plugin logic', function() {
				var result = this.plugin.run();
				expect(result).to.be.a(ThemePlugin);
				// List of functions should be proxified Boneyard core
				expect(Boneyard.changeTheme).to.be.a('function');
				expect(Boneyard.removeTheme).to.be.a('function');
				expect(Boneyard.currentTheme).to.be.a('function');

				// Default should be applied
				expect(result.currentTheme()).to.be.a('object');
				expect(result.currentTheme().name).to.be('boneyard');
				expect(this.plugin.$header.find('link[theme="boneyard"]').length).to.be(1);

				// Bootstrap should be on (core and theme)
				expect(this.plugin.$header.find('link[theme="bootstrap-core"]').length).to.be(1);
				expect(this.plugin.$header.find('link[theme="bootstrap-theme"]').length).to.be(1);
			});

		});

	});

});
