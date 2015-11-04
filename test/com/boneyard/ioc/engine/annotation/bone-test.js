/**
*	com.boneyard.ioc.engine.annotation.Annotation Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/annotation/bone',
	'ioc/engine/helpers/injector',
	'ioc/engine/helpers/dependency',
	'util/object'], function(Bone, Injector, Dependency, ObjectUtil) {

	describe('com.boneyard.ioc.engine.annotation.Bone', function() {

		before(function() {
			this.boneComplex = { complex: {
				$module: 'ui/view',
				$params: {
					id: 'view',
					views: ['$bone!boneObj', true],
					render: '$bone!boneBool',
					other: { option: [{ key: '$bone!boneArr'}, 100] }
				}
			}};
			this.dependenciesFeed = [{
				expression: '$bone!boneObj',
				target: { key: '$bone!boneObj' },
				property: 'key',
				bone: {}
			}];
			this.bone = null;
		});

		after(function() {
			delete this.boneComplex;
			delete this.dependenciesFeed;
			delete this.dependencies;
			delete this.bone;
		});

		describe('#new()', function() {

			it('Should return an instance of a bone annotation', function() {
				var retrieveStub = sinon.stub(Bone.prototype, 'retrieve').returns(this.dependenciesFeed);
				this.bone = new Bone(this.boneComplex);

				expect(this.bone).to.be.ok();
				expect(this.bone.toString()).to.be('[object Bone]');
				expect(this.bone.getId()).to.be('complex');
				expect(this.bone.getValue()).to.be.an('object');
				expect(this.bone.getInjector()).to.be.a(Injector);

				retrieveStub.restore();
			});

		});

		describe('#getPath()', function() {

			it('Should return bone module path as string', function() {
				var isModuleStub = sinon.stub(this.bone, 'isModule').returns(true);

				var result = this.bone.getPath();
				expect(result).to.be.ok();
				expect(result).to.be(this.boneComplex.complex.$module);

				isModuleStub.restore();
			});

			it('Should return bone module path as null, the bone is not a module', function() {
				var isModuleStub = sinon.stub(this.bone, 'isModule').returns(false);

				expect(this.bone.getPath()).not.be.ok();

				isModuleStub.restore();
			});

		});

		describe('#getParams()', function() {

			it('Should return parameters of a bone module', function() {
				var isRealObjectStub = sinon.stub(ObjectUtil, 'isRealObject').returns(true);

				var result = this.bone.getParams();
				expect(result).to.be.ok();
				expect(result).to.be(this.boneComplex.complex.$params);

				isRealObjectStub.restore();
			});

			it('Should return the value of the bone, bone is not a module', function() {
				var isRealObjectStub = sinon.stub(ObjectUtil, 'isRealObject').returns(false);

				var result = this.bone.getParams();
				expect(result).to.be.ok();
				expect(result).to.be(this.boneComplex.complex);

				isRealObjectStub.restore();
			});

		});

		describe('#bone()', function() {

			it('Should return instance of a module', function() {
				var isModuleStub = sinon.stub(this.bone, 'isModule').returns(true);
				var isCreatedStub = sinon.stub(this.bone, 'isCreated').returns(true);

				// Returns bone metatada because another process will be responsible of assigning _$created a value.
				var result = this.bone.bone();
				expect(result).to.be(undefined);

				isModuleStub.restore();
				isCreatedStub.restore();
			});

			it('Should return null, bone is not a module', function() {
				var isModuleStub = sinon.stub(this.bone, 'isModule').returns(false);
				var isCreatedStub = sinon.stub(this.bone, 'isCreated').returns(true);

				// Returns bone metadata because another process will take care of that
				var result = this.bone.bone();
				expect(result).to.be.an('object');
				expect(result.$module).to.be.ok();

				isModuleStub.restore();
				isCreatedStub.restore();
			});

			it('Should return null, bone was not created', function() {
				var isModuleStub = sinon.stub(this.bone, 'isModule').returns(true);
				var isCreatedStub = sinon.stub(this.bone, 'isCreated').returns(false);

				// Returns bone metadata because another process will take care of that
				var result = this.bone.bone();
				expect(result).to.be.an('object');
				expect(result.$module).to.be.ok();

				isModuleStub.restore();
				isCreatedStub.restore();
			});

		});

		describe('#retrieve()', function() {

			it('Should retrieve array of dependency object structure', function() {
				this.bone = new Bone(this.boneComplex);
				expect(this.bone.getInjector().getDependencies().size()).to.be(3);
			});

			it('Should return an empty array of dependency object structures', function() {
				this.bone = new Bone({ nodependency: true });
				expect(this.bone.getInjector().getDependencies().size()).to.be(0);
			});

		});

		describe('#isModule()', function() {

			it('Should return true, the bone is a module', function() {
				var isBackboneStub = sinon.stub(ObjectUtil, 'isBackbone').returns(false);
				var getPathStub = sinon.stub(this.bone, 'getValue').returns({ $module: 'ui/view' });

				expect(this.bone.isModule()).to.be(true);

				isBackboneStub.restore();
				getPathStub.restore();
			});

			it('Should return false, the bone is backbone class', function() {
				var isBackboneStub = sinon.stub(ObjectUtil, 'isBackbone').returns(true);
				var getPathStub = sinon.stub(this.bone, 'getValue').returns({ $module: 'ui/view' });

				expect(this.bone.isModule()).to.be(false);

				isBackboneStub.restore();
				getPathStub.restore();
			});

			it('Should return false, the bone module path is not defined', function() {
				var isBackboneStub = sinon.stub(ObjectUtil, 'isBackbone').returns(false);
				var getPathStub = sinon.stub(this.bone, 'getValue').returns({});

				expect(this.bone.isModule()).to.be(false);

				isBackboneStub.restore();
				getPathStub.restore();
			});

		});

		describe('#isCreated()', function() {

			it('Should return true, the bone was created', function() {
				this.bone._$created = function() {};
				expect(this.bone.isCreated()).to.be(true);
				delete this.bone._$created;
			});

			it('Should return false, the bone was not created', function() {
				expect(this.bone.isCreated()).to.be(false);
			});

		});

		describe('static#only()', function() {

			it('Should extract only bones', function() {
				var result = Bone.only(_.extend({ $id: 'something', $specs: [] }, this.boneComplex, { $plugins: {} }));
				expect(result).to.be.ok();
				expect(result.$id).to.be(undefined);
				expect(result.$specs).to.be(undefined);
				expect(result.$plugins).to.be(undefined);
				expect(result.complex).to.be.ok();
			});

		});

	});

});
