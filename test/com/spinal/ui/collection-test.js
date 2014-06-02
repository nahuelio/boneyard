/**
*	com.spinal.ui.Container Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'ui/view',
		'ui/container',
		'util/error/types/ui-exception'], function(Spinal, View, Container, UIException) {

	describe('com.spinal.ui.View', function() {

		before(function() {
			this.body = new Container({ id: 'global', el: 'body' });
			this.viewA = new View({ id: 'A' });
			this.viewB = new View({ id: 'B' });
		});

		describe('#new()', function() {

			it('Should return a new instance of com.spinal.ui.Container', function() {
				this.c = new Container({ id: 'main' });
				this.body.add(this.c);
				expect(this.c).to.be.ok();
				expect(this.c.$el.attr('class')).to.be.equal(this.c.className);
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
