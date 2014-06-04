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
				expect(this.testContainer.$el.attr('class')).to.be.equal(this.testContainer.className);
				expect(this.globalbody.views.size()).to.be.equal(1);
				expect(this.testContainer.views.size()).to.be.equal(0);
				delete this.testContainer.detach();
				this.globalbody.detach();
			});

			it('Should return a new instance of com.spinal.ui.Container (with Interface)', function() {
				this.testContainer = new Container({ id: 'main', interface: View });
				expect(this.testContainer).to.be.ok();
				expect(this.testContainer.views._interface).to.be.equal(View);
				delete this.testContainer.detach();
			});

			it('Should return a new instance of com.spinal.ui.Container (No Arguments)', function() {
				this.testContainer = new Container();
				expect(this.testContainer).to.be.ok();
				delete this.testContainer.detach();
			});

		});

		describe('#add()', function() {

			it('Should add views in the container', function() {
				this.testContainer = new Container({ id: 'main' });
				this.testContainer.off().on(Container.EVENTS.added, function(ev) {
					expect(ev).to.be.ok();
					expect(ev.added).to.be.a(View);
				});
				this.testContainer.add(this.viewA).add(this.viewB);
				expect(this.testContainer.views.size()).to.be.equal(2);
				expect(this.testContainer.get(1).id).to.be.equal('B');
				delete this.testContainer.detach();
			});

			it('Should NOT add an existing view in the container', function() {
				this.testContainer = new Container({ id: 'main' });
				this.testContainer.add(this.viewA).add(this.viewA);
				expect(this.testContainer.views.size()).to.be.equal(1);
				expect(this.testContainer.get(0).id).to.be.equal('A');
				delete this.testContainer.detach();
			});

			it('Should add a view in the container (with interface)', function() {
				this.testContainer = new Container({ id: 'main', interface: View });
				this.testContainer.off().on(Container.EVENTS.added, function(ev) {
					expect(ev).to.be.ok();
					expect(ev.added.id).to.be.equal('view1');
				});
				this.testContainer.add({ id: 'view1' }).add({ id: 'view2' }, { silent: true });
				expect(this.testContainer.views.size()).to.be.equal(2);
				expect(this.testContainer.get(1).id).to.be.equal('view2');
				expect(this.testContainer.get(0)).to.be.a(View);
				delete this.testContainer.detach();
			});

			it('Should add a view and render it right away', function() {
				this.testContainer = new Container({ id: 'main', interface: View });
				//this.testContainer.add({ id: 'view1' }, { renderOnAdd: true });
				//this.testContainer.add({ id: 'view2' }, { renderOnAdd: true, method: View.RENDER.prepend });
				//expect(this.testContainer.views.size()).to.be.equal(2);
				// FIXME: Collection.add should return the element added but with support for Interface.
				delete this.testContainer.detach();
			});

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
