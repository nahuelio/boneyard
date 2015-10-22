/**
*	com.spinal.ioc.plugins.ThemePlugin Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/plugins/theme'], function(ThemePlugin) {

	describe('com.spinal.ioc.plugins.ThemePlugin', function() {

		before(function() {
			this.plugin = null;
		});

		after(function() {
			delete this.plugin;
		});

		describe('#new()', function() {

			it('Should return an instance of ThemePlugin');

		});

		describe('#parse()', function() {

			it('Should parse themes from specified on a given spec');

		});

		describe('#currentTheme()', function() {

			it('Should return the current theme');

		});

		describe('#useBootstrap()', function() {

			it('Should inject bootstrap-core and bootstrap-theme');

			it('Should inject only bootstrap-core');

			it('Should inject only bootstrap-theme');

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
