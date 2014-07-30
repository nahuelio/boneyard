/**
*	com.spinal.util.StringUtil Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/string',
		'util/error/exception'], function(StringUtil, SpinalException) {

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
					expect(e.message).to.be.equal(SpinalException.TYPES.StaticClass);
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

	});

});
