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
				expect(this.plugin.packages.size()).to.be(3);
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
				expect(result[0]).to.be('account');
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

			it('Should load a list of valid packages', function(done) {
				var basePath = this.plugin.getConfig().basePath;
				var getPackageFullPathStub = sinon.stub(this.plugin, 'getPackageFullPath')
					.onFirstCall().returns(basePath + '/html/cart.json')
					.onSecondCall().returns(basePath + '/html/checkout.json');

				var result = this.plugin.load(['cart', 'checkout'], _.bind(function(packages) {
					expect(packages).to.be.an('array');
					expect(packages).to.have.length(2);
					expect(Spinal.html.checkout.payment).to.be.ok();
					expect(Spinal.html.cart.cartitem).to.be.a('string');
					done();
				}, this));

				expect(result).to.be.a(HTMLPlugin);
				this.plugin.getPackageFullPath.restore();
			});

			it('Should load a list of valid packages (with no callback)', function(done) {
				var basePath = this.plugin.getConfig().basePath;
				var pluginActionEvent = Context.engine.constructor.EVENTS.pluginAction;
				var getPackageFullPathStub = sinon.stub(this.plugin, 'getPackageFullPath')
					.returns(basePath + '/html/account.json');

				this.plugin.getEngine().on(pluginActionEvent, _.bind(function() {
					this.plugin.getEngine().off(pluginActionEvent);
					done();
				}, this));

				var result = this.plugin.load(['account']);
				expect(result).to.be.a(HTMLPlugin);
			});

			it('Should not load packages (some are invalid)', function() {
				expect(this.plugin.load(['non-existent', 'checkout'])).to.be.a(HTMLPlugin);
			});

		});

		describe('#query()', function() {

			it('Should return a template', function() {
				expect(this.plugin.query('cart.cartitem')).to.be.a('string');
			});

			it('Should return null: template not found', function() {
				expect(this.plugin.query('cart.nonExistent')).not.be.ok();
			});

			it('Should return null: query not specified', function() {
				expect(this.plugin.query()).not.be.ok();
			});

		});

		describe('#html()', function() {

			it('Should outputs the result of projecting parameters into a given template', function() {
				var result = this.plugin.html('cart.cartitem', { cls: 'mycartitem', name: '1' });
				expect(result).to.be.a('string');
				expect($(result).hasClass('mycartitem')).to.be(true);
			});

			it('Should outputs the template (without parameter)', function() {
				var result = this.plugin.html('checkout.payment.creditcard');
				expect(result).to.be.a('string');
				expect($(result).hasClass('creditcard')).to.be(true);
			});

			it('Should return an empty string: template not found', function() {
				var result = this.plugin.html('im.not.exists');
				expect(result).to.be.a('string');
				expect(result).to.be.empty();
			});

		});

		describe('#run()', function() {

			it('Should executes plugin logic', function() {
				var lazyStub = sinon.stub(this.plugin, 'lazy').returns(this.plugin);
				expect(this.plugin.run()).to.be.a(HTMLPlugin);
				expect(Spinal.load).to.be.a('function');
				expect(Spinal.html).to.be.a('function');
				this.plugin.lazy.restore();
			});

		});

	});

});
