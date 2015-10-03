/**
*	com.spinal.ioc.engine.annotation.Ready Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/annotation/ready',
	'specs/simple.spec'], function(Ready, SimpleSpec) {

	describe('com.spinal.ioc.engine.annotation.Ready', function() {

		before(function() {
			this.readySimple = null;
			this.readyAdvanced = null;
		});

		after(function() {
			delete this.readySimple;
		});

		describe('#new()', function() {

			it('Should return an instance of Ready Annotation', function() {
				this.readySimple = new Ready(SimpleSpec.$ready[0]);
				expect(this.readySimple).to.be.ok();

				this.readyAdvanced = new Ready(SimpleSpec.$ready[1]);
				expect(this.readyAdvanced).to.be.ok();
			});

		});

		describe('#getTarget()', function() {

			it('Should retrieve Ready target', function() {});

		});

		describe('#resolve()', function() {

			it('Should resolve ready target bone method\'s reference to the operation', function() {});

		});

		describe('static#only()', function() {
			var result = Ready.only(SimpleSpec);
			expect(result).to.be.ok();
			expect(result.$id).to.be(undefined);
			expect(result.$specs).to.be(undefined);
			expect(result.$plugins).to.be(undefined);
			expect(result.$ready).to.be.ok();
		});

	});

});
