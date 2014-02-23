/**
*	Spinal Test Class
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
var libpath = process.env['UT'] ? 'lib-cov' : 'lib',
    path = require('path'),
    should = require('should'),
	_ = require('underscore');

var Spinal = require(path.resolve(libpath, 'spinal-core'));

/**
*    @class Spinal
*    @classdesc Unit test for core Spinal operations
**/
describe('Spinal', function() {
	
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
			should.exist(Spinal.com);
			should.exist(Spinal.com.spinal);
			should.exist(Spinal.com.spinal.ui);
			should.exist(Spinal.com.spinal.ui.View);
		});
	});
	
	/**
	*	Spinal Deep Copy strategy
	**/
	describe('#_extend()', function() {
		
		it('Should return a deep copy of an object (1 on 1)', function() {
			var c = Spinal._extend({ _string: 'child_string' }, this.ds);
			should.exist(c);
		});
		
		it('Should return a deep copy of an object (multiple to 1)', function() {
			var c = Spinal._extend({ _string: 'child_string', _number: 2 }, this.ds, this.dn);
			should.exist(c);
			c._string.should.equal('child_string');
			c._number.should.equal(2);
			should.not.exist(this.ds._number);
			should.not.exist(this.dn._string);
			this.ds._string.should.equal('string');
			this.dn._number.should.equal(1);
		});
		
		// String Type
		it('Should return a deep copy of an object having a String', function() {
			var c = Spinal._extend({ _string: 'child_string' }, this.ds);
			c._string.should.not.equal(this.ds._string);
		});
		
		// Number Type
		it('Should return a deep copy of an object having a Number', function() {
			var c = Spinal._extend({ _number: 1.10 }, this.dn);
			c._number.should.not.equal(this.dn._number);
		});
		
		// Boolean Type
		it('Should return a deep copy of an object having a Boolean', function() {
			var c = Spinal._extend({ _boolean: false }, this.db);
			c._boolean.should.be.false;
			this.db._boolean.should.be.true;
		});
		
		// Undefined Type
		it('Should return a deep copy of an object having a Undefined', function() {
			var c = Spinal._extend({ _undefined: 'notUndefined' }, this.du);
			c._undefined.should.not.equal(this.du._undefined);
			c._undefined.should.equal('notUndefined');
		});
		
		// Null Type
		it('Should return a deep copy of an object having a Null', function() {
			var c = Spinal._extend({ _null: 'notNull' }, this.dnl);
			c._null.should.not.equal(this.du._null);
			c._null.should.equal('notNull');
		});
		
		// Object Type
		it('Should return a deep copy of an object having a Object', function() {
			var c = Spinal._extend({ _object: { _string: 'myString', _function: function() { console.log('child.func()', this._string); } }}, this.do);
			should.exist(c._object);
			should.exist(c._object._string);
			c._object._string.should.equal('myString');
			this.do._object._string.should.not.equal(c._object._string);
		});
		
		// Array Type
		it('Should return a deep copy of an object having a Array', function() {
			var c = Spinal._extend({ _array: [2, { _string: 'myString' }] }, this.da);
			should.exist(c._array);
			should.exist(c._array[1]);
			c._array.length.should.not.equal(this.da._array.length);
			c._array[0].should.not.equal(this.da._array[0]);
		});
		
		// Date Type
		it('Should return a deep copy of an object having a Date', function() {
			var c = Spinal._extend({ _date: new Date('2014-02-22T23:43:51.223Z') }, this.dd);
			should.exist(c._date);
			c._date.toISOString().should.equal('2014-02-22T23:43:51.223Z');
			c._date.toISOString().should.not.equal(this.dd._date.toISOString());
		});
		
		// Function Type
		it('Should return a deep copy of an object having a Function', function() {
			var c = Spinal._extend({ _prop: 1, _function: function() { var ls = 'local'; return { ls: ls, prop: this._prop, _string: this._string }; } }, this.df);
			should.exist(c._function);
			var childData = c._function(), parentData = this.df._function();
			childData.ls.should.equal('local');
			childData.prop.should.equal(1);
			childData._string.should.equal(parentData._string);
			// Scope verification
			c._string = 'changed'; // Change of variable _string in the subclass
			childData = c._function(); // call the function to extract this._string (scope of the function).
			childData._string.should.not.equal(parentData._string); // verification if c._string is not a reference of this.df._string after deep copy.
		});
	});
	
	/**
	*	Spinal Inheritance strategy
	**/
	describe('#inherit()', function() {
		it('Should Inherit Class', function() {
			var SubClass = Spinal.Generic.inherit({
				_string: 'sub',
				_object: { _boolean: false, _date: new Date('2014-02-22T23:43:51.223Z') },
				submethod: function() { return this._string + 'class'; }
			}, { NAME: 'SubClass' });
			var instance = new SubClass;
			console.log(instance);
		});
	});
	
});