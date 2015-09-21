/**
*	com.spinal.ioc.engine.helpers.Dependency Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/helpers/dependency',
	'ioc/engine/helpers/injector'], function(Dependency, Injector) {

	describe('com.spinal.ioc.engine.helpers.Dependency', function() {

		before(function() {

		});

		after(function() {

		});

		describe('#new()', function() {

			it('Should return an instance of a dependency');

		});

		describe('#valid()', function() {

			it('Should NOT throw an error: constructor parameters are valid');

			it('Should throw an error: target undefined or target not an object');

			it('Should throw an error: property undefined');

			it('Should throw an error: property on target undefined');

		});

		describe('#getEngine()', function() {

			it('Should return a reference to IoC Engine');

		});

		describe('#resolve()', function() {

			it('Should resolve dependency right away');

			it('Should put the dependency on hold');

		});

		describe('#canResolve()', function() {

			it('Should return true: dependency is not a module');

			it('Should return true: dependency is a module and it\'s available to retrieve');

			it('Should return false: dependency is was not found');

		});

		describe('#get()', function() {

			it('Should return dependency as an object');

			it('Should return dependency method as a function');

			it('Should return null: dependency not found');

		});

		describe('#getId()', function() {

			it('Should return dependency id');

			it('Should return null: dependency expression not valid');

		});

		describe('#getCompound()', function() {

			it('Should return a simple dependency reference');

			it('Should return a complex dependency reference (id and method)');

			it('Should return null: dependency by id not found');

		});

		describe('#getExpression()', function() {

			it('Should return dependency expression');

		});

		describe('#getTarget()', function() {

			it('Should return dependency target');

		});

		describe('#getProperty()', function() {

			it('Should return dependency target property');

		});

	});

});
