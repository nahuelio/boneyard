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
				// By Type Stubs
				this.stringStub = sinon.stub(this.factoryMapper, 'string');
				this.numberStub = sinon.stub(this.factoryMapper, 'number');
				this.booleanStub = sinon.stub(this.factoryMapper, 'boolean');
				this.objectStub = sinon.stub(this.factoryMapper, 'object');
				this.arrayStub = sinon.stub(this.factoryMapper, 'array');

				// By Key Stubs
				this.factoryMapper.items = function() {};
				this.factoryMapper.addresses = function() {};

				this.itemsStub = sinon.stub(this.factoryMapper, 'items');
				this.addressesStub = sinon.stub(this.factoryMapper, 'addresses');
			}
		});

		afterEach(function() {
			if(this.stringStub) {
				if(this.factoryMapper.string.restore)
					this.factoryMapper.string.restore();

				if(this.factoryMapper.number.restore)
					this.factoryMapper.number.restore();

				if(this.factoryMapper.boolean.restore)
					this.factoryMapper.boolean.restore();

				if(this.factoryMapper.array.restore)
					this.factoryMapper.array.restore();

				if(this.factoryMapper.object.restore)
					this.factoryMapper.object.restore();

				delete this.stringStub;
				delete this.numberStub;
				delete this.booleanStub;
				delete this.objectStub;
				delete this.arrayStub;

				this.factoryMapper.items.restore();
				this.factoryMapper.addresses.restore();

				delete this.itemsStub;
				delete this.addressesStub;
				delete this.factoryMapper.items;
				delete this.factoryMapper.addresses;
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

			it('Should source the factory mapper by using "byType" strategy (with callback)', function() {
				var callback = function() {};

				this.stringStub
					.onFirstCall().returns({ key: 1, value: 'mapper' })
					.onSecondCall().returns({ key: 'b', value: 'hello' })
					.onThirdCall().returns({ key: 1, value: 'world' });

				this.numberStub
					.onFirstCall().returns({ key: 0, value: 1 })
					.onSecondCall().returns({ key: 'a', value: 1 })
					.onThirdCall().returns({ key: 0, value: 1 });

				this.booleanStub
					.onFirstCall().returns({ key: 2, value: true })
					.onSecondCall().returns({ key: 2, value: false });

				this.objectStub
					.onFirstCall().returns({ key: 3, value: sinon.match.object })
					.onSecondCall().returns({ key: 'c', value: sinon.match.object })
					.onThirdCall().returns({ key: 3, value: sinon.match.object });

				this.arrayStub
					.onFirstCall().returns({ key: 'd', value: sinon.match.array })
					.onSecondCall().returns({ key: 5, value: sinon.match.array });

				var result = this.factoryMapper.source(this.sampleData, callback);
				expect(result).to.be.a(FactoryMapper);
			});

			it('Should source the factory mapper by using "byType" strategy (with no callback)', function() {
				this.stringStub
					.onFirstCall().returns({ key: 1, value: 'mapper' })
					.onSecondCall().returns({ key: 'b', value: 'hello' })
					.onThirdCall().returns({ key: 1, value: 'world' });

				this.numberStub
					.onFirstCall().returns({ key: 0, value: 1 })
					.onSecondCall().returns({ key: 'a', value: 1 })
					.onThirdCall().returns({ key: 0, value: 1 });

				this.booleanStub
					.onFirstCall().returns({ key: 2, value: true })
					.onSecondCall().returns({ key: 2, value: false });

				// Needed one to pass the resource callback validation on AttachCallback test case
				this.objectStub
					.onFirstCall().returns({ path: 'path/to/my/module' })
					.onSecondCall().returns({ key: 'c', value: sinon.match.object })
					.onThirdCall().returns({ key: 3, value: sinon.match.object });

				this.arrayStub
					.onFirstCall().returns({ key: 'd', value: sinon.match.array })
					.onSecondCall().returns({ key: 5, value: sinon.match.array });

				var result = this.factoryMapper.source(this.sampleData);
				expect(result).to.be.a(FactoryMapper);
			});

			it('Should source the factory mapper by using "byKey" strategy', function() {
				this.factoryMapper.object.restore();
				var callback = function() {};

				this.itemsStub.returns({
					path: 'my/awesome/itemList',
					params: { model: new Backbone.Collection(this.sampleDataByKey[0].items) }
				});

				this.addressesStub.returns({
					path: 'my/awesome/addressList',
					params: { model: new Backbone.Collection(this.sampleDataByKey[1].addresses) }
				});

				var result = this.factoryMapper.source(this.sampleDataByKey, callback);
				expect(result).to.be.a(FactoryMapper);
			});

			it('Should execute default strategies placeholders "byType"', function() {
				// Release Stubs to run real strategies
				this.factoryMapper.string.restore();
				this.factoryMapper.number.restore();
				this.factoryMapper.boolean.restore();
				this.factoryMapper.object.restore();
				this.factoryMapper.array.restore();

				var result = this.factoryMapper.source(this.sampleData);
				expect(result).to.be.a(FactoryMapper);
			});

		});

	});

});
