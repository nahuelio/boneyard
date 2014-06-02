/**
*	Spinal Core Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal'], function(Spinal) {

	describe('Spinal.Core', function() {

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

		/**
		*	Creates Namespaces
		**/
		describe('#namespace()', function() {
			it('Should namespace a class definition', function() {
				Spinal.namespace('com.spinal.ui.View', function() {});
				expect(Spinal.com).to.be.ok();
				expect(Spinal.com.spinal).to.be.ok();
				expect(Spinal.com.spinal.ui).to.be.ok();
				expect(Spinal.com.spinal.ui.View).to.be.ok();
			});
		});

		/**
		*	Third Party Libraries Verification
		**/
		describe('#Availability of Third Party Libs (Underscore, Backbone)', function() {
			it('Should be available and hooked up into Spinal Core', function() {
				expect(Spinal._).to.be.ok();
				expect(Spinal.Backbone).to.be.ok();
			});
		});

		/**
		*	Spinal Deep Copy strategy
		**/
		describe('#_extend()', function() {

			it('Should return a deep copy of an object (1 on 1)', function() {
				var c = Spinal.extend({ _string: 'child_string' }, this.ds);
				expect(c).to.be.ok();
			});

			it('Should return a deep copy of an object (multiple to 1)', function() {
				var c = Spinal.extend({ _string: 'child_string', _number: 2 }, this.ds, this.dn);
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
				var c = Spinal.extend({ _string: 'child_string' }, this.ds);
				expect(c._string).not.to.equal(this.ds._string);
			});

			// Number Type
			it('Should return a deep copy of an object having a Number', function() {
				var c = Spinal.extend({ _number: 1.10 }, this.dn);
				expect(c._number).not.to.equal(this.dn._number);
			});

			// Boolean Type
			it('Should return a deep copy of an object having a Boolean', function() {
				var c = Spinal.extend({ _boolean: false }, this.db);
				expect(c._boolean).to.be(false);
				expect(this.db._boolean).to.be(true);
			});

			// Undefined Type
			it('Should return a deep copy of an object having a Undefined', function() {
				var c = Spinal.extend({ _undefined: 'notUndefined' }, this.du);
				expect(c._undefined).not.to.equal(this.du._undefined);
				expect(c._undefined).to.be.equal('notUndefined');
			});

			// Null Type
			it('Should return a deep copy of an object having a Null', function() {
				var c = Spinal.extend({ _null: 'notNull' }, this.dnl);
				expect(c._null).not.to.equal(this.du._null);
				expect(c._null).to.be.equal('notNull');
			});

			// Object Type
			it('Should return a deep copy of an object having a Object', function() {
				var c = Spinal.extend({ _object: { _string: 'myString', _function: function() { console.log('child.func()', this._string); } }}, this.do);
				expect(c._object).to.be.ok();
				expect(c._object._string).to.be.ok();
				expect(c._object._string).to.be.equal('myString');
				expect(this.do._object._string).not.be.equal(c._object._string);
			});

			// Array Type
			it('Should return a deep copy of an object having a Array', function() {
				var c = Spinal.extend({ _array: [2, { _string: 'myString' }] }, this.da);
				expect(c._array).to.be.ok();
				expect(c._array[1]).to.be.ok();
				expect(c._array.length).not.be.equal(this.da._array.length);
				expect(c._array[0]).not.be.equal(this.da._array[0]);
			});

			// Date Type
			it('Should return a deep copy of an object having a Date', function() {
				var c = Spinal.extend({ _date: new Date('2014-02-22T23:43:51.223Z') }, this.dd);
				expect(c._date).to.be.ok();
				expect(c._date.toISOString()).to.be.equal('2014-02-22T23:43:51.223Z');
				expect(c._date.toISOString()).not.be.equal(this.dd._date.toISOString());
			});

			// Function Type
			it('Should return a deep copy of an object having a Function', function() {
				var c = Spinal.extend({
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
		*	Spinal Inheritance strategy
		**/
		describe('#inherit()', function() {
			/** Base Class Testing **/
			var BaseClass = Spinal.com.spinal.core.SpinalClass.inherit({
				_string: 'BaseClass',
				_object: { _boolean: false, _date: new Date('2014-02-22T23:43:51.223Z') },
				submethod: function() { return this._string + 'Base'; }
			}, { NAME: 'BaseClass', EXTRA: { p: 'Static1' } });

			it('Should Inherit a Class from Spinal.com.spinal.core.SpinalClass', function() {
				var instance1 = new BaseClass();
				expect(instance1.get('_string')).to.be.equal('BaseClass');
				expect(instance1.submethod()).to.be.equal('BaseClassBase');

				var instance2 = new BaseClass({ _string: 'BaseClass2', _object: { _boolean: true } });
				expect(instance2.submethod()).to.be.equal('BaseClass2Base');
				expect(instance2.get('_string')).not.be.equal(instance1.get('_string'));
				expect(instance2.get('_object')._boolean).not.be.equal(instance1.get('_object')._boolean);
			});

			it('Should Inherit SubClass of a BaseClass', function() {
				var SubClass = BaseClass.inherit({
					_string: 'SubClass',
					_number: 100,
					submethod: function() { return this._string + this._number.toString(); }
				}, { NAME: 'SubClass' });
				expect(SubClass.EXTRA).to.be.ok();
				expect(SubClass.EXTRA.p).to.be.ok();
				expect(SubClass.EXTRA.p).to.be.equal('Static1');

				var instance1 = new SubClass({ _string: 'SubClass-M' });
				expect(instance1._object).to.be.ok();
				expect(instance1._object._date.toISOString()).to.be.equal('2014-02-22T23:43:51.223Z');
				expect(instance1._number).to.be.equal(100);
				expect(instance1._string).to.be.equal('SubClass-M');
				// submethod() should be overriden in the subclass
				expect(instance1.submethod()).to.be.equal('SubClass-M100');
			});
		});

	});

});
