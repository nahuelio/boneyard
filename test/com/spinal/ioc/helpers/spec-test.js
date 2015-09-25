/**
*	com.spinal.ioc.engine.helpers.Spec Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/helpers/spec',
	'ioc/engine/annotation/bone',
	'ioc/engine/annotation/ready',
	'specs/simple.spec',
	'util/object'], function(Spec, Bone, Ready, SimpleSpec, ObjectUtil) {

	describe('com.spinal.ioc.engine.helpers.Spec', function() {

		before(function() {
			this.$specBspecs = [{ $id: 'specC' }];
			this.$rootSpecs = [{ $id: 'specA' }, { $id: 'specB', $specs: this.$specBspecs }];
			this.simple = { $id: 'rootSpec', $specs: this.$rootSpecs };
			this.spec = null;
			// Stubs
			this.boneOnlyStub = sinon.stub(Bone, 'only').returns(_.pick(SimpleSpec, 'content', 'model', 'mycomponent'));
			this.readyOnlyStub = sinon.stub(Ready, 'only').returns({}, {});
			this.objToArrStub = sinon.stub(ObjectUtil, 'objToArr').returns([
				SimpleSpec.content,
				SimpleSpec.model,
				SimpleSpec.mycomponent
			]);
		});

		beforeEach(function() {
			this.errAttr = new Error('Spec attributes cannot be null or undefined');
			this.errId = new Error('Spec Annotation $id cannot be null or empty');
			this.errSpecs = new Error('Spec $specs annotation must be an array');
			Spec.prototype.bones = {
				set: function() {},
				find: function() {},
				findBy: function() {},
				interface: Bone
			};
			Spec.prototype.operations = { set: function() {}, interface: Ready };
			// Mocks
			this.bonesMock = sinon.mock(Spec.prototype.bones);
			this.operationsMock = sinon.mock(Spec.prototype.operations);
		});

		afterEach(function() {
			delete this.errAttr;
			delete this.errId;
			delete this.errSpecs;
			this.bonesMock.restore();
			delete this.bonesMock;
			this.operationsMock.restore();
			delete this.operationsMock;
		});

		after(function() {
			this.boneOnlyStub.restore();
			delete this.boneOnlyStub;
			this.readyOnlyStub.restore();
			delete this.readyOnlyStub;
			this.objToArrStub.restore();
			delete this.objToArrStub;
			delete this.$specBspecs;
			delete this.$rootSpecs;
			delete this.simple;
			delete this.spec;
		});

		describe('#new()', function() {

			it('Should return an instance of Spec', function() {
				var onlyStub = sinon.stub(Spec, 'only').returns(this.simple);
				var parseStub = sinon.stub(Spec.prototype, 'parse').returns(this.spec);
				var validStub = sinon.stub(Spec.prototype, 'valid').returns(undefined);

				this.spec = new Spec(this.simple);
				expect(this.spec).to.be.ok();
				expect(this.spec._$id).to.be(this.simple.$id);
				expect(this.spec._$specs).to.be.an('array');
				expect(this.spec._$specs).to.have.length(2);

				onlyStub.restore();
				parseStub.restore();
				validStub.restore();
			});

		});

		describe('#valid()', function() {

			it('Should throw an error: constructor parameter attributes is undefined', function() {
				expect(_.bind(function() {
					this.spec.valid();
				}, this)).to.throwException(_.bind(function(e) {
					expect(e.message).to.be(this.errAttr.message);
				}, this));
			});

			it('Should throw an error: spec $id not defined in constructor parameters', function() {
				expect(_.bind(function() {
					this.spec.valid({ $specs: this.$rootSpecs });
				}, this)).to.throwException(_.bind(function(e) {
					expect(e.message).to.be(this.errId.message);
				}, this));

				expect(_.bind(function() {
					this.spec.valid({ $id: '', $specs: this.$rootSpecs });
				}, this)).to.throwException(_.bind(function(e) {
					expect(e.message).to.be(this.errId.message);
				}, this));
			});

			it('Should throw an error: parent $specs defined but not array type', function() {
				expect(_.bind(function() {
					this.spec.valid({ $id: this.simple.$id, $specs: {} });
				}, this)).to.throwException(_.bind(function(e) {
					expect(e.message).to.be(this.errSpecs.message);
				}, this));
			});

			it('Should NOT throw an error: parameter constructor requirements should be all good', function() {
				expect(_.bind(function() { this.spec.valid(this.simple); }, this)).to.not.throwException();
			});

		});

		describe('#getId()', function() {

			it('Should retrieve spec $id', function() {
				expect(this.spec.getId()).to.be(this.simple.$id);
			});

		});

		describe('#getSpecs()', function() {

			it('Should retrieve array of parent specs dependencies', function() {
				var parentSpecs = this.spec.getSpecs();
				expect(parentSpecs).to.be.an('array');
				expect(parentSpecs).to.have.length(2);
			});

		});

		describe('#parse()', function() {

			it('Should parse bones and operations', function() {
				this.bonesMock.expects('set')
					.once()
					.withArgs(ObjectUtil.objToArr(Bone.only()))
					.returns(true);
				this.operationsMock.expects('set')
					.once()
					.withArgs(Ready.only())
					.returns(true)
					.calledAfter(this.bonesMock);

				var result = this.spec.parse(SimpleSpec);

				this.bonesMock.verify();
				this.operationsMock.verify();

				expect(this.bonesMock.calledOnce);
				expect(this.operationsMock.calledOnce);
			});

		});

		describe('#getBone()', function() {

			it('Should retrieve an existing bone by id');

			it('Should return null: bone doesn\'t exists by id');

		});

		describe('#getBonesBy()', function() {

			it('Should retrieve an array of bones by predicate');

			it('Should retrieve an empty array of bones by predicate');

		});

		describe('#getBonesByClass()', function() {

			it('Should retrieve an array of bones by class (constructor function)');

			it('Should retrieve an empty array of bones by class (constructor function)');

		});

		describe('#getBonesByType()', function() {

			it('Should retrieve an array of bones by type');

			it('Should retrieve an empty array of bones by type');

		});

		describe('#hasSpecs()', function() {

			it('Should retrieve true if specs has parent specs dependencies');

			it('Should retrieve false if specs doesn\'t have parent specs dependencies');

		});

		describe('static#only()', function() {

			it('Should retrieve an object only spec properties ($id and $specs) from spec');

		});

	});

});
