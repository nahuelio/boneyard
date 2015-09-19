/**
*	com.spinal.ioc.engine.annotation.Annotation Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/annotation/annotation',
	'ioc/engine/helpers/dependency',
	'ioc/engine/helpers/injector',
	'util/adt/collection'], function(Annotation, Dependency, Injector, Collection) {

	describe('com.spinal.ioc.engine.annotation.Annotation', function() {

		before(function() {
			this.boneStr = { boneStr: 'Bone String' };
			this.boneNum = { boneNum: 1 };
			this.boneBool = { boneBool: true };
			this.boneBone = { boneBone: '$bone!boneStr' };
			this.boneObj = { boneObj: { key: 'Bone Obj' } };
			this.boneObjBone = { boneObjBone: { key: '$bone!boneNum' } };
			this.boneArr = { boneArr: ['BoneArr'] };
			this.boneArrBone = { boneArrBone: ['$bone!boneBool'] };
			this.boneComplex = { complex: {
				$module: 'ui/view',
				$params: {
					id: 'view',
					views: ['$bone!boneObj', true],
					render: '$bone!boneBool',
					other: { option: [{ key: '$bone!boneArr'}, 100] }
				}
			}};
			this.annotation = null;
		});

		after(function() {
			delete this.boneStr;
			delete this.boneNum;
			delete this.boneBool;
			delete this.boneBone;
			delete this.boneObj;
			delete this.boneObjBone;
			delete this.boneArr;
			delete this.boneArrBone;
			delete this.boneComplex;
			delete this.annotation;
		});

		describe('#new()', function() {

			it('Should return a new contructor', function() {
				this.annotation = new Annotation(this.boneStr);
				expect(this.annotation).to.be.ok();
			});

		});

		describe('#getDependencies()', function() {

			it('Should return a collection of type Dependency', function() {
				expect(this.annotation.getDependencies()).to.be.a(Collection);
				expect(this.annotation.getDependencies()._interface).to.be(Dependency);
			});

		});

		describe('#getId()', function() {

			it('Should return annotation id', function() {
				expect(this.annotation.getId()).to.be('boneStr');
			});

			it('Should return null', function() {
				var test = new Annotation({});
				expect(test.getId()).not.be.ok();
			});

		});

		describe('#getValue()', function() {

			it('Should return annotation value', function() {
				expect(this.annotation.getValue()).to.be(this.boneStr.boneStr);
			});

			it('Should return annotation as null', function() {
				var test = new Annotation({});
				expect(test.getValue()).not.be.ok();
			});

		});

		describe('#valid()', function() {

			it('Should throw Error: constructor parameter is null or not an object', function() {
				expect(function() {
					new Annotation();
				}).to.throwException(function(e) {
					expect(e.message).to.be('Annotation cannot be undefined');
				});

				expect(function() {
					new Annotation("not-valid");
				}).to.throwException(function(e) {
					expect(e.message).to.be('Annotation type must be an object');
				});
			});

		});

		describe('#create()', function() {

			it('Should return a dependency object structure', function() {
				var annotation = new Annotation(this.boneBone);
				this.isAnnotationStub = sinon.stub(Annotation, 'isExpressionValid').returns(true);

				var result = annotation.create('$bone!boneStr', 'boneBone', this.boneBone);
				expect(result).to.be.ok();
				expect(result).to.be.an(Annotation);

				this.isAnnotationStub.restore();
			});

			it('Should return null: expression not valid', function() {
				var annotation = new Annotation(this.boneObjBone);
				this.isAnnotationStub = sinon.stub(Annotation, 'isExpressionValid').returns(false);

				expect(annotation.create('boneStr', 'property', this.boneBone)).not.be.ok();

				this.isAnnotationStub.restore();
			});

			it('Should return null: context is not defined', function() {
				var annotation = new Annotation(this.boneObjBone);
				expect(annotation.create('boneStr', 'property', null)).not.be.ok();
			});

		});

		describe('#retrieve()', function() {

			it('Should retrieve array of object structure (Dependency)', function() {
				var annotation = new Annotation(this.boneComplex);
				var result = annotation.retrieve();

				expect(result).to.be.ok();
				expect(result).to.be.an('array');
				expect(result).to.have.length(3);
				expect();
			});

		});

		describe('static#isExpressionValid()', function() {

			it('Should return true: expression is a valid', function() {
				expect(Annotation.isExpressionValid(this.boneBone.boneBone)).to.be(true);
			});

			it('Should return false: expression is not valid', function() {
				expect(Annotation.isExpressionValid(this.boneStr.boneStr)).to.be(false);
				expect(Annotation.isExpressionValid()).to.be(false);
				expect(Annotation.isExpressionValid({})).to.be(false);
				expect(Annotation.isExpressionValid([])).to.be(false);
			});

		});

	});

});
