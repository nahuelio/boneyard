/**
*	com.spinal.ioc.engine.annotation.Annotation Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/annotation/bone',
	'ioc/engine/helpers/injector',
	'ioc/engine/helpers/dependency',
	'util/adt/collection',
	'util/object'], function(Bone, Injector, Dependency, Collection, ObjectUtil) {

	describe('com.spinal.ioc.engine.annotation.Bone', function() {

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
				injector: new Injector()
			}];
			this.dependencies = new Collection(null, { interface: Dependency });
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
				this.retrieveStub = sinon.stub(Bone.prototype, 'retrieve').returns(this.dependenciesFeed);
				this.dependenciesStub = sinon.stub(Bone.prototype, 'getDependencies').returns(this.dependencies);
				this.bone = new Bone(this.boneComplex);

				expect(this.bone).to.be.ok();
				expect(this.bone.toString()).to.be('[object Bone]');
				expect(this.bone.getId()).to.be('complex');
				expect(this.bone.getValue()).to.be.an('object');
				expect(this.bone.getDependencies()).to.be.a(Collection);

				this.retrieveStub.restore();
				this.dependenciesStub.restore();
			});

		});

		describe('#getPath()', function() {

			it('Should return bone module path as string', function() {
				this.isModuleStub = sinon.stub(this.bone, 'isModule').returns(true);

				var result = this.bone.getPath();
				expect(result).to.be.ok();
				expect(result).to.be(this.boneComplex.complex.$module);

				this.isModuleStub.restore();
			});

			it('Should return bone module path as null, the bone is not a module', function() {
				this.isModuleStub = sinon.stub(this.bone, 'isModule').returns(false);

				expect(this.bone.getPath()).not.be.ok();

				this.isModuleStub.restore();
			});

		});

		describe('#getParams()', function() {

			it('Should return parameters of a bone module', function() {
				this.isRealObjectStub = sinon.stub(ObjectUtil, 'isRealObject').returns(true);

				var result = this.bone.getParams();
				expect(result).to.be.ok();
				expect(result).to.be(this.boneComplex.complex.$params);

				this.isRealObjectStub.restore();
			});

			it('Should return the value of the bone, bone is not a module', function() {
				this.isRealObjectStub = sinon.stub(ObjectUtil, 'isRealObject').returns(false);

				var result = this.bone.getParams();
				expect(result).to.be.ok();
				expect(result).to.be(this.boneComplex.complex);

				this.isRealObjectStub.restore();
			});

		});

		describe('#bone()', function() {

			it('Should return instance of a module', function() {
				this.isModuleStub = sinon.stub(this.bone, 'isModule').returns(true);
				this.isCreatedStub = sinon.stub(this.bone, 'isCreated').returns(true);

				// Returns undefined because another process will be responsible of assigning _$created a value.
				var result = this.bone.bone();
				expect(result).to.be(undefined);

				this.isModuleStub.restore();
				this.isCreatedStub.restore();
			});

			it('Should return null, bone is not a module', function() {
				this.isModuleStub = sinon.stub(this.bone, 'isModule').returns(false);
				this.isCreatedStub = sinon.stub(this.bone, 'isCreated').returns(true);

				// Returns undefined because another process will take care of that
				var result = this.bone.bone();
				expect(result).not.be.ok();

				this.isModuleStub.restore();
				this.isCreatedStub.restore();
			});

			it('Should return null, bone was not created', function() {
				this.isModuleStub = sinon.stub(this.bone, 'isModule').returns(true);
				this.isCreatedStub = sinon.stub(this.bone, 'isCreated').returns(false);

				// Returns undefined because another process will take care of that
				var result = this.bone.bone();
				expect(result).not.be.ok();

				this.isModuleStub.restore();
				this.isCreatedStub.restore();
			});

		});

		describe('#create()', function() {

			// CONTINUE HERE >>>
			it('Should return dependency object structure');

			it('Should return null, expression not a valid bone annotation');

		});

		describe('#retrieve()', function() {

			it('Should retrieve array of dependency object structure');

			it('Should return an empty array of dependency object structures');

		});

		describe('#isModule()', function() {

			it('Should return true, the bone is a module');

			it('Should return false, the bone is not a module');

		});

		describe('#isCreated()', function() {

			it('Should return true, the bone was created');

			it('Should return false, the bone was not created');

		});

		describe('static#isBone()', function() {

			it('Should return true, the expression is a valid bone annotation');

			it('Should return false, the expression is a not valid bone annotation');

		});

	});

});
