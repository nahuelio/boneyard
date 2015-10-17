/**
*	com.spinal.ioc.processor.CreateProcessor Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/processor/create',
	'ioc/engine/engine',
	'ioc/engine/annotation/bone',
	'ioc/engine/helpers/dependency',
	'ioc/engine/helpers/tsort',
	'util/factories/async-factory',
	'util/adt/collection',
	'specs/ioc.spec'], function(CreateProcessor, Engine, Bone, Dependency,
		TSort, AsyncFactory, Collection, IocSpec) {

	describe('com.spinal.ioc.processor.CreateProcessor', function() {

		before(function() {
			this.create = null;
			this.engine = new Engine();
			this.factory = new AsyncFactory();
			this.bones = [
				new Bone(_.pick(IocSpec, 'holder')),
				new Bone(_.pick(IocSpec, 'simple')),
				new Bone(_.pick(IocSpec, 'content')),
				new Bone(_.pick(IocSpec, 'subcontent')),
				new Bone(_.pick(IocSpec, 'advanced'))
			];
		});

		beforeEach(function() {
			this.engineMock = sinon.mock(this.engine);
			this.factoryMock = sinon.mock(this.factory);

			this.holderMock = sinon.mock(this.bones[0]);
			this.simpleMock = sinon.mock(this.bones[1]);
			this.contentMock = sinon.mock(this.bones[2]);
			this.subcontentMock = sinon.mock(this.bones[3]);
			this.advancedMock = sinon.mock(this.bones[4]);

			this.holderDependencies = this.bones[0].getDependencies();
			this.simpleDependencies = this.bones[1].getDependencies();
			this.contentDependencies = this.bones[2].getDependencies();
			this.subcontentDependencies = this.bones[3].getDependencies();

			this.holderDependenciesMock = sinon.mock(this.holderDependencies);
			this.simpleDependenciesMock = sinon.mock(this.simpleDependencies);
			this.contentDependenciesMock = sinon.mock(this.contentDependencies);
			this.subcontentDependenciesMock = sinon.mock(this.subcontentDependencies);

			this.holderDependency = this.holderDependencies.get(0);
			this.holderDependencyMock = sinon.mock(this.holderDependency);

			this.contentSimpleDependency = this.contentDependencies.get(0);
			this.contentSimpleDependencyMock = sinon.mock(this.contentSimpleDependency);

			this.contentSubContentDependency = this.contentDependencies.get(1);
			this.contentSubContentDependencyMock = sinon.mock(this.contentSubContentDependency);

			this.subcontentDependency = this.subcontentDependencies.get(0);
			this.subcontentDependencyMock = sinon.mock(this.subcontentDependency);
		});

		afterEach(function() {
			// Dependencies

			delete this.subcontentDependency;
			delete this.contentSimpleDependency;
			delete this.contentSubContentDependency;
			delete this.holderDependency;

			this.subcontentDependencyMock.restore();
			delete this.subcontentDependencyMock;

			this.contentSimpleDependencyMock.restore();
			delete this.contentSimpleDependencyMock;

			this.contentSubContentDependencyMock.restore();
			delete this.contentSubContentDependencyMock;

			this.holderDependencyMock.restore();
			delete this.holderDependencyMock;

			// Dependencies Collection

			delete this.holderDependencies;
			delete this.simpleDependencies;
			delete this.contentDependencies;
			delete this.subcontentDependencies;

			this.subcontentDependenciesMock.restore();
			delete this.subcontentDependenciesMock;

			this.contentDependenciesMock.restore();
			delete this.contentDependenciesMock;

			this.simpleDependenciesMock.restore();
			delete this.simpleDependenciesMock;

			this.holderDependenciesMock.restore();
			delete this.holderDependenciesMock;

			// Bones

			this.advancedMock.restore();
			delete this.advancedMock;

			this.subcontentMock.restore();
			delete this.subcontentMock;

			this.contentMock.restore();
			delete this.contentMock;

			this.simpleMock.restore();
			delete this.simpleMock;

			this.holderMock.restore();
			delete this.holderMock;

			// Global

			this.factoryMock.restore();
			delete this.factoryMock;

			this.engineMock.restore();
			delete this.engineMock;
		});

		after(function() {
			delete this.bones;
			delete this.factory;
			delete this.engine;
			delete this.create;
		});

		describe('#new()', function() {

			it('Should return an instance of CreateProcessor', function() {
				this.create = new CreateProcessor(this.engine);
				expect(this.create).to.be.ok();
				expect(this.create).to.be.an(CreateProcessor);
			});

		});

		describe('#enqueue()', function() {

			it('Should enqueue a new resource inside the factory stack (no dependencies)', function() {
				this.simpleMock
					.expects('getPath')
					.once()
					.returns('ui/view');
				this.engineMock
					.expects('getFactory')
					.once()
					.returns(this.factory);
				this.factoryMock
					.expects('push')
					.once()
					.calledAfter(this.engineMock);

				var result = this.create.enqueue(this.bones[1]);
				expect(result).to.be(this.create);

				this.simpleMock.verify();
				this.engineMock.verify();
				this.factoryMock.verify();
			});

			it('Should enqueue a new resource inside the factory stack', function() {
				this.contentMock
					.expects('getPath')
					.once()
					.returns('ui/view');
				this.engineMock
					.expects('getFactory')
					.once()
					.returns(this.factory);
				this.factoryMock
					.expects('push')
					.once()
					.calledAfter(this.engineMock);

					var result = this.create.enqueue(this.bones[2]);
					expect(result).to.be(this.create);

					this.contentMock.verify();
					this.engineMock.verify();
					this.factoryMock.verify();

					this.contentMock.verify();
					this.contentDependenciesMock.verify();
			});

			it('Should NOT have dependencies on hold', function() {
				var injectorResolveStub = sinon.stub(this.bones[2].getInjector(), 'resolve', _.bind(function() {
					this.contentSubContentDependency.hold = function() {};
				}, this));

				this.contentMock
					.expects('getDependencies')
					.once()
					.returns(this.contentDependencies);
				this.contentDependenciesMock
					.expects('get')
					.once()
					.returns(this.contentSimpleDependency);

				this.bones[2].getInjector().resolve(); // Explicit call to simulate partial resolution
				var dependencies = this.bones[2].getDependencies();
				var simple = dependencies.get(0);
				expect(simple.hold).not.be.ok();

				this.bones[2].getInjector().resolve.restore();
			});

			it('Should have at least one dependency on hold', function() {
				var injectorResolveStub = sinon.stub(this.bones[2].getInjector(), 'resolve', _.bind(function() {
					this.contentSubContentDependency.hold = function() {};
				}, this));

				this.contentMock
					.expects('getDependencies')
					.once()
					.returns(this.contentDependencies);
				this.contentDependenciesMock
					.expects('get')
					.once()
					.returns(this.contentSubContentDependency);

				this.bones[2].getInjector().resolve(); // Explicit call to simulate partial resolution
				var dependencies = this.bones[2].getDependencies();
				var subcontent = dependencies.get(1);
				expect(subcontent.hold).to.be.ok();

				this.bones[2].getInjector().resolve.restore();
			});

		});

		describe('#onLoad()', function() {

			it('Should execute bone dependency resolve via injector', function() {
				var contentInjector = this.bones[2].getInjector();
				var injectorResolveStub = sinon.stub(contentInjector, 'resolve').returns([]);

				var result = this.create.onLoad(this.bones[2], 'ui/container');
				expect(result).to.be.an(CreateProcessor);

				this.bones[2].getInjector().resolve.restore();
			});

		});

		describe('#tsort()', function() {

			it('Should Build, sort and return all bones dependencies using topological graph class', function() {
				var bonesMock = sinon.mock(this.bones);
				var dependenciesResult = ['subcontent', 'advanced'];
				var dependenciesStub = sinon.stub(this.create, 'dependencies').returns(dependenciesResult);
				var graphSortStub = sinon.stub(this.create.graph, 'sort').returns(dependenciesResult.reverse());

				this.engineMock
					.expects('allBones')
					.once()
					.returns(this.bones);
				bonesMock
					.expects('forEach')
					.once()
					.calledAfter(this.engineMock);

				var result = this.create.tsort();
				expect(result).to.be.an('array');
				expect(result).to.have.length(2);
				expect(result[0]).to.be('advanced');

				this.engineMock.verify();
				bonesMock.verify();

				this.create.dependencies.restore();
				this.create.graph.sort.restore();
				bonesMock.restore();
			});

		});

		describe('#dependencies()', function() {

			it('Should Retrieve for each bone and dependency array to insert into tsort graph', function() {
				this.contentMock
					.expects('getId')
					.atLeast(1)
					.returns('content');
				this.contentMock
					.expects('getDependencies')
					.atLeast(1)
					.returns(this.contentDependencies);
				this.contentDependenciesMock
					.expects('invoke')
					.atLeast(1)
					.withArgs('getId')
					.returns(['simple', 'subcontent']);

				var result = this.create.dependencies(this.bones[2]);
				expect(result).to.be.a(TSort);
				expect(result.nodes).to.be.an('object');
				expect(result.nodes.simple).to.be.an('array');
				expect(result.nodes.subcontent[0]).to.be('simple');

				this.contentMock.verify();
				this.contentDependenciesMock.verify();
			});

		});

		describe('#process()', function() {

			it('Should enqueue a module bone', function() {
				var enqueueStub = sinon.stub(this.create, 'enqueue')
					.withArgs(this.bones[3])
					.returns(this.create);

				this.subcontentMock
					.expects('isModule')
					.once()
					.returns(true);

				expect(this.create.process(this.bones[3])).to.be.ok();

				this.subcontentMock.verify();
				this.create.enqueue.restore();
			});

			it('Should try to resolve "non-module" bone dependencies (no enqueuing)', function() {
				var contentInjector = this.bones[0].getInjector();
				var injectorResolveStub = sinon.stub(contentInjector, 'resolve')
					.returns(contentInjector);

				this.holderMock
					.expects('isModule')
					.once()
					.returns(false);

				expect(this.create.process(this.bones[0])).to.be.ok();

				this.holderMock.verify();
				contentInjector.resolve.restore();
			});

		});

		describe('#execute()', function() {

			it('Should execute processor\'s strategy over bones and call factory load', function() {
				var superExecuteStub = sinon.stub(CreateProcessor.__super__, 'execute')
					.withArgs(this.bones, this.create.process)
					.returns([]);

				this.engineMock
					.expects('getFactory')
					.once()
					.returns(this.factory);
				this.factoryMock
					.expects('load')
					.once()
					.returns(this.factory);

				expect(this.create.execute()).to.be.ok();

				this.engineMock.verify();
				this.factoryMock.verify();
				CreateProcessor.__super__.execute.restore();
			});

		});

		describe('#resolve()', function() {

			it('Should resolve all bone dependencies set as on hold (if any)', function() {
				var tsortResult = ['advanced', 'simple', 'subcontent', 'content', 'holder'];
				var tsortStub = sinon.stub(this.create, 'tsort').returns(tsortResult);
				var forEachMock = sinon.mock(tsortResult);
				var resolveSpy = sinon.spy();
				var createSpy = sinon.spy();

				forEachMock
					.expects('forEach')
					.once()
					.yields('subcontent');
				this.engineMock
					.expects('bone')
					.once()
					.withArgs('subcontent')
					.returns(this.bones[3]);
				this.subcontentMock
					.expects('getInjector')
					.once()
					.returns({ resolve: resolveSpy, create: createSpy })
					.calledAfter(this.engineMock);

				expect(this.create.resolve()).to.be.ok();
				expect(resolveSpy.calledOnce).to.be(true);
				expect(createSpy.calledOnce).to.be(true);
				expect(resolveSpy.calledBefore(createSpy)).to.be(true);
				expect(resolveSpy.calledWith(this.create.getFactory())).to.be(true);

				this.engineMock.verify();
				forEachMock.verify();
				this.subcontentMock.verify();

				this.create.tsort.restore();
				forEachMock.restore();
			});

		});

		describe('#done()', function() {

			it('Should finish processor\'s strategy by calling super class done method', function() {
				var superDoneStub = sinon.stub(CreateProcessor.__super__, 'done')
					.withArgs(CreateProcessor.NAME)
					.returns(this.create);
				var resolveStub = sinon.stub(this.create, 'resolve').returns(this.create);

				expect(this.create.done(CreateProcessor.NAME)).to.be.ok();

				CreateProcessor.__super__.done.restore();
				this.create.resolve.restore();
			});

		});

	});

});
