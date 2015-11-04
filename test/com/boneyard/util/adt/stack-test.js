/**
*	com.boneyard.util.adt.Stack Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/boneyard', 'util/adt/stack'], function(Boneyard, Stack) {

	describe('com.boneyard.util.adt.Stack', function() {

		/**
		*	Constructor test
		**/
		describe('#new()', function() {

			it('Should return an com.boneyard.util.adt.Stack Instance', function() {
				this.testSimple = new Stack();
				expect(this.testSimple).to.be.ok();
				expect(this.testSimple.size()).to.be.equal(0);
			});

			it('Should return an com.boneyard.util.adt.Stack (initial elements)', function() {
				this.testSimple = new Stack([{ name: 'foo' }, { name: 'bar' }]);
				expect(this.testSimple).to.be.ok();
				expect(this.testSimple.size()).to.be.equal(2);
			});

			it('Should return an com.boneyard.util.adt.Stack (With interface)', function() {
				this.testInterface = new Stack([], { interface: Boneyard.Class });
				expect(this.testInterface).to.be.ok();
				expect(this.testInterface._interface).not.be.equal(null);
			});

		});

		describe('#_valid()', function() {

			it('Should return false (Element reference null)', function() {
				this.testSimple = new Stack([{ name: 'foo' }]);
				expect(this.testSimple._valid()).to.be.equal(false);
			});

		});

		describe('#push()', function() {

			it('Should push a new element into the Stack (No Interface)', function() {
				this.testSimple = new Stack();
				expect(this.testSimple.push({ name: 'foo' })).to.be.equal(true);
				expect(this.testSimple.size()).to.be.equal(1);
				expect(this.testSimple.push({ name: 'bar'})).to.be.equal(true);
				expect(this.testSimple.size()).to.be.equal(2);
				// Checking LIFO structure
				expect(this.testSimple.get(0).name).to.be.equal('bar');
			});

			it('Should push a new element into the Stack (With Interface)', function() {
				this.testInterface.reset();
				expect(this.testInterface.push({ name: 'foo' })).to.be.equal(true);
				expect(this.testInterface.get(0)).to.be.a(Boneyard.Class);
			});

			it('Should NOT push an element (Element reference null)', function() {
				this.testSimple.reset();
				expect(this.testSimple.push()).to.be.equal(false);
			});

		});

		describe('#peek()', function() {

			it('Should retrieve the head (element) from the stack without removing it', function() {
				this.testSimple = new Stack();
				this.testSimple.push({ name: 'zoo' });
				this.testSimple.push({ name: 'bar' });
				this.testSimple.push({ name: 'foo' });
				var result = this.testSimple.peek();
				expect(result).to.be.ok();
				expect(result.name).to.be.equal('foo');
				expect(this.testSimple.size()).to.be.equal(3);
			});

			it('Should NOT retrieve the head (empty stack)', function() {
				this.testSimple = new Stack();
				expect(this.testSimple.peek()).to.be.equal(null);
			});

		});

		describe('#pop()', function() {

			it('Should retrieve and remove the head (element) from the stack', function() {
				this.testSimple = new Stack();
				this.testSimple.push({ name: 'zoo' });
				this.testSimple.push({ name: 'bar' });
				this.testSimple.push({ name: 'foo' });
				var result = this.testSimple.pop();
				expect(result).to.be.ok();
				expect(result.name).to.be.equal('foo');
				expect(this.testSimple.size()).to.be.equal(2);
			});

			it('Should NOT retrieve and remove the head (element) from the stack', function() {
				this.testSimple = new Stack();
				expect(this.testSimple.pop()).to.be.equal(null);
			});

		});

		describe('#search()', function() {

			it('Should retrieve position 2 (Position found) for an specific element inside the stack', function() {
				this.testSimple = new Stack();
				this.testSimple.push({ name: 'zoo' });
				this.testSimple.push({ name: 'bar' });
				this.testSimple.push({ name: 'foo' });
				var result = this.testSimple.search({ name: 'zoo' });
				expect(result).to.be.ok();
				expect(result).to.be.equal(2); // Remember: It's a LIFO ADT
				expect(this.testSimple.size()).to.be.equal(3);
			});

			it('Should retrieve -1 (Position not found) for an specific element inside the stack', function() {
				this.testSimple = new Stack();
				this.testSimple.push({ name: 'zoo' });
				this.testSimple.push({ name: 'bar' });
				this.testSimple.push({ name: 'foo' });
				var result = this.testSimple.search({ name: 'non-existant' });
				expect(result).to.be.ok();
				expect(result).to.be.equal(-1);
				expect(this.testSimple.size()).to.be.equal(3);
			});

		});

		describe('#toString()', function() {

			it('Should return String representation of a Stack instance', function() {
				expect(this.testSimple.toString()).to.be.equal('[object Stack]');
			});

		});

	});

});
