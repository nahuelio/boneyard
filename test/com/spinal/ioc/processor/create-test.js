/**
*	com.spinal.ioc.processor.CreateProcessor Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/processor/create',
	'ioc/engine/engine',
	'ioc/engine/annotation/bone',
	'ioc/engine/helpers/dependency',
	'util/factories/async-factory',
	'util/adt/collection',
	'specs/simple.spec'], function(CreateProcessor, Engine, Bone, Dependency, AsyncFactory, Collection, SimpleSpec) {

	describe('com.spinal.ioc.processor.CreateProcessor', function() {

		before(function() {
			this.create = null;
			this.engine = new Engine();
			this.factory = new AsyncFactory();
			this.bones = [
				new Bone(_.pick(SimpleSpec, 'holder')),
				new Bone(_.pick(SimpleSpec, 'simple')),
				new Bone(_.pick(SimpleSpec, 'content')),
				new Bone(_.pick(SimpleSpec, 'subcontent')),
				new Bone(_.pick(SimpleSpec, 'advanced'))
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

		describe('#getPositions()', function() {

			it('Should return an array of resources positions inside the factory stack', function() {
				this.contentMock
					.expects('getDependencies')
					.once()
					.returns(this.contentDependencies)
				this.contentDependenciesMock
					.expects('map')
					.once()
					.yields(this.contentSimpleDependency)
					.returns(['simple', 'subcontent']);
				this.contentSimpleDependencyMock
					.expects('getId')
					.once()
					.returns('simple')
					.calledAfter(this.contentDependenciesMock);
				this.engineMock
					.expects('getFactory')
					.once()
					.returns(this.factory)
					.calledAfter(this.contentDependenciesMock);
				this.factoryMock
					.expects('findPositionsBy')
					.once()
					.yields({ id: 'simple' })
					.returns([1])
					.calledAfter(this.engineMock);

				var result = this.create.getPositions(this.bones[2]);
				expect(result).to.be.an('array');
				expect(result).to.have.length(1);

				this.contentMock.verify();
				this.contentDependenciesMock.verify();
				this.contentSubContentDependencyMock.verify();
				this.engineMock.verify();
				this.factoryMock.verify();
			});

		});

		describe('#enqueue()', function() {

			it('Should enqueue a new resource inside the factory stack (without sorting dependencies)', function() {
				this.simpleMock
					.expects('getPath')
					.once()
					.returns('ui/view');
				this.simpleMock
					.expects('getId')
					.once()
					.returns('simple');
				this.simpleMock
					.expects('getDependencies')
					.once()
					.returns(this.simpleDependencies);
				this.simpleDependenciesMock
					.expects('isEmpty')
					.once()
					.returns(true);
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
				this.simpleDependenciesMock.verify();
				this.engineMock.verify();
				this.factoryMock.verify();
			});

			it('Should enqueue a new resource inside the factory stack and sort dependencies', function() {
				var sortStub = sinon.stub(this.create, 'sort').returns(function() {});
				this.subcontentMock
					.expects('getPath')
					.once()
					.returns('ui/container');
				this.subcontentMock
					.expects('getId')
					.once()
					.returns('subcontent');
				this.subcontentMock
					.expects('getDependencies')
					.atLeast(1)
					.returns(this.subcontentDependencies);
				this.subcontentDependenciesMock
					.expects('isEmpty')
					.once()
					.returns(false);
				this.engineMock
					.expects('getFactory')
					.twice()
					.returns(this.factory);
				this.factoryMock
					.expects('push')
					.once()
					.calledAfter(this.engineMock);
				this.factoryMock
					.expects('swap')
					.once()
					.yields(sortStub)
					.calledAfter(this.engineMock);

				var result = this.create.enqueue(this.bones[3]);
				expect(result).to.be(this.create);

				this.subcontentMock.verify();
				this.subcontentDependenciesMock.verify();
				this.engineMock.verify();
				this.factoryMock.verify();

				sortStub.restore();
			});

		});

		describe('#sort()', function() {

			it('Should sort existing resources in the factory stack');

		});

		describe('#create()', function() {

			it('Should instanciate a group of module bones and pass them to the bone injector.assign()');

		});

		describe('#process()', function() {

			it('Should determine if the current bone should be enqueued or resolve dependencies by itself via injector');

		});

		describe('#execute()', function() {

			it('Should execute processor\'s strategy over bones and call factory load');

		});

		describe('#done()', function() {

			it('Should finish processor\'s strategy by calling super class done method');

		});

	});

});
