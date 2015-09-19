/**
*	com.spinal.util.ObjectUtil Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/object'], function(ObjectUtil) {

	describe('com.spinal.util.ObjectUtil', function() {

		describe('static#search()', function() {

			it('Should find an object value by using a query string in dot notation', function() {
				var obj = { a: { b: { c: 'value_c' }, d: 'value_d' } };
				expect(ObjectUtil.search('a.d', obj)).to.be.equal('value_d');
			});

			it('Should NOT find an object value by using a query string in dot notation', function() {
				expect(ObjectUtil.search()).not.to.be.ok();
				expect(ObjectUtil.search('')).not.to.be.ok();
				expect(ObjectUtil.search('a.d', {})).to.be.empty();
			});

		});

	});

});
