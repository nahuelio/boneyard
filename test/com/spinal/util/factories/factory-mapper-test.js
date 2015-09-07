/**
*	com.spinal.util.factories.FactoryMapper Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/factories/factory-mapper', 'ui/view'], function(FactoryMapper, View) {

	describe('com.spinal.util.factories.FactoryMapper', function() {

		before(function() {
			this.sampleData = [1, 'mapper', true, { a: 1, b: 'hello', c: {}, d: [] }, [1, 'world', false, { a: 'value' }]];
		});

		/**
		*	AsyncFactory#new() test
		**/
		describe('#constructor', function() {

			it('Should return an instance of FactoryMapper', function() {
				this.factoryMapper = new FactoryMapper();
				expect(this.factoryMapper).to.be.ok();
			});

		});

		/**
		*	AsyncFactory#_validate() test
		**/
		describe('#_validate', function() {

			it('Should return true while validating key, value and callback params', function() {
				var result = this.factoryMapper._validate('key', 'value', function() {});
				expect(result).to.be(true);
			});

			it('Should return false while validating key, value and callback params', function() {
				// No parameters passed
				var result = this.factoryMapper._validate();
				expect(result).to.be(false);

				// Key defined and value not defined
				result = this.factoryMapper._validate('key');
				expect(result).to.be(false);

				// Key defined, value defined and callback undefined
				result = this.factoryMapper._validate('key', 'value');
				expect(result).to.be(false);

				// Key defined, value defined but key is an empty string
				result = this.factoryMapper._validate('', 'value');
				expect(result).to.be(false);

				// Key defined, value defined and callback defined but not a function
				result = this.factoryMapper._validate('key', 'value', 'callback');
				expect(result).to.be(false);
			});

		});

		/**
		*	AsyncFactory#source() test
		**/
		describe('#source', function() {

			it('Should source the mapper with a collection of objects', function(done) {
				this.factoryMapper.source(_.bind(function(params, id, factory) {
					expect(params).to.be.ok();
					expect(id).to.be.ok();
					expect(factory).to.be.ok();

					expect(params.value).not.to.be(undefined);
					expect(id).to.be.a('string');
					expect(factory).to.be.a('function');

					expect(this.factoryMapper.isRegistered(id)).to.be(true);
					var instance = this.factoryMapper.create(id, params);
					expect(instance).to.be.ok();
					expect(instance).to.be.a(View);
				}, this), this.sampleData).load(_.bind(function() { done(); }, this));
			});

		});

	});

});
