/**
*	com.spinal.util.adt.Collection Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
var libpath = process.env['UT'] ? 'lib-cov' : 'lib',
	amd = require('amd-loader'),
    path = require('path'),
    should = require('should'),
	_ = require('underscore');

var Collection = require(path.resolve(libpath, 'com/spinal/util/adt/collection'));

describe('com.spinal.util.adt.Collection', function() {
	
	/**
	*	Constructor test
	**/
	describe('#new()', function() {
		
		it('Should return a com.spinal.util.adt.Collection Instance', function() {
			
		});
		
	});
	
	/**
	*	Collection#_valid() test
	**/
	describe('#_valid()', function() {
		
		it('Should return false (element is undefined)', function() { });
		it('Should return false (element is not an object)', function() { });
		it('Should return false (At least one element inside the array is not an object)', function() { });
		it('Should return true (Single Object)', function() { });
		it('Should return true (Array of Objects)', function() { });
		
	});
	
	/**
	*	Collection#set() test
	**/
	describe('#set()', function() {
		
		it('Should set a new collection (Single Object)', function() { });
		it('Should set a new collection (Array of Objects)', function() { });
		
	});
	
	/**
	*	Collection#get() test
	**/
	describe('#get()', function() {
		
		it('Should return the element at specific index', function() { });
		it('Should NOT return the element at specific index', function() { });
		
	});
	
	/**
	*	Collection#add() test
	**/
	describe('#add()', function() {
		
		it('Should add a new element', function() { });
		it('Should NOT add a new element', function() { });
		
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