/**
*	com.spinal.ioc.engine.helpers.Spec Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/helpers/spec'], function(Spec) {

	describe('com.spinal.ioc.engine.helpers.Spec', function() {

		before(function() {

		});

		beforeEach(function() {

		});

		afterEach(function() {

		});

		after(function() {

		});

		describe('#new()', function() {

			it('Should return an instance of Spec');

		});

		describe('#valid()', function() {

			it('Should throw an error: spec $id not defined in constructor parameters');

			it('Should throw an error: parent $specs defined but not array type');

		});

		describe('#getId()', function() {

			it('Should retrieve spec $id');

		});

		describe('#getDependencies()', function() {

			it('Should retrieve array of parent specs dependencies');

		});

		describe('#parse()', function() {

			it('Should parse bones and operations');

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

		describe('#hasDependencies()', function() {

			it('Should retrieve true if specs has parent specs dependencies');

			it('Should retrieve false if specs doesn\'t have parent specs dependencies');

		});

		describe('static#only()', function() {

			it('Should retrieve an object only spec properties ($id and $specs) from spec');

		});

	});

});
