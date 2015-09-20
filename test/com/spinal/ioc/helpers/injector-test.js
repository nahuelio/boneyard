/**
*	com.spinal.ioc.Context Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/helpers/injector',
		'ioc/engine/annotation/bone',
		'util/adt/collection'], function(Injector, Bone, Collection) {

	describe('com.spinal.ioc.helpers.Injector', function() {

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
			this.bone = new Bone(this.boneComplex);
		});

		after(function() {
			delete this.boneComplex;
			delete this.bone;
		});

		describe('#new', function() {

			it('Should return an instance of an Injector', function() {
				var spyGet = sinon.spy(this.bone, 'get');
				var spyRetrieve = sinon.spy(this.bone, 'retrieve');

				this.injector = new Injector(this.bone);

				expect(spyGet.calledOnce);
				expect(spyRetrieve.called);

				this.bone.get.restore();
				this.bone.retrieve.restore();
			});

		});

		describe('#getDependencies', function() {

			it('Should return a collection of dependencies', function() {
				expect(this.injector.getDependencies()).to.be.a(Collection);
				expect(this.injector.getDependencies().size()).to.be(3);
			});

		});

		describe('#create', function() {

			it('Should assign an instance into the injector bone');

		});

		describe('#resolve', function() {

			it('Should invoke resolve method on every dependency');

		});

		describe('#inject', function() {

			it('Should inject dependency into targets property on the current bone property');

			it('Should inject dependency and delete partial function as on hold');

		});

		describe('#hold', function() {

			it('Should assign inject method as a partial function in the current dependency');

		});

	});

});
