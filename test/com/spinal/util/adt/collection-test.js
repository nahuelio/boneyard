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
                expect(this.testInterface.get(1)).to.be.an(Backbone.View);
                expect(this.testInterface.get(1).model).to.be.ok();
                expect(this.testInterface.get(1).model.get('name')).to.be.equal('foo');
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

            it('Should add all the items (No Interface)', function() {
                var added = this.testSimple.reset().addAll([{ name: 'foo'}, { name: 'bar' }]);
                expect(added).to.be.equal(true);
                expect(this.testSimple.size()).to.be.equal(2);
                expect(this.testSimple.get(1).name).to.be.equal('bar');
            });

            it('Should NOT add an empty Array of elements (No Interface)', function() {
                var added = this.testSimple.reset().addAll([]);
                expect(added).to.be.equal(true);
                expect(this.testSimple.size()).to.be.equal(0);
            });

            it('Should add an array with an \'undefined\' value (No Interface)', function() {
                var added = this.testSimple.reset().addAll([undefined]);
                expect(added).to.be.equal(true);
                expect(this.testSimple.size()).to.be.equal(0);
            });

            it('Should add all the items (With Interface)', function() {
                this.testInterface.reset();
                var added = this.testInterface.addAll([
                    { model: new Backbone.Model({ name: 'foo' }) },
                    { model: new Backbone.Model({ name: 'bar' }) }
                ]);
                expect(added).to.be.equal(true);
                expect(this.testInterface.size()).to.be.equal(2);
                expect(this.testInterface.get(1).model.get('name')).to.be.equal('bar');
            });

            it('Should NOT add an empty Array of elements (With Interface)', function() {
                var added = this.testInterface.addAll([undefined]);
                expect(added).to.be.equal(true);
                expect(this.testInterface.size()).to.be.equal(2);
            });

    	});

    	/**
    	*	Collection#contains() test
    	**/
    	describe('#contains()', function() {

            it('Should return true/false if contains (or not) a element (No interface)', function() {
                this.testSimple.reset().addAll([{ name: 'foo' }, { name: 'bar' }, { name: 'zoo' }]);
                var result = this.testSimple.contains({ name: 'bar' });
                expect(result).to.be.equal(true);
                result = this.testSimple.contains({ name: 'non-existent'});
                expect(result).to.be.equal(false);
                result = this.testSimple.contains();
                expect(result).to.be.equal(false);
            });

            it('Should return true/false if contains (or not) a element (With interface)', function() {
                this.testInterface.reset().addAll([
                    { model: new Backbone.Model({ name: 'foo' }) },
                    { model: new Backbone.Model({ name: 'bar' }) }
                ]);
                var result = this.testInterface.contains({ cid: this.testInterface.get(0).cid });
                expect(result).to.be.equal(true);
                result = this.testInterface.contains({ model: new Backbone.Model({ nonexistent: '1' }) });
                expect(result).to.be.equal(false);
            });

    	});

    	/**
    	*	Collection#containsAll() test
    	**/
    	describe('#containsAll()', function() {

            it('Should return true/false if contains (or not) a collection of elements (No Interface)', function() {
                this.testSimple.reset().addAll([{ name: 'foo' }, { name: 'bar' }, { name: 'zoo' }]);
                var result = this.testSimple.containsAll([{ name: 'foo' }, { name: 'zoo' }]);
                expect(result).to.be.equal(true);
                result = this.testSimple.containsAll([{ name: 'foo' }, { name: 'non-existent' }]);
                expect(result).to.be.equal(false);
                result = this.testSimple.containsAll([{ non_existent: 'nothing' }, { name: 'bar' }]);
                expect(result).to.be.equal(false);
                result = this.testSimple.containsAll();
                expect(result).to.be.equal(false);
            });

            it('Should return true/false if contains (or not) a collection of elements (With interface)', function() {
                this.testInterface.reset().addAll([
                    { model: new Backbone.Model({ name: 'foo' }) },
                    { model: new Backbone.Model({ name: 'bar' }) },
                    { model: new Backbone.Model({ name: 'zoo' }) }
                ]);
                var result = this.testInterface.containsAll([
                    { cid: this.testInterface.get(0).cid },
                    { model: this.testInterface.get(1).model }
                ]);
                expect(result).to.be.equal(true);
                result = this.testInterface.containsAll([
                    { model: new Backbone.Model({ name: 'non-existent' }) },
                    { cid: this.testInterface.get(0).cid }
                ]);
                expect(result).to.be.equal(false);
                result = this.testInterface.containsAll();
                expect(result).to.be.equal(false);
            });

    	});

    	/**
    	*	Collection#iterator() test
    	**/
    	describe('#iterator()', function() {

            it('Should return an Iterator Instance from a Collection', function() {
                var testIteratorSimple = this.testSimple.iterator();
                expect(testIteratorSimple.hasNext).to.be.ok();
                expect(testIteratorSimple.toString()).to.be.equal('[object Iterator]');
            });

    	});

    	/**
    	*	Collection#remove() test
    	**/
    	describe('#remove()', function() {

            it('Should remove an element from a collection (No Interface)', function() {
                this.testSimple.reset().addAll([{ name: 'foo' }, { name: 'bar' }, { name: 'zoo' }]);
                var removed = this.testSimple.remove(1);
                expect(removed).to.be.ok();
                expect(removed.name).to.be.equal('bar');
                expect(this.testSimple.size()).to.be.equal(2);
                removed = this.testSimple.remove(3);
                expect(removed).not.be.ok();
                removed = this.testSimple.remove();
                expect(removed).not.be.ok();
                removed = this.testSimple.remove("0");
                expect(removed).not.be.ok();
            });

            it('Should remove an element from a collection (With Interface)', function() {
                this.testInterface.reset().addAll([
                    { model: new Backbone.Model({ name: 'foo' }) },
                    { model: new Backbone.Model({ name: 'bar' }) },
                    { model: new Backbone.Model({ name: 'zoo' }) }
                ]);
                var removed = this.testInterface.remove(2);
                expect(removed).to.be.ok();
                expect(removed.model.get('name')).to.be.equal('zoo');
                expect(removed).to.be.a(Backbone.View);
                expect(this.testInterface.size()).to.be.equal(2);
                removed = this.testInterface.remove(3);
                expect(removed).not.be.ok();
                removed = this.testInterface.remove();
                expect(removed).not.be.ok();
                removed = this.testInterface.remove("0");
                expect(removed).not.be.ok();
            });

    	});

    	/**
    	*	Collection#removeBy() test
    	**/
    	describe('#removeBy()', function() {

            it('Should remove element/s by a function predicate (No Interface)', function() {
                this.testSimple.reset().addAll([
                    { name: 'foo', value: 1 },
                    { name: 'bar', value: 2 },
                    { name: 'zoo', value: 3 }
                ]);
                this.testSimple.off().on(Collection.EVENTS.removed, function(result) {
                    expect(result).to.be.ok();
                    expect(result.removed).to.be.ok();
                    expect(result.collection).to.be.ok();
                }, this);
                var removed = this.testSimple.removeBy(function(ele) {
                    return (ele.value && ele.value > 1);
                });
                expect(removed).to.be.ok();
                expect(removed.length).to.be.equal(2);
                expect(removed[1].value).to.be.equal(3);
                expect(this.testSimple.size()).to.be.equal(1);
                removed = this.testSimple.removeBy(function(ele) {
                    return (ele.value && ele.value === 5);
                });
                expect(this.testSimple.size()).to.be.equal(1);
            });

            it('Should remove element/s by a function predicate (With Interface)', function() {
                this.testInterface.reset().addAll([
                    { model: new Backbone.Model({ name: 'foo' }) },
                    { model: new Backbone.Model({ name: 'bar' }) },
                    { model: new Backbone.Model({ name: 'zoo' }) }
                ]);
                this.testInterface.off().on(Collection.EVENTS.removed, function(result) {
                    expect(result).to.be.ok();
                    expect(result.removed).to.be.ok();
                    expect(result.collection).to.be.ok();
                }, this);
                var removed = this.testInterface.removeBy(function(ele) {
                    return (ele.model && ele.model.get('name') === 'bar');
                });
                expect(removed).to.be.ok();
                expect(removed.length).to.be.equal(1);
                expect(removed[0].model.get('name')).to.be.equal('bar');
                expect(this.testInterface.size()).to.be.equal(2);
                removed = this.testInterface.removeBy(function(ele) {
                    return (ele.model && ele.model.get('name') === 'non-existent');
                });
                expect(this.testInterface.size()).to.be.equal(2);
            });

    	});

    	/**
    	*	Collection#removeAll() test
    	**/
    	describe('#removeAll()', function() {

            it('Should remove all the elements in the collection (No Interface)', function() {

            });

            it('Should remove all the elements in the collection (With Interface)', function() {

            });

    	});

    	/**
    	*	Collection#findBy() test
    	**/
    	describe('#findBy()', function() {

            it('Should find elements by a function predicate (No Interface)', function() {

            });

            it('Should find elements by a function predicate (With Interface)', function() {

            });

    	});

    	/**
    		*	Collection#reset() test
    		**/
    	describe('#reset()', function() {

            it('Should reset the Collection', function() {
                this.testSimple.reset().addAll([{ name: 'foo' }, { name: 'bar' }, { name: 'zoo' }]);
                expect(this.testSimple.collection.length).to.be.equal(3);
                expect(this.testSimple.reset()).to.be.ok();
                expect(this.testSimple.collection.length).to.be.equal(0);
            });

    	});

    	/**
    	*	Collection#isEmpty() test
    	**/
    	describe('#isEmpty()', function() {

            it('Should return true/false if the collection is empty or not', function() {
                this.testSimple.reset();
                expect(this.testSimple.isEmpty()).to.be.equal(true);
                this.testSimple.add({ name: 'foo' });
                expect(this.testSimple.isEmpty()).to.be.equal(false);
            });

    	});

    	/**
    	*	Collection#size() test
    	**/
    	describe('#size()', function() {

            it('Should return the size of the collection', function() {
                this.testSimple.reset();
                expect(this.testSimple.size()).to.be.equal(0);
                this.testSimple.add({ name: 'foo' });
                expect(this.testSimple.size()).to.be.equal(1);
                this.testSimple.addAll([{ name: 'bar' }, { name: 'zoo' }]);
                expect(this.testSimple.size()).to.be.equal(3);
            });

    	});

    	/**
    	*	Collection#sort() test
    	**/
    	describe('#sort()', function() {

            it('Should sort the collection (No Interface)', function() {

            });

            it('Should sort the collection (With Interface)', function() {
                
            });

    	});

    	/**
    	*	Collection#toString() test
    	**/
    	describe('#toString()', function() {

            it('Should return String representation of a Collection instance', function() {
                expect(this.testSimple.toString()).to.be.equal('[object Collection]');
            });

    	});

    });

});
