/**
*	com.boneyard.util.StringUtil Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/string',
		'util/exception/exception'], function(StringUtil, BoneyardException) {

	describe('com.boneyard.util.StringUtil', function() {

		describe('#new()', function() {

			it('Should NOT instanciate StringUtil Class (Static)', function() {
				expect(_.bind(function() {
					new StringUtil();
				}, this)).to.throwException(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be.equal(BoneyardException.TYPES.StaticClass());
				})
			});

		});

		describe('static#uuid()', function() {

			it('Should generate a uuid string that match the standard', function() {
				expect(StringUtil.uuid()).to.be.ok();
			});

		});

		describe('static#createQueryString()', function() {

			it('Should return querystring based on a given object (key-value pairs)', function() {
				var toQuery = { a: 1, b: 'hello', c: true, arr: [1,2,3] };
				var result = StringUtil.createQueryString(toQuery);
				expect(result).to.be('?a=1&b=hello&c=true&arr=1&arr=2&arr=3');
			});

			it('Should return querystring without question mark prefix', function() {
				var toQuery = { a: 1, b: 'hello', c: true, arr: [1,2,3] };
				var result = StringUtil.createQueryString(toQuery, true);
				expect(result).to.be('a=1&b=hello&c=true&arr=1&arr=2&arr=3');
			});

			it('Should return querystring without question mark prefix and with custom separator', function() {
				var toQuery = { a: 1, b: 'hello', c: true, arr: [1,2,3] };
				var result = StringUtil.createQueryString(toQuery, true, '-');
				expect(result).to.be('a=1-b=hello-c=true-arr=1-arr=2-arr=3');
			});

		});

		describe('static#strToJSON()', function() {

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

		describe('#escapeRegex()', function() {

			it('Should escape Regular Expression character on a given string', function() {
				expect(StringUtil.escapeRegex('-\^$*+?.,/')).to.be('\\-\\^\\$\\*\\+\\?\\.\\,/');
				expect(StringUtil.escapeRegex({})).to.be.empty();
			});

		});

		describe('static#toPrivate()', function() {

			it('description', function() {
				var result = StringUtil.toPrivate({ 'propA': 1, 'propB': true });
				expect(result).to.be.a('object');
				expect(result.propA).not.be.ok();
				expect(result._propA).to.be.a('number');
				expect(result.propB).not.be.ok();
				expect(result._propB).to.be.a('boolean');
			});

		});

	});

});
