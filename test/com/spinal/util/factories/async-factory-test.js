/**
*	com.spinal.util.factories.AsyncFactory Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/factories/async-factory',
		'util/exception/factory',
		'ui/view',
		'util/schema'], function(AsyncFactory, FactoryException, View, Model) {

	describe('com.spinal.util.factories.AsyncFactory', function() {

		describe('#new()', function() {

			it('Should Instanciate AsyncFactory Class', function() {
				this.asyncFactory = new AsyncFactory();
				expect(this.asyncFactory).to.be.ok();
				expect(this.asyncFactory.resources).to.be.ok();
				expect(this.asyncFactory.factories).to.be.ok();
			});

		});

		describe('#set()', function() {

			it('Should return false if parameter is not defined or is not an array', function() {
				var result = this.asyncFactory.set();
				expect(result).to.be(false);

				result = this.asyncFactory.set({});
				expect(result).to.be(false);
			});

		});

		describe('#push()', function() {

			it('Should push a new resource into the factory resource collection', function() {
				this.asyncFactory.push({ path: 'specs/ioc.spec' });
				this.asyncFactory.push({ path: 'specs/plugin.spec' });
				expect(this.asyncFactory.resources.size()).to.be.equal(2);
				// Trying to get a factory that it wasn't loaded (and registered) yet,
				// just present in the resource collection.
				expect(this.asyncFactory.getFactory('specs/ioc.spec')).not.to.be.ok();
			});

			it('Should NOT push a new resource into the factory resource collection (resource obj with no path specified)', function() {
				this.asyncFactory.push(); // nothing
				this.asyncFactory.push({}); // no path as a minimum requirement
				expect(this.asyncFactory.resources.size()).to.be.equal(2);
			});

		});

		describe('#set()', function() {

			it('Should feed the factory resource collection with a list of resources', function() {
				this.asyncFactory.set([
					{ path: 'specs/ioc.spec' },
					{ path: 'specs/plugin.spec' }
				]);
				expect(this.asyncFactory.resources.size()).to.be.equal(2);
			});

		});

		describe('#findByPath', function() {

			it('Should retrieve an existing resource by path', function() {
				var resource = this.asyncFactory.findByPath('specs/ioc.spec');
				expect(resource).to.be.ok();
				expect(resource.path).to.be.ok();
				expect(resource.path).to.be.equal('specs/ioc.spec');
			});

			it('Should NOT retrieve a resource by id (not found)', function() {
				var resource = this.asyncFactory.findByPath('non-existent');
				expect(resource).not.to.be.ok();
			});

		});

		describe('#findPosBy', function() {

			it('Should retrieve the position (0-based) of an existing resource inside the factory resource collection', function() {
				var resourcePos = this.asyncFactory.findPosBy(function(resource) { return (resource.path === 'specs/plugin.spec') });
				expect(resourcePos).to.be.equal(1);
			});

			it('Should NOT retrieve the position (0-based) if a resource if it doesn\' exists', function() {
				var resourcePos = this.asyncFactory.findPosBy(function(resource) { return (resource.path === 'non-existent'); });
				expect(resourcePos).to.be.equal(-1);
			});

		});

		describe('#exists', function() {

			it('Should return true on a resource that exists in the stack', function() {
				var resourceExists = this.asyncFactory.exists('specs/ioc.spec');
				expect(resourceExists).to.be.a('boolean');
				expect(resourceExists).to.be(true);
			});

			it('Should return false on a resource that doesn\'t exists in the stack', function() {
				var resourceExists = this.asyncFactory.exists('non-existent');
				expect(resourceExists).to.be.a('boolean');
				expect(resourceExists).to.be(false);
			});

		});

		describe('#remove()', function() {

			it('Should remove an existing resource from the stack', function() {
				this.asyncFactory.remove(1); // Removes advanced resource
				expect(this.asyncFactory.resources.size()).to.be.equal(1);
			});

			it('Should NOT remove a resource that doesn\'t exists', function() {
				this.asyncFactory.remove({ path: 'path/to/resource' });
				expect(this.asyncFactory.resources.size()).to.be.equal(1);
			});

			it('Should NOT remove a resource that doesn\'t exists (resource null)', function() {
				this.asyncFactory.remove();
				expect(this.asyncFactory.resources.size()).to.be.equal(1);
			});

		});

		describe('#load()', function() {

			it('Should load the resources that are currently in the factory stack', function(done) {
				this.asyncFactory.resources.reset();
				// mycallback
				var mycallback = _.bind(function(path, resource) {
					expect(path).to.be.ok();
					expect(path).to.be('ui/view');
					expect(resource).to.be.ok();
					expect(resource).to.be(View);
					expect(this.asyncFactory.create(path)).to.be.ok();
				}, this);
				// Add one more but with callback
				this.asyncFactory.push({ path: 'ui/view', callback: mycallback })
					.push({ path: 'util/schema' });
				// Events Set Up
				this.asyncFactory.off().on(AsyncFactory.EVENTS.prepared, _.bind(function(resources) {
					expect(resources).to.be.ok();
					expect(resources).to.have.length(2);
				}, this)).on(AsyncFactory.EVENTS.loaded, _.bind(function(resources) {
					expect(resources).to.be.ok();
					expect(resources).to.have.length(2);
					expect(this.asyncFactory.resources.size()).to.be.equal(0);
					done();
				}, this));
				var result = this.asyncFactory.load(_.bind(function(resources) {
					expect(resources).to.be.ok();
					expect(resources).to.have.length(2);
				}, this));
			});

			it('Should load resources in subsequent calls to load (through callback chaining)', function(done) {
				delete this.asyncFactory;
				this.asyncFactory = new AsyncFactory();
				this.asyncFactory.push({ path: 'ui/view' });
				this.asyncFactory.load(_.bind(function() {
					expect(this.asyncFactory.isRegistered('ui/view')).to.be(true);
					this.asyncFactory.push({ path: 'ui/container' });
					this.asyncFactory.load(_.bind(function() {
						expect(this.asyncFactory.isRegistered('ui/container')).to.be(true);
						done();
					}, this));
				}, this));
			});

			it('Should Failed to load unexisting resources on the factory stack', function(done) {
				this.asyncFactory.off().on(AsyncFactory.EVENTS.failed, _.bind(function(err) {
					expect(err).to.be.ok();
					expect(err.message).to.be.ok();
					done();
				}, this));
				this.asyncFactory.resources.reset();
				this.asyncFactory.push({ path: '/nonexisting/resource' });
				this.asyncFactory.load();
			});

			it('Should NOT load resources when stack is empty', function() {
				this.asyncFactory.off();
				this.asyncFactory.resources.reset();
				this.asyncFactory.load(null);
			});

			it('Should load resources but no callback specified and no events (silent "on")', function() {
				this.asyncFactory.resources.reset();
				this.asyncFactory.push({ path: 'specs/ioc.spec' });
				this.asyncFactory.load(null, { silent: true });
			});

		});

	});

});
