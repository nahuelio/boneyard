/**
*	Boneyard Core Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/boneyard'], function(Boneyard) {

	describe('com.boneyard.core.Boneyard', function() {

		before(function() {
			this.ds = { _string: 'string' };
			this.dn = { _number: 1 };
			this.db = { _boolean: true };
			this.du = { _undefined: undefined };
			this.dl = { _null: null };
			this.do = { _object: { _string: 'string', _function: function() { console.log('parent.func()', this._string); }} };
			this.da = { _array: ['a', 1, true, undefined, null, { _string: 'a-string' }, function() { var t = 'local'; console.log('parent.func()', local); }] };
			this.dd = { _date: new Date() };
			this.df = { _string: 'test', _function: function() { return { _string: this._string }; } };
		});

		describe('#namespace()', function() {

			it('Should namespace a class definition', function() {
				Boneyard.namespace('com.boneyard.ui.View', function() {});
				expect(Boneyard.com).to.be.ok();
				expect(Boneyard.com.boneyard).to.be.ok();
				expect(Boneyard.com.boneyard.ui).to.be.ok();
				expect(Boneyard.com.boneyard.ui.View).to.be.ok();
			});

			it('Should throw an Error: path is not defined, path is not a string, constructor undefined', function() {
				// Path not defined
				expect(function() {
					Boneyard.namespace();
				}).to.throwException(function(e) {
					expect(e.message).to.be('Boneyard.namespace requires a namespace (in dot notation) and a function (or object)');
				});

				// Path not a String
				expect(function() {
					Boneyard.namespace(true);
				}).to.throwException(function(e) {
					expect(e.message).to.be('Boneyard.namespace requires a namespace (in dot notation) and a function (or object)');
				});

				// Constructor not defined
				expect(function() {
					Boneyard.namespace('com.boneyard.mynamespace');
				}).to.throwException(function(e) {
					expect(e.message).to.be('Boneyard.namespace requires a namespace (in dot notation) and a function (or object)');
				});
			});

		});

		/**
		*	Third Party Libraries Verification
		**/
		describe('#Availability of Third Party Libs (Underscore, Backbone)', function() {
			it('Should be available on the global namespace', function() {
				expect(_).to.be.ok();
				expect(Backbone).to.be.ok();
			});
		});

		/**
		*	Boneyard Deep Copy strategy
		**/
		describe('#_extend()', function() {

			it('Should return a deep copy of an object (1 on 1)', function() {
				var c = Boneyard.extend({ _string: 'child_string' }, this.ds);
				expect(c).to.be.ok();
			});

			it('Should return a deep copy of an object (multiple to 1)', function() {
				var c = Boneyard.extend({ _string: 'child_string', _number: 2 }, this.ds, this.dn);
				expect(c).to.be.ok();
				expect(c._string).to.be.equal('child_string');
				expect(c._number).to.be.equal(2);
				expect(this.ds._string).to.be.ok();
				expect(this.dn._number).to.be.ok();
				expect(this.ds._string).to.be.equal('string');
				expect(this.dn._number).to.be.equal(1);
			});

			// String Type
			it('Should return a deep copy of an object having a String', function() {
				var c = Boneyard.extend({ _string: 'child_string' }, this.ds);
				expect(c._string).not.to.equal(this.ds._string);
			});

			// Number Type
			it('Should return a deep copy of an object having a Number', function() {
				var c = Boneyard.extend({ _number: 1.10 }, this.dn);
				expect(c._number).not.to.equal(this.dn._number);
			});

			// Boolean Type
			it('Should return a deep copy of an object having a Boolean', function() {
				var c = Boneyard.extend({ _boolean: false }, this.db);
				expect(c._boolean).to.be(false);
				expect(this.db._boolean).to.be(true);
			});

			// Undefined Type
			it('Should return a deep copy of an object having a Undefined', function() {
				var c = Boneyard.extend({ _undefined: 'notUndefined' }, this.du);
				expect(c._undefined).not.to.equal(this.du._undefined);
				expect(c._undefined).to.be.equal('notUndefined');
			});

			// Null Type
			it('Should return a deep copy of an object having a Null', function() {
				var c = Boneyard.extend({ _null: 'notNull' }, this.dnl);
				expect(c._null).not.to.equal(this.du._null);
				expect(c._null).to.be.equal('notNull');
			});

			// Object Type
			it('Should return a deep copy of an object having a Object', function() {
				var c = Boneyard.extend({ _object: { _string: 'myString', _function: function() { console.log('child.func()', this._string); } }}, this.do);
				expect(c._object).to.be.ok();
				expect(c._object._string).to.be.ok();
				expect(c._object._string).to.be.equal('myString');
				expect(this.do._object._string).not.be.equal(c._object._string);
			});

			// Array Type
			it('Should return a deep copy of an object having a Array', function() {
				var c = Boneyard.extend({ _array: [2, { _string: 'myString' }] }, this.da);
				expect(c._array).to.be.ok();
				expect(c._array[1]).to.be.ok();
				expect(c._array.length).not.be.equal(this.da._array.length);
				expect(c._array[0]).not.be.equal(this.da._array[0]);
			});

			// Date Type
			it('Should return a deep copy of an object having a Date', function() {
				var c = Boneyard.extend({ _date: new Date('2014-02-22T23:43:51.223Z') }, this.dd);
				expect(c._date).to.be.ok();
				expect(c._date.toISOString()).to.be.equal('2014-02-22T23:43:51.223Z');
				expect(c._date.toISOString()).not.be.equal(this.dd._date.toISOString());
			});

			// Function Type
			it('Should return a deep copy of an object having a Function', function() {
				var c = Boneyard.extend({
					_prop: 1,
					_function: function() { var ls = 'local'; return { ls: ls, prop: this._prop, _string: this._string }; }
				}, this.df);
				expect(c._function).to.be.ok();
				var childData = c._function(), parentData = this.df._function();
				expect(childData.ls).to.be.equal('local');
				expect(childData.prop).to.be.equal(1);
				expect(childData._string).to.be.equal(parentData._string);
				// Scope verification
				c._string = 'changed'; // Change of variable _string in the subclass
				childData = c._function(); // call the function to extract this._string (scope of the function).
				expect(childData._string).not.be.equal(parentData._string); // verification if c._string is not a reference of this.df._string after deep copy.
			});

		});

		/**
		*	Boneyard Inheritance strategy
		**/
		describe('#inherit()', function() {
			/** Base Class Testing **/
			var BaseClass = Boneyard.com.boneyard.core.Class.inherit({
				_string: 'BaseClass',
				_object: { _boolean: false, _date: new Date('2014-02-22T23:43:51.223Z') },
				submethod: function() { return this._string + 'Base'; }
			}, { NAME: 'BaseClass', EXTRA: { p: 'Static1' } });

			it('Should Inherit a Class from Boneyard.com.boneyard.core.Class', function() {
				var instance1 = new BaseClass();
				expect(instance1._string).to.be.equal('BaseClass');
				expect(instance1.submethod()).to.be.equal('BaseClassBase');
			});

			it('Should Inherit SubClass of a BaseClass', function() {
				var instance1 = new BaseClass();
				expect(instance1._string).to.be.equal('BaseClass');
				expect(instance1.submethod()).to.be.equal('BaseClassBase');

				var SubClass = BaseClass.inherit({
					_string: 'SubClass',
					_number: 100,
					submethod: function() { return this._string + this._number.toString(); }
				}, { NAME: 'SubClass' });
				expect(SubClass.EXTRA).to.be.ok();
				expect(SubClass.EXTRA.p).to.be.ok();
				expect(SubClass.EXTRA.p).to.be.equal('Static1');

				var instance2 = new SubClass();
				expect(instance2._object).to.be.ok();
				expect(instance2._object._date.toISOString()).to.be.equal('2014-02-22T23:43:51.223Z');
				expect(instance2._number).to.be.equal(100);
				expect(instance2._string).to.be.equal('SubClass');
				// submethod() should be overriden in the subclass
				expect(instance2.submethod()).to.be.equal('SubClass100');

				// Integrity check between instances of BaseClass and SubClass
				expect(instance1._number).not.be.ok();
				expect(instance2._string).not.to.equal(instance1._string);
				expect(instance2.submethod()).not.to.equal(instance1.submethod());
				expect(instance2.toString()).not.to.equal(instance1.toString());
			});

		});

	});

});
