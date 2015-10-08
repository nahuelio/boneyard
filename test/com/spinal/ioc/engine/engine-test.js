/**
*	com.spinal.ioc.engine.Engine Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/engine',
	'ioc/processor/ready',
	'ioc/engine/helpers/spec',
	'ioc/engine/annotation/plugin',
	'util/factories/async-factory',
	'specs/simple.spec',
	'specs/plugin.spec'], function(Engine, ReadyProcessor, Spec, Plugin, AsyncFactory, SimpleSpec, PluginSpec) {

	describe('com.spinal.ioc.engine.Engine', function() {

		before(function() {
			this.engine = null;
		});

		beforeEach(function() {
			this.factory = new AsyncFactory();
			this.factoryMock = sinon.mock(this.factory);
			this.processors = {
				set: function() {},
				isEmpty: function() {},
				hasNext: function() {},
				next: function() {},
				rewind: function() {},
				once: function() {}
			};
			this.processorsMock = sinon.mock(this.processors);

			if(this.engine) {
				// Mock Injections
				this.engine.processors = this.processors;
				this.engine.factory = this.factory;
			}
		});

		afterEach(function() {
			this.factoryMock.restore();
			delete this.factoryMock;

			this.processorsMock.restore();
			delete this.processorsMock;

			delete this.factory;
			delete this.processors;
		});

		after(function() {
			delete this.engine;
		});

		describe('#new()', function() {

			it('Should return an instanciate of an Engine class', function() {
				this.engine = new Engine();
				expect(this.engine).to.be.ok();
				expect(this.engine.wire).to.be.a('function');
				expect(this.engine.unwire).to.be.a('function');
			});

		});

		describe('#getFactory()', function() {

			it('Should return engine\'s asynchronous factory reference', function() {
				expect(this.engine.getFactory()).to.be.a(AsyncFactory);
			});

		});

		describe('#setup()', function() {

			it('Should Setup Engine initialization by loading processors', function() {
				var ctx = {}, callback = sinon.spy();
				callback.withArgs(ctx);
				// FIXME: Review this stub: It might not be a good idea to mock the this.ready handler...
				var readyStub = sinon.stub(this.engine, 'ready', _.bind(function(method, spec, callback, ctx) {
					callback(ctx);
					return this.engine;
				}, this));

				this.processorsMock
					.expects('isEmpty')
					.once()
					.returns(true);
				this.factoryMock
					.expects('set')
					.once()
					.returns(this.factory);
				this.factoryMock
					.expects('load')
					.once()
					.yields(callback)
					.returns(this.factory);

				var result = this.engine.setup(function() {}, SimpleSpec, callback, ctx);
				expect(result).to.be.an(Engine);

				this.processorsMock.verify();
				this.factoryMock.verify();

				expect(callback.calledOnce).to.be(true);
				expect(callback.calledWith(ctx)).to.be(true);
				readyStub.restore();
			});

			it('Should NOT trigger Engine initialization (processors already loaded and ready)', function() {
				var method = sinon.spy(), callback = sinon.spy(), ctx = {};

				this.processorsMock
					.expects('isEmpty')
					.once()
					.returns(false);

				var result = this.engine.setup(method, SimpleSpec, callback, ctx);
				expect(result).to.be.an(Engine);

				this.processorsMock.verify();

				expect(method.calledOnce);
				expect(method.calledWith(SimpleSpec, callback, ctx));
			});

		});

		describe('#ready()', function() {

			it('Should trigger engine method call after engine initialization is complete (spec defined)', function() {
				var method = sinon.spy(), callback = sinon.spy(), ctx = {};
				method.withArgs(SimpleSpec, callback, ctx);

				this.processorsMock.expects('set').once();

				this.engine.on(Engine.EVENTS.ready, _.bind(function(engine) {
					expect(engine).to.be.ok();
					expect(engine).to.be.an(Engine);
				}, this));

				var result = this.engine.ready(method, SimpleSpec, callback, ctx);
				expect(result).to.be.an(Engine);

				this.processorsMock.verify();
				expect(method.called).to.be(true);
				this.engine.off(Engine.EVENTS.ready);
			});

			it('Should NOT trigger engine method call after engine initialization is complete (spec NOT defined)', function() {
				var method = sinon.spy(), callback = sinon.spy(), ctx = {};
				var doneStub = sinon.stub(this.engine, 'done').returns(this.engine);
				method.withArgs(undefined, callback, ctx);

				this.processorsMock.expects('set').once();

				this.engine.on(Engine.EVENTS.ready, _.bind(function(engine) {
					expect(engine).to.be.ok();
					expect(engine).to.be.an(Engine);
				}, this));

				var result = this.engine.ready(method, undefined, callback, ctx);
				expect(result).to.be.an(Engine);

				this.processorsMock.verify();
				expect(method.called).to.be(false);
				this.engine.off(Engine.EVENTS.ready);
				this.engine.done.restore();
			});

		});

		describe('#execute()', function() {

			it('Should fire up engine\'s processor battery execution', function() {
				var callback = sinon.spy(), ctx = {}, nextProcessor = { path: 'ioc/processor/ready' };
				var processor = new ReadyProcessor(this.engine),
					processorMock = sinon.mock(processor);

				processorMock
					.expects('once')
					.once()
					.returns(processor);
				processorMock
					.expects('execute')
					.once();
				this.processorsMock
					.expects('hasNext')
					.once()
					.returns(true)
					.calledBefore(this.processorMock);
				this.processorsMock
					.expects('next')
					.once()
					.returns(nextProcessor);
				this.factoryMock
					.expects('create')
					.once()
					.withArgs(nextProcessor.path, this.engine)
					.returns(processor);

				var result = this.engine.execute(callback, ctx);
				expect(result).to.be.an(Engine);

				processorMock.verify();
				this.processorsMock.verify();
				this.factoryMock.verify();

				expect(callback.called).to.be(false);
				processorMock.restore();
			});

			it('Should execute callback (processors execution complete)', function() {
				var callback = sinon.spy(), ctx = {};

				this.processorsMock
					.expects('hasNext')
					.once()
					.returns(false)
				this.processorsMock
					.expects('rewind')
					.once()
					.returns(this.processors);

				var result = this.engine.execute(callback, ctx);
				expect(result).to.be.an(Engine);

				this.processorsMock.verify();

				expect(callback.called).to.be(true);
			});

		});

		describe('#wire()', function() {

			it('Should wire a new spec with callback', function() {
				var callback = sinon.spy(), ctx = {};
				var addSpecStub = sinon.stub(this.engine, 'addSpec').returns(SimpleSpec);

				this.processorsMock
					.expects('hasNext')
					.once()
					.returns(false);
				this.processorsMock
					.expects('rewind')
					.once();

				this.engine.on(Engine.EVENTS.wire, function(specs) {
					expect(specs).to.be.ok();
					expect(specs.size()).to.be(0);
				});

				var result = this.engine.wire(SimpleSpec, callback, ctx);
				expect(result).to.be.an(Engine);

				this.processorsMock.verify();

				expect(callback.calledOnce).to.be(true);

				this.engine.off(Engine.EVENTS.wire);
				addSpecStub.restore();
			});

			it('Should wire a new spec without callback', function() {
				var callback = sinon.spy(), ctx = {};
				var addSpecStub = sinon.stub(this.engine, 'addSpec').returns(SimpleSpec);

				this.processorsMock
					.expects('hasNext')
					.once()
					.returns(false);
				this.processorsMock
					.expects('rewind')
					.once();

				this.engine.on(Engine.EVENTS.wire, function(specs) {
					expect(specs).to.be.ok();
					expect(specs.size()).to.be(0);
				});

				var result = this.engine.wire(SimpleSpec, undefined, ctx);
				expect(result).to.be.an(Engine);

				this.processorsMock.verify();

				expect(callback.called).to.be(false);

				this.engine.off(Engine.EVENTS.wire);
				addSpecStub.restore();
			});

		});

		describe('#unwire()', function() {

			it('Should unwire an existing spec with callback', function() {
				var removeSpecStub = sinon.stub(this.engine, 'removeSpec').returns(SimpleSpec);

				this.engine.on(Engine.EVENTS.unwire, function(spec) {
					expect(spec).to.be.ok();
				});

				var result = this.engine.unwire(SimpleSpec);
				expect(result).to.be.an(Engine);

				removeSpecStub.restore();
			});

		});

		describe('#done()', function() {

			it('Should execute callback whenever done strategy is executed', function() {
				var callback = sinon.spy(), ctx = {};

				this.processorsMock
					.expects('rewind')
					.once();

				var result = this.engine.done(callback, ctx);
				expect(result).to.be.an(Engine);

				this.processorsMock.verify();
				expect(callback.calledOnce).to.be(true);
				expect(callback.calledWith(ctx)).to.be(true);
			});

			it('Should NOT execute a callback whenever done strategy is executed (Callback not defined or not a function)', function() {
				this.processorsMock
					.expects('rewind')
					.twice();

				var result = this.engine.done(undefined, {});
				expect(result).to.be.an(Engine);

				result = this.engine.done("not-a-function", {});
				expect(result).to.be.an(Engine);

				this.processorsMock.verify();
			});

		});

		describe('#extractPlugins()', function() {

			it('Should extract $plugins from spec ($plugins annotation found)', function() {
				var $plugins = { html: {}, theme: {} };
				var pluginMock = sinon.mock(Plugin);

				pluginMock
					.expects('only')
					.once()
					.returns($plugins);

				this.engine.on(Engine.EVENTS.plugins, function(plugins) {
					expect(plugins).to.be.ok();
					expect(plugins).to.be.an('array');
					expect(plugins).to.have.length(2);
				});

				var result = this.engine.extractPlugins(PluginSpec);
				expect(result).to.be.an('object');
				expect(this.engine.plugins.size()).to.be(2);
				expect(this.engine.plugins.get(0)).to.be.a(Plugin);

				pluginMock.verify();

				pluginMock.restore();
				this.engine.plugins.reset();
				this.engine.off(Engine.EVENTS.plugins);
			});

			it('Should NOT extract $plugins from spec ($plugins annotation not found)', function() {
				var pluginMock = sinon.mock(Plugin);

				pluginMock
					.expects('only')
					.once()
					.returns({});

				var result = this.engine.extractPlugins(PluginSpec);
				expect(result).to.be.an('object');
				expect(this.engine.plugins.size()).to.be(0);

				pluginMock.verify();

				pluginMock.restore();
			});

		});

		describe('#addSpec()', function() {

			it('Should Add a new spec into engine\'s spec collection', function() {
				var result = this.engine.addSpec(SimpleSpec);
				expect(result).to.be.ok();
				expect(result).to.be.an('array');
				expect(result).to.have.length(4);
				expect(result[0].getId()).to.be.ok();
				expect(result[0].getId()).to.be(SimpleSpec.$id);

				expect(this.engine.allSpecs()).to.have.length(4);
			});

			it('Should NOT add a new spec (spec already exists)', function() {
				var result = this.engine.addSpec(SimpleSpec);
				expect(result).to.be.ok();
				expect(result).to.be.an('array');
				expect(result).to.have.length(0);

				expect(this.engine.allSpecs()).to.have.length(4);
			});

		});

		describe('#removeSpec()', function() {

			it('Should Remove an existing spec from engine\'s spec collection', function() {
				var result = this.engine.removeSpec(SimpleSpec);
				expect(result).to.be.ok();
				expect(result).to.be.an('array');
				expect(result).to.have.length(4);
				expect(result[0].getId()).to.be.ok();
				expect(result[0].getId()).to.be(SimpleSpec.$id);

				expect(this.engine.allSpecs()).to.be.empty();
			});

			it('Should NOT remove an existing spec (spec doesn\'t exists)', function() {
				var result = this.engine.removeSpec(SimpleSpec);
				expect(result).to.be.ok();
				expect(result).to.be.an('array');
				expect(result).to.have.length(0);

				expect(this.engine.allSpecs()).to.be.empty();
			});

		});

		describe('#spec()', function() {

			it('Should return a spec instance by id', function() {
				this.engine.addSpec(SimpleSpec);
				var result = this.engine.spec('footer');
				expect(result).to.be.ok();
				expect(result).to.be.an('object');
				expect(result.getId()).to.be('footer');
			});

			it('Should NOT return a spec instance by id (spec not found)', function() {
				var result = this.engine.spec('non-existent');
				expect(result).not.be.ok();
			});

		});

		describe('#allSpecs()', function() {

			it('Should return all specs from engine\'s spec collection', function() {
				var result = this.engine.allSpecs();
				expect(result).to.be.ok();
				expect(result).to.be.an('array');
				expect(result).to.have.length(4);
			});

		});

		describe('#allBones()', function() {

			it('Should return all bones from all specs from engine\'s spec collection', function() {
				var result = this.engine.allBones();
				expect(result).to.be.ok();
				expect(result).to.be.an('array');
				expect(result).to.have.length(21);
			});

		});

		describe('#bone()', function() {

			it('Should return a bone instance by id', function() {
				var result = this.engine.bone('global');
				expect(result).to.be.ok();
				expect(result.getPath()).to.be('ui/container');
			});

			it('Should NOT return a bone instance by id (bone not found)', function() {
				var result = this.engine.bone('non-existent');
				expect(result).not.be.ok();
			});

		});

		describe('#bonesByType()', function() {

			it('Should return an array of bones by type');

			it('Should return an empty array of bones by type');

		});

		describe('#bonesByClass()', function() {

			it('Should return an array of bones by class');

			it('Should return an empty array of bones by class');

		});

	});

});
