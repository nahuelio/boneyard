/**
*	com.boneyard.util.ObjectUtil Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/object',
	'util/exception/exception'], function(ObjectUtil, BoneyardException) {

	describe('com.boneyard.util.ObjectUtil', function() {

		describe('#new()', function() {

			it('Should throw an error: Static Class', function() {
				expect(function() {
					new ObjectUtil();
				}).to.throwException(function(e) {
					expect(e.message).to.be(BoneyardException.TYPES.StaticClass());
				});
			});

		});

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
