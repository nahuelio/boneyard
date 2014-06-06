/**
*	com.spinal.ui.Container Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	// FIXME: There is an issue here where a Container instance is accidentally
*	// Removing the body of the page or something causing karma to restart and load everything again.
**/
define(['core/spinal',
		'ui/view',
		'ui/container',
		'util/error/types/ui-exception'], function(Spinal, View, Container, UIException) {

	describe('com.spinal.ui.Container', function() {

		beforeEach(function() {
			this.globalbody = new Container({ id: 'global', el: 'body' });
			this.viewA = { id: 'A' };
			this.viewB = { id: 'B' };
			this.viewC = { id: 'C' };
		});

		afterEach(function() {
			delete this.globalbody.removeAll();
		});

		describe('#new()', function() {

			it('Should return a new instance of com.spinal.ui.Container', function() {
				this.testContainer = new Container({ id: 'main' });
				this.globalbody.add(this.testContainer);
				expect(this.testContainer).to.be.ok();
				expect(this.testContainer.$el.attr('class')).to.be.equal(this.testContainer.className);
				expect(this.globalbody.views.size()).to.be.equal(1);
				expect(this.testContainer.views.size()).to.be.equal(0);
				delete this.testContainer.removeAll();
				this.globalbody.removeAll();
			});

			it('Should return a new instance of com.spinal.ui.Container (with Custom Interface)', function() {
				this.testContainer = new Container({ id: 'main', interface: Backbone.View });
				expect(this.testContainer).to.be.ok();
				expect(this.testContainer.views._interface).to.be.equal(Backbone.View);
				delete this.testContainer.removeAll();
			});

			it('Should return a new instance of com.spinal.ui.Container (No Arguments)', function() {
				this.testContainer = new Container();
				expect(this.testContainer).to.be.ok();
				delete this.testContainer.removeAll();
			});

			it('Should throw an Error: Interface specified is unsupported', function() {
				expect(function() {
					new Container({ interface: Spinal.SpinalClass });
				}).to.throwException(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be.equal(UIException.TYPES.InvalidInterfaceType);
				});
			});

		});

		describe('#_valid()', function() {

			it('Should Validate the attributes', function() {
				this.testContainer = new Container({ id: 'main', interface: View });
				var result = this.testContainer._valid();
				delete this.testContainer.removeAll();
			});

		});

		describe('#add()', function() {

			it('Should add views in the container', function() {
				this.testContainer = new Container({ id: 'main', interface: View });
				this.testContainer.off().on(Container.EVENTS.added, function(ev) {
					expect(ev).to.be.ok();
					expect(ev.added).to.be.a(View);
				});
				var view = this.testContainer.add(this.viewA);
				var view2 = this.testContainer.add(this.viewB);
				expect(this.testContainer.views.size()).to.be.equal(2);
				expect(this.testContainer.get(1).id).to.be.equal('B');
				delete this.testContainer.removeAll();
				delete view;
				delete view2;
			});

			it('Should NOT add an existing view in the container', function() {
				this.testContainer = new Container({ id: 'main', interface: View });
				var view = this.testContainer.add(this.viewA);
				var view2 = this.testContainer.add(this.viewA);
				expect(this.testContainer.views.size()).to.be.equal(1);
				expect(this.testContainer.get(0).id).to.be.equal('A');
				delete this.testContainer.removeAll();
				delete view;
			});

			it('Should add a view in the container (with interface)', function() {
				this.testContainer = new Container({ id: 'main', interface: View });
				this.testContainer.off().on(Container.EVENTS.added, function(ev) {
					expect(ev).to.be.ok();
					expect(ev.added.id).to.be.equal('view1');
				});
				var view = this.testContainer.add({ id: 'view1' });
				var view2 = this.testContainer.add({ id: 'view2' }, { silent: true });
				expect(this.testContainer.views.size()).to.be.equal(2);
				expect(this.testContainer.get(1).id).to.be.equal('view2');
				expect(this.testContainer.get(0)).to.be.a(View);
				delete this.testContainer.removeAll();
				delete view;
				delete view2;
			});

			it('Should add a view and render it right away', function() {
				this.testContainer = new Container({ id: 'main', interface: View });
				var view = this.testContainer.add(this.viewA, { renderOnAdd: true });
				var view2 = this.testContainer.add(this.viewB, { renderOnAdd: true, method: View.RENDER.prepend });
				expect(this.testContainer.views.size()).to.be.equal(2);
				expect(this.testContainer.$el.children().first().attr('id')).to.be.equal('B');
				this.testContainer.removeAll();

				var view = this.testContainer.add(this.viewA);
				var view2 = this.testContainer.add(this.viewB, { renderOnAdd: true });
				expect(this.testContainer.views.size()).to.be.equal(2);
				expect(this.testContainer.$el.children().first().attr('id')).to.be.equal('B');
				delete this.testContainer.removeAll();
				delete view;
				delete view2;
			});

		});

		describe('#remove()', function() {

			it('Should remove an existing view from the Container', function() {
				this.testContainer = new Container({ id: 'main', interface: View });
				var viewA = this.testContainer.add(this.viewA);
				var viewB = this.testContainer.add(this.viewB);
				var viewC = this.testContainer.add(this.viewC);
				expect(this.testContainer.views.size()).to.be.equal(3);
				this.testContainer.off().on(Container.EVENTS.removed, function(ev) {
					expect(ev).to.be.ok();
					expect(ev.removed).to.be.ok();
					expect(ev.removed.id).to.be.equal('A');
				});
				var result = this.testContainer.remove(viewA);
				expect(this.testContainer.views.size()).to.be.equal(2);
				var result = this.testContainer.remove(viewC, { silent: true });
				expect(this.testContainer.views.size()).to.be.equal(1);
				var result = this.testContainer.remove(viewB, { detachOnRemove: true, silent: true });
				expect(this.testContainer.views.size()).to.be.equal(0);
				delete this.testContainer.off().removeAll();
				delete viewA;
				delete viewB;
				delete viewC;
			});

			it('Should NOT remove a view: non-existing view', function() {
				this.testContainer = new Container({ id: 'main', interface: View });
				var viewA = this.testContainer.add(this.viewA);
				var viewB = this.testContainer.add(this.viewB);
				var result = this.testContainer.remove({ id: 'non-existent' });
				expect(this.testContainer.views.size()).to.be.equal(2);
				delete this.testContainer.removeAll();
				delete viewA;
				delete viewB;
			});

		});

		describe('#render()', function() {

			it('Should render the views inside the container', function() {
				this.testContainer = new Container({ id: 'render-container', interface: View });
				this.testContainer.off().on(Container.EVENTS.rendered, _.bind(function(ev) {
					expect(ev).to.be.ok();
					expect(ev.view).to.be.ok();
				}, this));
				var viewA = this.testContainer.add(this.viewA),
					viewB = this.testContainer.add(this.viewB);
				var result = this.testContainer.render();
				expect(this.testContainer.$el.find('#A').length).to.be.equal(1);
				expect(this.testContainer.$el.find('#B').length).to.be.equal(1);
				delete this.testContainer.removeAll();
				this.globalbody.views.reset();
				delete viewA;
				delete viewB;
			});

			it('Should render Nested Views and combining (Container in Container and Views in Containers)', function() {
				this.testA = new Container({ id: 'main' });
				this.testB = new Container({ id: 'nested' });
				this.globalbody.add(this.testA);

				this.testA.add(new View(this.viewA));
				this.testA.add(new View(this.viewB));
				this.testA.add(this.testB);
				this.testB.add(new View(this.viewC));
				var result = this.globalbody.render(),
					$viewA = this.globalbody.$el.find('#A');
					$viewC = this.globalbody.$el.find('#C');
				// Checking integrity of the hierarchery reflecting the DOM.
				expect($viewA.length).to.be.equal(1);
				expect($viewC.length).to.be.equal(1);
				expect($viewA.parent().attr('id')).to.be.equal('main');
				expect($viewC.parent().attr('id')).to.be.equal('nested');
				this.globalbody.removeAll();
				delete this.testB.removeAll();
				delete this.testA.removeAll();
			});

		});

		describe('#update()', function() {

			it('Should update() the container and all subviews', function() {
				this.testContainer = new Container({ id: 'main', interface: View });
				var viewA = this.testContainer.add(this.viewA),
					viewB = this.testContainer.add(this.viewB);
				this.globalbody.on(Container.EVENTS.updated, function(ev) {
					expect(ev).to.be.ok();
					expect(ev.view).to.be.ok();
				});
				this.globalbody.add(this.testContainer);
				this.globalbody.render();
				this.globalbody.update();
				this.globalbody.removeAll();
				this.testContainer.off()
				delete this.testContainer.removeAll();
				delete viewA;
				delete viewB;
			});

		});

		describe('#filter()', function() {

			it('Should Filter Views by a condition', function() {
				this.testContainer = new Container({ id: 'main', interface: View });
				var viewA = this.testContainer.add(this.viewA),
					viewB = this.testContainer.add(this.viewB);
					viewC = this.testContainer.add(this.viewC);
				this.globalbody.add(this.testContainer);
				this.globalbody.render();

				var result = this.testContainer.filter(function(view) {
					return (view.id === 'A' || view.id === 'C');
				});
				expect(result).to.be.ok();
				expect(result.length).to.be.equal(2);
				expect(result[1].id).to.be.equal('C');

				this.globalbody.removeAll();
				delete this.testContainer.off().removeAll();
				delete viewA;
				delete viewB;
			});

		});

		describe('#show(), #hide()', function() {

			it('Should show()/hide() the container and all subviews', function() {
				this.testContainer = new Container({ id: 'main', interface: View });
				var viewA = this.testContainer.add(this.viewA),
					viewB = this.testContainer.add(this.viewB);
				this.testContainer.off().on(Container.EVENTS.shown, function(ev) {
					expect(ev).to.be.ok();
					expect(ev.view).to.be.ok();
				});
				this.globalbody.add(this.testContainer);
				this.globalbody.render();
				expect(this.testContainer.hide().$el.is(':visible')).to.be.equal(false);
				expect(this.testContainer.show().$el.is(':visible')).to.be.equal(true);
				this.globalbody.removeAll();
				delete this.testContainer.off().removeAll();
				delete viewA;
				delete viewB;
			});

		});

		describe('#enable(), #disable()', function() {

			it('Should enable()/disable() the container and all subviews', function() {
				this.testContainer = new Container({ id: 'main', interface: View });
				var viewA = this.testContainer.add(this.viewA),
					viewB = this.testContainer.add(this.viewB);
				this.testContainer.off().on(Container.EVENTS.disabled, function(ev) {
					expect(ev).to.be.ok();
					expect(ev.view).to.be.ok();
				}).on(Container.EVENTS.enabled, function(ev) {
					expect(ev).to.be.ok();
					expect(ev.view).to.be.ok();
				});
				this.globalbody.add(this.testContainer);
				this.globalbody.render();
				expect(this.testContainer.disable().$el.attr('disabled')).to.be.equal('disabled');
				expect(this.testContainer.enable().$el.attr('disabled')).to.be.equal(undefined);
				this.globalbody.removeAll();
				delete this.testContainer.off().removeAll();
				delete viewA;
				delete viewB;
			});

		});

		describe('#toString()', function() {

			it('Should return a string representation of the instance of Container', function() {
				this.testContainer = new Container();
				expect(this.testContainer.toString()).to.be.equal('[object Container]');
			});

		});

	});

});
