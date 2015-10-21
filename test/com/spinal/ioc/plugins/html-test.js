/**
*	com.spinal.ioc.plugins.HTMLPlugin Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/plugins/html',
	'ioc/context',
	'util/adt/collection',
	'specs/plugin.spec'], function(HTMLPlugin, Context, Collection, PluginSpec) {

	describe('com.spinal.ioc.plugins.HTMLPlugin', function() {

		before(function() {
			this.plugin = null;
		});

		after(function() {
			delete this.plugin;
		});

		describe('#new()', function() {

			it('Should return an instance of HTMLPlugin', function() {
				this.plugin = new HTMLPlugin({ engine: Context.engine, config: PluginSpec.$plugins.html });
				expect(this.plugin).to.be.a(HTMLPlugin);
				expect(this.plugin.packages).to.be.a(Collection);
				expect(this.plugin.packages.size()).to.be(2);
			});

			it('Should throw an error: Engine is not specified or no constructor arguments are passed', function() {
				// Engine not specified
				expect(function() {
					new HTMLPlugin({ config: PluginSpec.$plugins.html });
				}).to.throwException(function(e) {
					expect(e.message).to.be('IoCPlugin requires an instance of a com.spinal.ioc.engine.Engine in order to work.');
				});

				// No constructor arguments are passed
				expect(function() {
					new HTMLPlugin();
				}).to.throwException(function(e) {
					expect(e.message).to.be('IoCPlugin requires an instance of a com.spinal.ioc.engine.Engine in order to work.');
				});
			});

		});

		describe('#validate()', function() {

		});

		describe('#getLazyPackages()', function() {

		});

		describe('#getPackageFullPath()', function() {

		});

		describe('#parsePath()', function() {

		});

		describe('#lazy()', function() {

		});

		describe('#load()', function() {

		});

		describe('#onLoad()', function() {

		});

		describe('#onLoadComplete()', function() {

		});

		describe('#query()', function() {

		});

		describe('#html()', function() {

		});

		describe('#run()', function() {

		});

	});

});
