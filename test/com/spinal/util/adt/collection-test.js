/**
*	com.spinal.util.adt.Collection Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/adt/collection'], function(Collection) {

    describe('com.spinal.util.adt.Collection', function() {

    	/**
    	*	Constructor test
    	**/
    	describe('#new()', function() {

    		it('Should return a com.spinal.util.adt.Collection Instance', function() {
                this.testSimple = new Collection();
                expect(this.testSimple).to.be.ok();
                expect(this.testSimple.collection).to.be.a('array');
    		});

            it('Should return a com.spinal.util.adt.Collection Instance (initial elements)', function() {
                this.testInitial = new Collection([{ name: 'foo' }, { name: 'bar' }]);
                expect(this.testInitial).to.be.ok();
                expect(this.testInitial.size()).to.be.equal(2);
            });

            it('Should return a com.spinal.util.adt.Collection Instance (with interface)', function() {
                this.testInterface = new Collection([], { interface: Backbone.View });
                expect(this.testInterface._interface).to.be.ok();
                expect(this.testInterface).to.be.ok();
                expect(this.testInterface.collection).to.be.a('array');
            });

    	});

    	/**
    	*	Collection#_valid() test
    	**/
    	describe('#_valid()', function() {

    		it('Should return false (element is undefined)', function() {
                expect(this.testSimple._valid()).to.be.equal(false);
            });

    		it('Should return true (Array of Objects)', function() {
                expect(this.testSimple._valid({ name: 'foo' })).to.be.equal(true);
            });

    	});

    	/**
    	*	Collection#set() test
    	**/
    	describe('#set()', function() {

    		it('Should NOT set a new collection (Single Object)', function() {
                var result = this.testSimple.set({ name: 'foo' });
                expect(result).to.be.equal(false);
            });

    		it('Should set a new collection (Array of Objects)', function() {
                var result = this.testSimple.set([{ name: 'zoo' }]);
                expect(result).to.be.equal(true);
                expect(this.testSimple.size()).to.be.equal(1);
            });

            it('Should set a new collection (Array of Objects with interface)', function() {
                var result = this.testInterface.set([{ name: 'zoo' }]);
                expect(result).to.be.equal(true);
                expect(this.testInterface.size()).to.be.equal(1);
            });

            it('Should not set a new collection (undefined object)', function() {
                expect(this.testSimple.set()).to.be.equal(false);
            });

    	});

    	/**
    	*	Collection#get() test
    	**/
    	describe('#get()', function() {

    		it('Should return the element at specific index', function() {
                var ele = this.testSimple.get(0);
                expect(ele).not.be.equal(null);
            });

    		it('Should NOT return the element at specific index', function() {
                var ele = this.testSimple.get(1);
                expect(ele).to.be.equal(null);
            });

    	});

    	/**
    	*	Collection#add() test
    	**/
    	describe('#add()', function() {

    		it('Should add a new element', function() {
                var added = this.testSimple.add({ name: 'foo' });
                expect(added).to.be.ok();
                expect(added.name).to.be.equal('foo');
                expect(this.testSimple.size()).to.be.equal(2);
            });

            it('Should add a new element (with interface)', function() {
                var added = this.testInterface.add({ model: new Backbone.Model({ name: 'foo' }) });
                expect(added).to.be.ok();
                expect(this.testInterface._interface).to.be.ok();
                expect(this.testInterface.get(0)).to.be.an(Backbone.View);
                expect(this.testInterface.get(0).model).to.be.ok();
                expect(this.testInterface.get(0).model.get('name')).to.be.equal('foo');
            });

    		it('Should NOT add a new element', function() {
                var added = this.testSimple.add();
                expect(added).to.be.equal(null);
            });

    	});

    	/**
    	*	Collection#addAll() test
    	**/
    	describe('#addAll()', function() {

    	});

    	/**
    	*	Collection#contains() test
    	**/
    	describe('#contains()', function() {

    	});

    	/**
    	*	Collection#containsAll() test
    	**/
    	describe('#containsAll()', function() {

    	});

    	/**
    	*	Collection#iterator() test
    	**/
    	describe('#iterator()', function() {

    	});

    	/**
    	*	Collection#remove() test
    	**/
    	describe('#remove()', function() {

    	});

    	/**
    	*	Collection#removeBy() test
    	**/
    	describe('#removeBy()', function() {

    	});

    	/**
    	*	Collection#removeAll() test
    	**/
    	describe('#removeAll()', function() {

    	});

    	/**
    	*	Collection#findBy() test
    	**/
    	describe('#findBy()', function() {

    	});

    	/**
    		*	Collection#reset() test
    		**/
    	describe('#reset()', function() {

    	});

    	/**
    	*	Collection#isEmpty() test
    	**/
    	describe('#isEmpty()', function() {

    	});

    	/**
    	*	Collection#size() test
    	**/
    	describe('#size()', function() {

    	});

    	/**
    	*	Collection#sort() test
    	**/
    	describe('#sort()', function() {

    	});

    	/**
    	*	Collection#toString() test
    	**/
    	describe('#toString()', function() {

    	});

    });

});
