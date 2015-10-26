/**
*	com.spinal.util.adt.Queue Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal', 'util/adt/queue'], function(Spinal, Queue) {

	describe('com.spinal.util.adt.Queue', function() {

		describe('#new()', function() {

			it('Should return an com.spinal.util.adt.Queue Instance', function() {
				this.testSimple = new Queue([], { capacity: 3 });
				expect(this.testSimple).to.be.ok();
				expect(this.testSimple.capacity).to.be.equal(3);
				expect(this.testSimple.size()).to.be.equal(0);
			});

			it('Should return an com.spinal.util.adt.Queue (initial elements)', function() {
				this.testSimple = new Queue([{ name: 'foo' }, { name: 'bar' }], { capacity: 3 });
				expect(this.testSimple).to.be.ok();
				expect(this.testSimple.capacity).to.be.equal(3);
				expect(this.testSimple.size()).to.be.equal(2);
			});

			it('Should return an com.spinal.util.adt.Queue (With interface)', function() {
				this.testInterface = new Queue([], { capacity: 2, interface: Spinal.SpinalClass });
				expect(this.testInterface).to.be.ok();
				expect(this.testInterface._interface).not.be.equal(null);
			});

			it('Should throw an Error: instanciating Queue with no capacity specified ', function() {
				expect(function() {
					new Queue([]);
				}).to.throwException(function(e) {
					expect(e).to.be.a(Error);
					expect(e.message).to.be.equal('Queue requires a \'capacity\' property in order to be instanciate it.');
				});
			});

			it('Should throw an Error: instanciating Queue with initial that overpasses capacity', function() {
				expect(function() {
					new Queue([{ name: 'foo' }, { name: 'bar' }], { capacity: 1 });
				}).to.throwException(function(e) {
					expect(e).to.be.a(Error);
					expect(e.message).to.be.equal('Queue element\'s collection passed overflows the current capacity [1].');
				});
			});

		});

		describe('#set()', function() {

			it('Should throw an Error: set new elements for the queue without capacity', function() {
				expect(function() {
					var testSet = new Queue([], { capacity: 1 });
					testSet.set([1]);
				}).to.throwException(function(e) {
					expect(e).to.be.a(Error);
					expect(e.message).to.be.equal('Queue requires a \'capacity\' property in order to be instanciate it.');
				});
			});

		});

		describe('#_valid()', function() {

			it('Should return false (capacity excedded)', function() {
				this.testSimple = new Queue([{ name: 'foo' }], { capacity: 1});
				expect(this.testSimple._valid({ name: 'bar' })).to.be.equal(false);
			});

		});

		describe('#offer()', function() {

			it('Should insert element without violating capacity restrictions (No Interface)', function() {
				this.testSimple = new Queue([], { capacity: 2 });
				expect(this.testSimple.offer({ name: 'foo' })).to.be.equal(true);
				expect(this.testSimple.size()).to.be.equal(1);
				expect(this.testSimple.offer({ name: 'bar'})).to.be.equal(true);
				expect(this.testSimple.size()).to.be.equal(2);
				// Checking FIFO structure
				expect(this.testSimple.get(1).name).to.be.equal('bar');
			});

			it('Should insert element without violating capacity restrictions (With Interface)', function() {
				this.testInterface.reset();
				expect(this.testInterface.offer({ name: 'foo' })).to.be.equal(true);
				expect(this.testInterface.get(0)).to.be.a(Spinal.SpinalClass);
			});

			it('Should NOT insert element (Element reference null)', function() {
				this.testSimple.reset();
				expect(this.testSimple.offer()).to.be.equal(false);
			});

		});

		describe('#peek()', function() {

			it('Should retrieve the head (element) from the queue without removing it', function() {
				this.testSimple = new Queue([], { capacity: 4 });
				this.testSimple.offer({ name: 'zoo' });
				this.testSimple.offer({ name: 'bar' });
				this.testSimple.offer({ name: 'foo' });
				var result = this.testSimple.peek();
				expect(result).to.be.ok();
				expect(result.name).to.be.equal('zoo');
				expect(this.testSimple.size()).to.be.equal(3);
			});

			it('Should NOT retrieve the head (empty queue)', function() {
				this.testSimple = new Queue([], { capacity: 1 });
				expect(this.testSimple.peek()).to.be.equal(null);
			});

		});

		describe('#poll()', function() {

			it('Should retrieve and remove the head (element) from the queue', function() {
				this.testSimple = new Queue([], { capacity: 3 });
				this.testSimple.offer({ name: 'zoo' });
				this.testSimple.offer({ name: 'bar' });
				this.testSimple.offer({ name: 'foo' });
				var result = this.testSimple.poll();
				expect(result).to.be.ok();
				expect(result.name).to.be.equal('zoo');
				expect(this.testSimple.size()).to.be.equal(2);
			});

			it('Should NOT retrieve and remove the head (element) from the queue', function() {
				this.testSimple = new Queue([], { capacity: 1 });
				expect(this.testSimple.poll()).to.be.equal(null);
			});

		});

		describe('#toString()', function() {

			it('Should return String representation of a Queue instance', function() {
				expect(this.testSimple.toString()).to.be.equal('[object Queue]');
			});

		});

	});

});
