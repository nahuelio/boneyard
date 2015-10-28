/**
*	com.spinal.util.factories.FactoryMapper Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/factories/factory-mapper', 'ui/view'], function(FactoryMapper, View) {

	describe('com.spinal.util.factories.FactoryMapper', function() {

		before(function() {
			this.factoryMapper = null;
			this.sampleData = [1, 'mapper', true, { a: 1, b: 'hello', c: {}, d: [] }, undefined, [1, 'world', false, { a: null }]];
			this.sampleDataByKey = [
				{ items: ['Option 1', 'Option 2', 'Option 3'] },
				{ addresses: [{ street: 'Street 1' }, { street: 'Street 2' }] }
			];
		});

		beforeEach(function() {
			if(this.factoryMapper) {
				// By Type Spies
				this.stringSpy = sinon.spy(this.factoryMapper, 'string');
				this.numberSpy = sinon.spy(this.factoryMapper, 'number');
				this.booleanSpy = sinon.spy(this.factoryMapper, 'boolean');
				this.objectSpy = sinon.spy(this.factoryMapper, 'object');
				this.arraySpy = sinon.spy(this.factoryMapper, 'array');
				// By Key Spies
				this.itemsSpy = sinon.spy();
				this.addressesSpy = sinon.spy();
			}
		});

		afterEach(function() {
			if(this.stringSpy) {
				this.factoryMapper.string.restore();
				this.factoryMapper.number.restore();
				this.factoryMapper.boolean.restore();
				this.factoryMapper.object.restore();
				this.factoryMapper.array.restore();

				delete this.stringSpy;
				delete this.numberSpy;
				delete this.booleanSpy;
				delete this.objectSpy;
				delete this.arraySpy;

				delete this.itemsSpy;
				delete this.addressesSpy;
			}
		});

		after(function() {
			delete this.sampleDataByKey;
			delete this.sampleData;
			delete this.factoryMapper;
		});

		describe('#new()', function() {

			it('Should return an instance of FactoryMapper', function() {
				this.factoryMapper = new FactoryMapper();
				expect(this.factoryMapper).to.be.a(FactoryMapper);
			});

		});

		describe('#isValid()', function() {

			it('Should return true while validating key, value and callback params', function() {
				var result = this.factoryMapper.isValid('key', 'value');
				expect(result).to.be(true);
			});

			it('Should return false while validating key, value', function() {
				// No parameters passed
				var result = this.factoryMapper.isValid();
				expect(result).to.be(false);

				// Key defined and value not defined
				result = this.factoryMapper.isValid('key');
				expect(result).to.be(false);

				// Key defined, value defined but key is an empty string
				result = this.factoryMapper.isValid('value', '');
				expect(result).to.be(false);
			});

		});

		describe('#source', function() {

			it('Should source the factory mapper by using "byType" strategy', function() {
				var result = this.factoryMapper.source(this.sampleData);
				expect(result).to.be.a(FactoryMapper);

				expect(this.stringSpy.calledThrice).to.be(true);
				expect(this.numberSpy.calledThrice).to.be(true);
				expect(this.booleanSpy.calledTwice).to.be(true);
				expect(this.objectSpy.calledThrice).to.be(true);
				expect(this.arraySpy.calledTwice).to.be(true);
			});

			it('Should source the factory mapper by using "byKey" strategy', function() {
				// Injecting ByKey strategies
				this.factoryMapper.items = this.itemsSpy;
				this.factoryMapper.addresses = this.addressesSpy;

				var result = this.factoryMapper.source(this.sampleDataByKey);
				expect(result).to.be.a(FactoryMapper);

				expect(this.itemsSpy.calledOnce).to.be(true);
				expect(this.addressesSpy.calledOnce).to.be(true);

				delete this.factoryMapper.items;
				delete this.factoryMapper.addresses;
			});

		});

	});

});
