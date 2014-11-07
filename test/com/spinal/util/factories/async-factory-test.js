/**
*	com.spinal.util.factories.AsyncFactory Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/factories/async-factory',
		'util/exception/factory',
		'ui/view',
		'mvc/model'], function(AsyncFactory, FactoryException, View, Model) {

	describe('com.spinal.util.factories.AsyncFactory', function() {

		/**
		*	AsyncFactory#new() test
		**/
		describe('#new()', function() {

			it('Should Instanciate AsyncFactory Class', function() {
				this.asyncFactory = new AsyncFactory();
				expect(this.asyncFactory).to.be.ok();
				expect(this.asyncFactory.factories).to.be.ok();
			});

		});

		/**
		*	AsyncFactory#push() test
		**/
		describe('#push()', function() {

			it('Should push a new resource into the factory stack', function() {
				this.asyncFactory.push({ id: 'simple', path: 'specs/simple.spec' });
				this.asyncFactory.push({ id: 'advanced', path: 'specs/advanced.spec' });
				expect(this.asyncFactory.stack.size()).to.be.equal(2);
				// Trying to get a factory that it was loaded (and registered), just present in the stack.
				expect(this.asyncFactory.getFactory('simple')).not.to.be.ok();
			});

			it('Should NOT push a new resource into the factory stack (resource obj with no id or path defined)', function() {
				this.asyncFactory.push(); // nothing
				this.asyncFactory.push({ id: 'bad data' }); // no path
				expect(this.asyncFactory.stack.size()).to.be.equal(2);
			});

		});

		/**
		*	AsyncFactory#reset() test
		**/
		describe('#reset()', function() {

			it('Should reset the factory stack', function() {
				this.asyncFactory.reset();
				expect(this.asyncFactory.stack.size()).to.be.equal(0);
			});

		});

		/**
		*	AsyncFactory#set() test
		**/
		describe('#set()', function() {

			it('Should feed the factory stack with a list of resources', function() {
				// Be aware!! when adding multiple resources with this method 'set':
				// 'simple' is at the 'head' of the stack (not 'advanced') as it should.
 				// So in the future change the impl in the Stack.set method
 				// to follow the order and keep consistency with the ADT structure declaration (LI-FO).
				// Also, Verify that Queue.set works as expected (FI-FO).
				this.asyncFactory.set([
					{ id: 'simple', path: 'specs/simple.spec' }, // should be at the tail
					{ id: 'advanced', path: 'specs/advanced.spec' } // should be at the head
				]);
				expect(this.asyncFactory.stack.size()).to.be.equal(2);
			});

		});

		/**
		*	AsyncFactory#findById() test
		**/
		describe('#findById', function() {

			it('Should retrieve an existing resource by id', function() {
				var resource = this.asyncFactory.findById('simple');
				expect(resource).to.be.ok();
				expect(resource.id).to.be.ok();
				expect(resource.path).to.be.ok();
				expect(resource.id).to.be.equal('simple');
			});

			it('Should NOT retrieve a resource by id (not found)', function() {
				var resource = this.asyncFactory.findById('non-existent');
				expect(resource).not.to.be.ok();
			});

		});

		/**
		*	AsyncFactory#findPos() test
		**/
		describe('#findPos', function() {

			it('Should retrieve the position (0-based) of an existing resource inside the factory stack', function() {
				var resource = this.asyncFactory.findById('advanced');
				var resourcePos = this.asyncFactory.findPos(resource);
				expect(resourcePos).to.be.equal(1);
			});

			it('Should NOT retrieve the position (0-based) if a resource if it doesn\' exists', function() {
				var resourcePos = this.asyncFactory.findPos({ id: 'non-existent', path: 'path/to/resource' });
				expect(resourcePos).to.be.equal(-1);
			});

		});

		/**
		*	AsyncFactory#exists() test
		**/
		describe('#exists', function() {

			it('Should return true on a resource that exists in the stack', function() {
				var resourceExists = this.asyncFactory.exists('simple');
				expect(resourceExists).to.be.a('boolean');
				expect(resourceExists).to.be(true);
			});

			it('Should return false on a resource that doesn\'t exists in the stack', function() {
				var resourceExists = this.asyncFactory.exists('non-existent');
				expect(resourceExists).to.be.a('boolean');
				expect(resourceExists).to.be(false);
			});

		});

		/**
		*	AsyncFactory#remove() test
		**/
		describe('#remove()', function() {

			it('Should remove an existing resource from the stack', function() {
				var resource = this.asyncFactory.findById('advanced');
				this.asyncFactory.remove(resource);
				expect(this.asyncFactory.stack.size()).to.be.equal(1);
			});

			it('Should NOT remove a resource that doesn\'t exists', function() {
				this.asyncFactory.remove({ id: 'non-existent', path: 'path/to/resource' });
				expect(this.asyncFactory.stack.size()).to.be.equal(1);
			});

			it('Should NOT remove a resource that doesn\'t exists (resource null)', function() {
				this.asyncFactory.remove();
				expect(this.asyncFactory.stack.size()).to.be.equal(1);
			});

		});

		/**
		*	AsyncFactory#load() test
		**/
		describe('#load()', function() {

			it('Should load the resources that are currently in the factory stack', function(done) {
				// Add one more
				this.asyncFactory.push({ id: 'advanced', path: 'specs/advanced.spec' });
				// Events Set Up
				this.asyncFactory.off().on(AsyncFactory.EVENTS.prepared, _.bind(function(resources) {
					expect(resources).to.be.ok();
					expect(resources).to.have.length(2);
				}, this)).on(AsyncFactory.EVENTS.loaded, _.bind(function(resources) {
					expect(resources).to.be.ok();
					expect(resources).to.have.length(2);
					expect(this.asyncFactory.stack.size()).to.be.equal(0);
					done();
				}, this));
				var result = this.asyncFactory.load(_.bind(function(id, resource) {
					if(id === 'simple') {
						expect(resource).to.have.property('b');
						expect(resource).to.have.property('s');
						expect(resource).to.have.property('n');
					} else if(id === 'advanced') {
						expect(resource).to.have.property('view1');
						expect(resource).to.have.property('view2');
						expect(resource).to.have.property('subcontent');
					}
				}, this));
				console.log(result);
			});

			it('Should load resources but no callback specified and no events (silent "on")', function() {
				// Add One
				//this.asyncFactory.push({ id: 'simple', path: 'specs/simple.spec' });
				//this.asyncFactory.load(null, { silent: true });
			});

		});

	});

});
