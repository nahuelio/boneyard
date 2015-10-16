/**
*	com.spinal.ioc.engine.helpers.Spec Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/helpers/spec',
	'ioc/engine/annotation/bone',
	'ioc/engine/annotation/action',
	'specs/simple.spec',
	'util/object'], function(Spec, Bone, Action, SimpleSpec, ObjectUtil) {

	describe('com.spinal.ioc.engine.helpers.Spec', function() {

		before(function() {
			this.$specBspecs = [{ $id: 'specC' }];
			this.$rootSpecs = [{ $id: 'specA' }, { $id: 'specB', $specs: this.$specBspecs }];
			this.simple = { $id: 'rootSpec', $specs: this.$rootSpecs };
			this.spec = null;
			// Stubs
			this.boneOnlyStub = sinon.stub(Bone, 'only').returns(_.pick(SimpleSpec, 'content', 'model', 'mycomponent'));
			this.actionOnlyStub = sinon.stub(Action, 'only').returns({}, {});
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
			this.fakeBone = { get: function() {}, getId: function() {}, bone: function() {} };
			this.boneMock = sinon.mock(this.fakeBone);
		});

		afterEach(function() {
			delete this.errAttr;
			delete this.errId;
			delete this.errSpecs;
			this.boneMock.restore();
			delete this.boneMock;
		});

		after(function() {
			this.boneOnlyStub.restore();
			delete this.boneOnlyStub;
			this.actionOnlyStub.restore();
			delete this.actionOnlyStub;
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
				var bonesMock = sinon.mock(this.spec.bones);
				var actionsMock = sinon.mock(this.spec.actions);

				bonesMock.expects('set')
					.once()
					.withArgs(ObjectUtil.objToArr(Bone.only()))
					.returns(true);
				actionsMock.expects('set')
					.once()
					.withArgs(Action.only())
					.returns(true)
					.calledAfter(bonesMock);

				var result = this.spec.parse(SimpleSpec);

				bonesMock.verify();
				actionsMock.verify();

				expect(bonesMock.calledOnce);
				expect(actionsMock.calledOnce);

				bonesMock.restore();
				actionsMock.restore();
			});

		});

		describe('#getBone()', function() {

			it('Should retrieve an existing bone by id', function() {
				var bonesMock = sinon.mock(this.spec.bones);

				bonesMock.expects('find')
					.once()
					.yields(this.fakeBone)
					.returns(this.fakeBone);
				this.boneMock.expects('getId')
					.atLeast(1)
					.returns('someId');
				this.boneMock.expects('get')
					.once()
					.returns(this.fakeBone)
					.calledAfter(bonesMock);

				var result = this.spec.getBone('someId');
				expect(result).to.be.ok();
				expect(result).to.be.an('object');

				bonesMock.verify();
				this.boneMock.verify();

				expect(bonesMock.calledOnce);
				expect(this.boneMock.calledOnce);

				bonesMock.restore();
			});

			it('Should return null: bone doesn\'t exists by id', function() {
				var bonesMock = sinon.mock(this.spec.bones);

				bonesMock.expects('find')
					.once()
					.yields(this.fakeBone)
					.returns(null);
				this.boneMock.expects('getId')
					.atLeast(1)
					.returns('someother');
				this.boneMock.expects('get').never();

				expect(this.spec.getBone('someId')).not.be.ok();

				bonesMock.verify();
				this.boneMock.verify();

				expect(bonesMock.calledOnce);
				expect(this.boneMock.calledOnce);

				bonesMock.restore();
			});

		});

		describe('#getBonesBy()', function() {

			it('Should retrieve an array of bones by predicate', function() {
				var bonesMock = sinon.mock(this.spec.bones);

				bonesMock.expects('findBy')
					.once()
					.yields(this.fakeBone)
					.returns([this.fakeBone]);

				var result = this.spec.getBonesBy(function() {});
				expect(result).to.be.an('array');
				expect(result).to.have.length(1);

				bonesMock.verify();

				expect(bonesMock.calledOnce);

				bonesMock.restore();
			});

		});

		describe('#getBonesByClass()', function() {

			it('Should retrieve an array of bones by class (constructor function)', function() {
				var specMock = sinon.mock(this.spec);
				specMock.expects('getBonesBy')
					.once()
					.yields(this.fakeBone)
					.returns([this.fakeBone]);
				this.boneMock.expects('bone')
					.atLeast(1)
					.returns(this.fakeBone)
					.calledAfter(specMock);

				var result = this.spec.getBonesByClass(Function);
				expect(result).to.be.an('array');
				expect(result).to.have.length(1);

				specMock.verify();
				expect(specMock.calledOnce);
				specMock.restore();
			});

		});

		describe('#getBonesByType()', function() {

			it('Should retrieve an array of bones by type', function() {
				var specMock = sinon.mock(this.spec);
				specMock.expects('getBonesBy')
					.once()
					.yields(this.fakeBone)
					.returns([this.fakeBone]);
				this.boneMock.expects('bone')
					.atLeast(1)
					.returns(this.fakeBone)
					.calledAfter(specMock);

				var result = this.spec.getBonesByType('function');
				expect(result).to.be.an('array');
				expect(result).to.have.length(1);

				specMock.verify();
				expect(specMock.calledOnce);
				specMock.restore();
			});

		});

		describe('#hasSpecs()', function() {

			it('Should retrieve true if specs has parent specs dependencies', function() {
				var getSpecsStub = sinon.stub(this.spec, 'getSpecs').returns(this.$rootSpecs);
				expect(this.spec.hasSpecs()).to.be(true);
				getSpecsStub.restore();
			});

		});

		describe('static#only()', function() {

			it('Should retrieve an object only spec properties ($id and $specs) from spec', function() {
				var result = Spec.only(SimpleSpec);
				expect(result).to.be.ok();
				expect(result).not.be.empty();
				expect(_.keys(result)).to.have.length(2);
			});

		});

	});

});
