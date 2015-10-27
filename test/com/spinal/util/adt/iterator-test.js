/**
*	com.spinal.util.adt.Iterator Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal', 'util/adt/iterator'], function(Spinal, Iterator) {

	describe('com.spinal.util.adt.Iterator', function() {

		describe('#new()', function() {

			it('Should return a com.spinal.util.adt.Iterator Instance (Empty)', function() {
				this.testSimple = new Iterator();
				expect(this.testSimple).to.be.ok();

				this.testSimple = new Iterator([]);
				expect(this.testSimple).to.be.ok();
			});

			it('Should return a com.spinal.util.adt.Iterator Instance (Initial)', function() {
				this.testSimple = new Iterator([{ name: 'foo' }, { name: 'bar' }]);
				expect(this.testSimple).to.be.ok();
				expect(this.testSimple.collection.length).to.be.equal(2);
			});

		});

		describe('#set()', function() {

			it('Should set a new iterator collection', function() {
				this.testSimple = new Iterator();
				var result = this.testSimple.set([1,2,3]);
				expect(result).to.be.an(Iterator);
				expect(result.size()).to.be(3);
			});

			it('Should throw an error: param to set is not an array', function() {
				expect(_.bind(function() {
					this.testSimple.set({ key: 'not allowed' });
				}, this)).to.throwException(_.bind(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be(this.testSimple.toString() + ' requires an array in order to be instanciate it.');
				}, this));
			});

		});

		describe('#hasNext()', function() {

			it('Should return true/false', function() {
				this.testSimple = new Iterator([{ name: 'foo' }, { name: 'zoo' }]);
				expect(this.testSimple.hasNext()).to.be.equal(true);
				expect(this.testSimple._cur).to.be.equal(0);
				while(this.testSimple.hasNext()) {
					expect(this.testSimple.next()).to.be.ok();
				}
				expect(this.testSimple.hasNext()).to.be.equal(false);
			});

		});

		describe('#next()', function() {

			it('Should return an object for every next() operation', function() {
				this.testSimple = new Iterator([{ name: 'foo' }, { name: 'zoo' }, { name: 'aoo' }]);
				while(this.testSimple.hasNext()) {
					var result = this.testSimple.next();
					expect(result).to.be.ok();
					expect(result.name).to.be.a('string');
					expect(result.name).to.contain('oo');
				}
				expect(this.testSimple.next()).to.be.equal(null);
				expect(this.testSimple._cur).to.be.equal(3);
			});

		});

		describe('#rewind()', function() {

			it('Should rewind the iterator internal cursor to 0', function() {
				expect(this.testSimple.hasNext()).to.be.equal(false);
				expect(this.testSimple._cur).to.be.equal(3);
				expect(this.testSimple.rewind()).to.be.a(Iterator);
				expect(this.testSimple.hasNext()).to.be.equal(true);
				expect(this.testSimple._cur).to.be.equal(0);
			});

		});

		describe('#remove()', function() {

			it('Should remove the element at the current internal cursor position', function() {
				while(this.testSimple.hasNext()) {
					var result = this.testSimple.remove();
					expect(result).to.be.ok();
					expect(result.name).to.contain('oo');
				}
				expect(this.testSimple.collection.length).to.be.equal(0);
				expect(this.testSimple._cur).to.be.equal(0);
			});

			it('Should NOT remove the element at the current internal cursor position', function() {
				this.testSimple = new Iterator([]);
				expect(this.testSimple.remove()).not.be.ok();
			});

		});

		describe('#isEmpty()', function() {

			it('Should return true, iterator is empty', function() {
				this.testSimple = new Iterator([]);
				expect(this.testSimple.isEmpty()).to.be(true);
			});

			it('Should return false, iterator is not empty', function() {
				this.testSimple = new Iterator([1,2,3]);
				expect(this.testSimple.isEmpty()).to.be(false);
			});

		});

	});

});
