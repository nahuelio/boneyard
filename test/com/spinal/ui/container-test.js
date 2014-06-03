/**
*	com.spinal.ui.Container Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'ui/view',
		'ui/container',
		'util/error/types/ui-exception'], function(Spinal, View, Container, UIException) {

	describe('com.spinal.ui.Container', function() {

		before(function() {
			this.globalbody = new Container({ id: 'global', el: 'body' });
			this.viewA = new View({ id: 'A' });
			this.viewB = new View({ id: 'B' });
		});

		after(function() {
			delete this.globalbody.detach();
			delete this.viewA.detach();
			delete this.viewB.detach();
		});

		describe('#new()', function() {

			it('Should return a new instance of com.spinal.ui.Container', function() {
				this.testContainer = new Container({ id: 'main' });
				this.globalbody.add(this.testContainer);
				expect(this.testContainer).to.be.ok();
				expect(this.testContainer.$el.attr('class')).to.be.equal(this.testContainer.className)
			});

		});

		describe('#add()', function() {

		});

		describe('#remove()', function() {

		});

		describe('#findBy()', function() {

		});

		describe('#findById()', function() {

		});

		describe('#invoke()', function() {

		});

		describe('#show()', function() {

		});

		describe('#hide()', function() {

		});

		describe('#enable()', function() {

		});

		describe('#disable()', function() {

		});

		describe('#detach()', function() {

		});

		describe('#toString()', function() {

		});
	});

});
