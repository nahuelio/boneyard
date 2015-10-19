/**
*	com.spinal.ioc.processor.PluginProcessor Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/processor/plugin'], function(PluginProcessor) {

	describe('com.spinal.ioc.processor.PluginProcessor', function() {

		before(function() {
			this.processor = null;
		});

		after(function() {
			delete this.processor;
		});

		describe('#new()', function() {

			it('Should return an instance of PluginProcessor', function() {

			});

		});

		describe('#enqueue', function() {

			it('Should enqueue a plugin as a module inside the engine factory', function() {

			});

		});

		describe('#process', function() {

			it('Should process a plugin annotation', function() {

			});

		});

		describe('#execute', function() {

			it('Should trigger plugin processor execution', function() {

			});

		});

		describe('#done', function() {

			it('Should notify the engine that PluginProcessor complete the task', function() {

			});

		});

	});

});
