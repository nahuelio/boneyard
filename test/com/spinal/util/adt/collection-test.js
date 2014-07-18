/**
*	com.spinal.util.adt.Collection Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
        'util/adt/collection',
        'util/adt/iterator'], function(Spinal, Collection, Iterator) {

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
                this.testGeneric = new Collection([
                    { name: 'foo' },
                    { name: 'bar' },
                    { name: 'zoo' }
                ], { interface: Spinal.SpinalClass });
            });

            it('2 Collection instances should have independent \'interfaces\'', function() {
                this.testCol1 = new Collection([], { interface: Backbone.View });
                this.testCol2 = new Collection([], { interface: Spinal.SpinalClass });
                this.testCol1.add({ model: new Backbone.Model({ name: 'foo' }) });
                this.testCol2.add({ name: 'bar' });
                expect(this.testCol1.get(0) instanceof Backbone.View).to.be.equal(true);
                expect(this.testCol2.get(0) instanceof Spinal.SpinalClass).to.be.equal(true);
                expect(this.testCol1._interface).not.be.equal(this.testCol2._interface);
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

            it('Should NOT set a new collection (undefined object with No Interface)', function() {
                expect(this.testSimple.set()).to.be.equal(false);
            });

            it('Should NOT set a new collection (undefined object with Interface)', function() {
                expect(this.testInterface.set()).to.be.equal(false);
                expect(this.testInterface.set([undefined])).to.be.equal(true);
                expect(this.testInterface.size()).to.be.equal(0);
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
                var added = this.testSimple.add({ name: 'foo' }, { silent: true });
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

            it('Should add all the items (No Interface)', function() {
                var added = this.testSimple.reset().addAll([{ name: 'foo'}, { name: 'bar' }], { silent: true });
                expect(added).to.be.equal(true);
                expect(this.testSimple.size()).to.be.equal(2);
                expect(this.testSimple.get(1).name).to.be.equal('bar');
            });

            it('Should NOT add an empty Array of elements (No Interface)', function() {
                var added = this.testSimple.reset().addAll([]);
                expect(added).to.be.equal(true);
                added = this.testSimple.addAll();
                expect(added).to.be.equal(false);
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
                result = this.testSimple.contains({ name: 'non-existent' });
                expect(result).to.be.equal(false);
                result = this.testSimple.contains();
                expect(result).to.be.equal(false);
            });

            it('Should return true/false if contains (or not) a element (With interface)', function() {
                this.testInterface.reset().addAll([
                    { model: new Backbone.Model({ name: 'foo' }) },
                    { model: new Backbone.Model({ name: 'bar' }) }
                ]);
                var result = this.testInterface.contains(this.testInterface.get(0));
                expect(result).to.be.equal(true);
                result = this.testInterface.contains({ model: new Backbone.Model({ nonexistent: '1' }) });
                expect(result).to.be.equal(false);
                // Interface with toJSON method
                result = this.testGeneric.contains({ name: 'bar' });
                expect(result).to.be.equal(true);
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
                var result = this.testInterface.containsAll([this.testInterface.get(0), this.testInterface.get(2)]);
                expect(result).to.be.equal(true);
                result = this.testInterface.containsAll([
                    new Backbone.Model({ name: 'non-existent' }),
                    this.testInterface.get(0)
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
                this.testIteratorSimple = this.testSimple.iterator();
                expect(this.testIteratorSimple.hasNext).to.be.ok();
                expect(this.testIteratorSimple.toString()).to.be.equal('[object Iterator]');
                // check original collection reference.
                this.testIteratorSimple.off().on(Iterator.EVENTS.removed, function(result) {
                    expect(this.testIteratorSimple.collection.length).to.be.equal(2);
                    expect(this.testSimple.collection.length).to.be.equal(3);
                }, this);
                this.testIteratorSimple.remove();
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
                    return (ele.value && ele.value < 3);
                });
                expect(removed).to.be.ok();
                expect(removed.length).to.be.equal(2);
                expect(removed[1].value).to.be.equal(2);
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
                this.testSimple.reset().addAll([
                    { name: 'foo' },
                    { name: 'bar' },
                    { name: 'zoo' }
                ]);
                this.testSimple.off().on(Collection.EVENTS.removedAll, function(result) {
                    expect(result).to.be.ok();
                    expect(result.removed).to.be.ok();
                    expect(result.collection).to.be.ok();
                    expect(result.collection.size()).to.be.equal(1);
                }, this);
                var removed = this.testSimple.removeAll([{ name: 'foo' }, { name: 'zoo' }]);
                expect(removed.length).to.be.equal(2);
                expect(removed[1].name).to.be.equal('zoo');
                expect(this.testSimple.size()).to.be.equal(1);
                removed = this.testSimple.removeAll([{ name: 'non-existant' }]);
                expect(removed.length).to.be.equal(0);
                removed = this.testSimple.removeAll();
                expect(removed.length).to.be.equal(0);
            });

            it('Should remove all the elements in the collection (With Interface)', function() {
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
                var removed = this.testInterface.removeAll([
                    this.testInterface.get(0),
                    this.testInterface.get(2)
                ]);
                expect(removed.length).to.be.equal(2);
                expect(removed[1].model.get('name')).to.be.equal('zoo');
                expect(this.testInterface.size()).to.be.equal(1);
                removed = this.testInterface.removeAll([{ model: new Backbone.Model({ name: 'non-existant'}) }]);
                expect(removed.length).to.be.equal(0);
                removed = this.testInterface.removeAll();
                expect(removed.length).to.be.equal(0);
            });

    	});

        /**
    	*	Collection#findBy() test
    	**/
    	describe('#findBy()', function() {

            it('Should find one element by a function predicate', function() {
                this.testSimple.reset().addAll([
                    { name: 'foo' },
                    { name: 'bar' },
                    { name: 'zoo' }
                ]);
                var result = this.testSimple.find(function(ele) {
                    return (ele.name === 'zoo');
                });
                expect(result).to.be.ok();
                expect(result.name).to.be.equal('zoo');
            });

            it('Should NOT find one element by a function predicate (finder is undefined or not a function)', function() {
                this.testSimple.reset().addAll([
                    { name: 'foo' },
                    { name: 'bar' },
                    { name: 'zoo' }
                ]);
                var result = this.testSimple.find();
                expect(result).not.be.ok();
                result = this.testSimple.find({ name: 'bar' });
                expect(result).not.be.ok();
            });

        });

    	/**
    	*	Collection#findBy() test
    	**/
    	describe('#findBy()', function() {

            it('Should find elements by a function predicate (No Interface)', function() {
                this.testSimple.reset().addAll([
                    { name: 'foo' },
                    { name: 'bar' },
                    { name: 'zoo' }
                ]);
                var result = this.testSimple.findBy(function(ele) {
                    return (ele.name && /(?=oo)/g.test(ele.name));
                });
                expect(result).to.be.ok();
                expect(result.length).to.be.equal(2);
                expect(result[1].name).to.be.equal('zoo');
            });

            it('Should find elements by a function predicate (With Interface)', function() {
                this.testInterface.reset().addAll([
                    { model: new Backbone.Model({ name: 'foo' }) },
                    { model: new Backbone.Model({ name: 'bar' }) },
                    { model: new Backbone.Model({ name: 'zoo' }) }
                ]);
                var result = this.testInterface.findBy(function(ele) {
                    return (ele.model && /(?=oo)/g.test(ele.model.get('name')));
                });
                expect(result).to.be.ok();
                expect(result.length).to.be.equal(2);
                expect(result[1].model.get('name')).to.be.equal('zoo');
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

            it('Should sort the collection', function() {
                // standard sort
                this.testSimple.reset().addAll(['z', 'a', 'd', 'w']);
                this.testSimple.sort();
                expect(this.testSimple.get(0)).to.be.equal('a');
                expect(this.testSimple.get(this.testSimple.size()-1)).to.be.equal('z');
                // with comparator function
                this.testSimple.reset().addAll([
                    { v: 100 },
                    { v: 1 },
                    { v: 50 },
                    { v: 25 }
                ]);
                this.testSimple.sort(function(a, b) {
                    return (a.v && b.v) ? (a.v-b.v) : 0;
                });
                expect(this.testSimple.get(0).v).to.be.equal(1);
                expect(this.testSimple.get(this.testSimple.size()-1).v).to.be.equal(100);
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
