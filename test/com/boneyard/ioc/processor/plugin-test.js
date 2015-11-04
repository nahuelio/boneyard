/**
*	com.boneyard.ioc.processor.PluginProcessor Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/processor/plugin',
	'ioc/context',
	'ioc/engine/annotation/plugin',
	'specs/plugin.spec',
	'util/factories/async-factory',
	'util/object'], function(PluginProcessor, Context, Plugin, PluginSpec, AsyncFactory, ObjectUtil) {

	describe('com.boneyard.ioc.processor.PluginProcessor', function() {

		before(function() {
			this.processor = null;
		});

		beforeEach(function() {
			this.engineMock = sinon.mock(Context.engine);
			this.factory = new AsyncFactory();
			this.factoryMock = sinon.mock(this.factory);

			Context.engine.plugins.set(ObjectUtil.objToArr(Plugin.only(PluginSpec)));
			this.pluginA = Context.engine.plugins.get(0);
			this.pluginB = Context.engine.plugins.get(1);
			this.pluginAMock = sinon.mock(this.pluginA);
			this.pluginBMock = sinon.mock(this.pluginB);
		});

		afterEach(function() {
			this.pluginAMock.restore();
			delete this.pluginAMock;
			delete this.pluginA;

			this.pluginBMock.restore();
			delete this.pluginBMock;
			delete this.pluginB;

			this.factoryMock.restore();
			delete this.factoryMock;

			this.engineMock.restore();
			delete this.engineMock;

			delete this.factory;
			Context.engine.plugins.reset();
		});

		after(function() {
			delete this.processor;
		});

		describe('#new()', function() {

			it('Should return an instance of PluginProcessor', function() {
				this.processor = new PluginProcessor(Context.engine);
				expect(this.processor).to.be.a(PluginProcessor);
			});

		});

		describe('#enqueue()', function() {

			it('Should enqueue a plugin as a module inside the engine factory', function() {
				this.engineMock
					.expects('getFactory')
					.once()
					.returns(this.factory);
				this.factoryMock
					.expects('push')
					.withArgs({ path: (this.processor.defaultPath + this.pluginA.getId()), callback: sinon.match.func })
					.once();

				var result = this.processor.enqueue(this.pluginA);
				expect(result).to.be.a(PluginProcessor);

				this.engineMock.verify();
				this.factoryMock.verify();
			});

		});

		describe('#onLoad()', function() {

			it('Should be called as a result of loading a plugin module', function() {
				this.pluginAMock
					.expects('create')
					.once()
					.returns(this.pluginA);
				this.pluginAMock
					.expects('run')
					.once();

				var result = this.processor.onLoad(this.pluginA);
				expect(result).to.be.a(PluginProcessor);

				this.pluginAMock.verify();
			});

		});

		describe('#process()', function() {

			it('Should process a plugin annotation', function() {
				this.pluginAMock
					.expects('resolve')
					.once()
					.returns(this.pluginA);
				this.pluginAMock
					.expects('getId')
					.once()
					.returns('html');
				this.engineMock
					.expects('getFactory')
					.once()
					.returns(this.factory);
				this.factoryMock
					.expects('push')
					.withArgs(sinon.match.object)
					.once();

				var result = this.processor.process(this.pluginA);
				expect(result).to.be.a(PluginProcessor);

				this.pluginAMock.verify();
				this.engineMock.verify();
				this.factoryMock.verify();
			});

		});

		describe('#execute()', function() {

			it('Should trigger plugin processor execution over a list of plugins', function() {
				var pluginsStub = sinon.stub(this.processor, 'plugins')
					.returns([this.pluginA, this.pluginB]);
				var superExecuteStub = sinon.stub(PluginProcessor.__super__, 'execute')
					.withArgs(sinon.match.array, this.processor.process)
					.returns([this.pluginA, this.pluginB]);

				this.engineMock
					.expects('getFactory')
					.once()
					.returns(this.factory);
				this.factoryMock
					.expects('load')
					.once()
					.calledAfter(this.engineMock);

				var result = this.processor.execute();
				expect(result).to.be.a(PluginProcessor);

				this.engineMock.verify();
				this.factoryMock.verify();
				this.processor.plugins.restore();
				PluginProcessor.__super__.execute.restore();
			});

		});

		describe('#done()', function() {

			it('Should notify the engine that PluginProcessor complete the task', function() {
				var superDoneStub = sinon.stub(PluginProcessor.__super__, 'done')
					.withArgs(PluginProcessor.NAME)
					.returns(this.processor);

				expect(this.processor.done(PluginProcessor.NAME)).to.be.ok();

				PluginProcessor.__super__.done.restore();
			});

		});

	});

});
