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
				expect(this.plugin.packages.size()).to.be(4);
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
				expect(result).to.have.length(2);
				expect(result[0]).to.be.a('string');
				expect(result[0]).to.be('account');
			});

		});

		describe('#getPackageFullPath()', function() {

			it('Should return package full path to the file', function() {
				var result = this.plugin.getPackageFullPath({ path: 'html/cart.json' });
				expect(result).to.be.a('string');
				expect(result).to.be('text!/base/test/com/spinal/ioc/html/cart.json');
			});

		});

		describe('#parsePackage()', function() {

			it('Should return package suitable for factory enqueueing', function() {
				var getPackageStub = sinon.stub(this.plugin, 'getPackage')
					.withArgs('cart')
					.returns({ name: 'cart', path: 'html/cart.json' });
				var result = this.plugin.parsePackage('cart');
				expect(result).to.be.a('object');
				expect(result.path).to.be('text!/base/test/com/spinal/ioc/html/cart.json');
				expect(result.callback).to.be.a('function');

				this.plugin.getPackage.restore();
			});

		});

		describe('#lazy()', function() {

			it('Should fire plugin load method with packages flagged for lazy loading', function() {
				var loadStub = sinon.stub(this.plugin, 'load')
					.withArgs(['account', 'cart'])
					.returns(this.plugin);
				expect(this.plugin.lazy()).to.be.a(HTMLPlugin);
				this.plugin.load.restore();
			});

			it('Should not fire plugin load method with packages flagged for lazy loading (no packages flagged)', function() {
				var loadStub = sinon.stub(this.plugin, 'load')
					.withArgs([])
					.returns(this.plugin);
				var getLazyPackagesStub = sinon.stub(this.plugin, 'getLazyPackages').returns([]);
				var doneSpy = sinon.spy(this.plugin, 'done');

				expect(this.plugin.lazy()).to.be.a(HTMLPlugin);
				expect(doneSpy.called).to.be(true);

				this.plugin.getLazyPackages.restore();
				this.plugin.load.restore();
				this.plugin.done.restore();
			});

		});

		describe('#load()', function() {

			it('Should load a list of valid packages', function(done) {
				var getPackageFullPathStub = sinon.stub(this.plugin, 'getPackageFullPath')
					.returns('text!/base/test/com/spinal/ioc/html/checkout.json');

				var result = this.plugin.load(['checkout'], _.bind(function(packages) {
					expect(packages).to.be.an('array');
					expect(packages).to.have.length(1);
					expect(Spinal.__html__.checkout.payment).to.be.ok();
					expect(Spinal.__html__.checkout.payment.creditcard).to.be.a('string');
					done();
				}, this));

				expect(result).to.be.a(HTMLPlugin);
				this.plugin.getPackageFullPath.restore();
			});

			it('Should load a list of valid packages (with no callback)', function(done) {
				var pluginEvent = Context.engine.constructor.EVENTS.plugin;
				var getPackageFullPathStub = sinon.stub(this.plugin, 'getPackageFullPath')
					.returns('text!/base/test/com/spinal/ioc/html/product.json');

				this.plugin.getEngine().on(pluginEvent, _.bind(function() { done(); }, this));

				var result = this.plugin.load(['product']);
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
				var result = this.plugin.html('checkout.information.address', { address: 'myaddress' });
				expect(result).to.be.a('string');
				expect($(result).text()).to.be('myaddress');
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
