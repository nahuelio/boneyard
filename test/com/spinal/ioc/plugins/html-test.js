/**
*	com.spinal.ioc.plugins.HTMLPlugin Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/plugins/html',
	'ioc/context',
	'util/adt/collection',
	'specs/plugin.spec'], function(HTMLPlugin, Context, Collection, PluginSpec) {

	describe.only('com.spinal.ioc.plugins.HTMLPlugin', function() {

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

			it('Should return false: packageNames is undefined', function() {
				expect(this.plugin.validate()).to.be(false);
			});

			it('Should return false: packageNames is not an array', function() {
				expect(this.plugin.validate({})).to.be(false);
			});

			it('Should return false: at least one package name insdie packageNames is undefined or null', function() {
				expect(this.plugin.validate(['html/mypackage', undefined])).to.be(false);
				expect(this.plugin.validate(['html/mypackage', null])).to.be(false);
			});

			it('Should return false: path to package was not found or package was previously loaded and registered',
				function() {
				expect(this.plugin.validate(['nonExistent'])).to.be(false);

				var isRegisteredStub = sinon.stub(this.plugin.getFactory(), 'isRegistered').returns(true);
				expect(this.plugin.validate(['cart'])).to.be(false);
				this.plugin.getFactory().isRegistered.restore();
			});

			it('Should return true: package names exists and there were not loaded previously', function() {
				var isRegisteredStub = sinon.stub(this.plugin.getFactory(), 'isRegistered').returns(false);
				expect(this.plugin.validate(['cart'])).to.be(true);
				this.plugin.getFactory().isRegistered.restore();
			});

		});

		describe('#getLazyPackages()', function() {

			it('Should return an array with packages flagged for lazy loading.', function() {
				var result = this.plugin.getLazyPackages();
				expect(result).to.be.a('array');
				expect(result).to.have.length(1);
				expect(result[0]).to.be.a('string');
			});

		});

		describe('#getPackageFullPath()', function() {

			it('Should return package full path to the file', function() {
				var givenPackage = this.plugin.getPackage('cart');
				var result = this.plugin.getPackageFullPath(givenPackage);
				expect(result).to.be.a('string');
				expect(result).to.be(this.plugin.getConfig().basePath + givenPackage.path);
			});

		});

		describe('#parsePackage()', function() {

			it('Should return package suitable for factory enqueueing', function() {
				var givenPackage = this.plugin.getPackage('cart');
				var result = this.plugin.parsePackage('cart');
				expect(result).to.be.a('object');
				expect(result.path).to.be(this.plugin.getConfig().basePath + givenPackage.path);
				expect(result.callback).to.be.a('function');
			});

		});

		describe('#lazy()', function() {

			it('Should fire plugin load method with packages flagged for lazy loading', function() {
				var loadStub = sinon.stub(this.plugin, 'load')
					.withArgs(['account'])
					.returns(this.plugin);
				expect(this.plugin.lazy()).to.be.a(HTMLPlugin);
				this.plugin.load.restore();
			});

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
