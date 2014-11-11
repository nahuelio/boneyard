/**
*	com.spinal.util.StringUtil Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/string',
		'util/exception/exception'], function(StringUtil, SpinalException) {

	describe('com.spinal.util.StringUtil', function() {

		/**
		*	StringUtil#new() test
		**/
		describe('#new()', function() {

			it('Should NOT instanciate StringUtil Class (Static)', function() {
				expect(_.bind(function() {
					new StringUtil();
				}, this)).to.throwException(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be.equal(SpinalException.TYPES.StaticClass());
				})
			});

		});

		/**
		*	StringUtil#new() test (Static)
		**/
		describe('(Static) #uuid()', function() {

			it('Should generate a uuid string that match the standard', function() {
				expect(StringUtil.uuid()).to.be.ok();
			});

		});

		/**
		*	StringUtil#strToJSON() test (Static)
		**/
		describe('(Static) #strToJSON()', function() {

			it('Should return an object based on a String expression in dot notation', function() {
				var o = StringUtil.strToJSON('query.to.obj');
				expect(o).to.be.ok();
				expect(o.query).to.be.ok();
				expect(o.query.to).to.be.ok();
				expect(o.query.to.obj).to.be.ok();
			});

			it('Should NOT return an object based on a String expression in dot notation', function() {
				expect(StringUtil.strToJSON()).to.be.empty();
				expect(StringUtil.strToJSON(function() {})).to.be.empty();
			});

		});

		/**
		*	StringUtil#strToJSON() test (Static)
		**/
		describe('(Static) #search()', function() {

			it('Should find an object value by using a query string in dot notation', function() {
				var obj = { a: { b: { c: 'value_c' }, d: 'value_d' } };
				expect(StringUtil.search('a.d', obj)).to.be.equal('value_d');
			});

			it('Should NOT find an object value by using a query string in dot notation', function() {
				expect(StringUtil.search()).not.to.be.ok();
				expect(StringUtil.search('')).not.to.be.ok();
				expect(StringUtil.search('a.d', {})).to.be.empty();
			});

		});

	});

});
