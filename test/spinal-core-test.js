/**
*	Spinal Test Class
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
var libpath = process.env['UT'] ? 'lib-cov' : 'lib',
    path = require('path'),
    should = require('should');

var Spinal = require(path.resolve(libpath, 'spinal-core'));

/**
*    @class Spinal
*    @classdesc Unit test for core Spinal operations
**/
describe('Spinal', function() {
	
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
	*	Spinal Inheritance strategy
	**/
	describe('#inherit()', function() {
		it('Should Inherit Class', function() {
			
		});
	});
	
	/**
	*	Spinal interface usage
	**/
	describe('#uses()', function() {
		it('Should use an interface class', function() {
			
		});
	});
	
});