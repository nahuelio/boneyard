/**
*	com.boneyard.ui.Container Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/boneyard',
		'ui/view',
		'ui/container',
		'util/exception/ui/ui'], function(Boneyard, View, Container, UIException) {

	describe('com.boneyard.ui.Container', function() {

		before(function() {
			$('body').append('<div class="global"></div>');
		});

		after(function() {
			delete this.cglobal.detach();
		});

		beforeEach(function() {
			this.cglobal = new Container({ id: 'global', el: 'div.global' });
			this.viewA = { id: 'A' };
			this.viewB = { id: 'B' };
			this.viewC = { id: 'C' };
			this.viewD = { id: 'D' };
		});

		afterEach(function() {
			this.cglobal.removeAll();
		});

		describe('#new()', function() {

			it('Should return a new instance of a Container', function() {
				this.testContainer = new Container({ id: 'main' });
				this.cglobal.add(this.testContainer);
				expect(this.testContainer).to.be.ok();
				expect(this.testContainer.$el.attr('class')).to.be.equal(this.testContainer.className);
				expect(this.cglobal.views.size()).to.be.equal(1);
				expect(this.testContainer.views.size()).to.be.equal(0);
				delete this.testContainer.removeAll();
				this.cglobal.removeAll();
			});

			it('Should return a new instance of a Container (with Custom Interface)', function() {
				this.testContainer = new Container({ id: 'main', interface: View });
				expect(this.testContainer).to.be.ok();
				expect(this.testContainer.views._interface).to.be.equal(View);
				delete this.testContainer.removeAll();
			});

			it('Should return a new instance of a Container (with model argument)', function() {
				var testContainer = new Container({ id: 'main', model: new Backbone.Model() });
				expect(testContainer).to.be(testContainer);
				expect(testContainer.model).to.be.a(Backbone.Model);
			});

			it('Should return a new instance of com.boneyard.ui.Container (No Arguments)', function() {
				this.testContainer = new Container();
				expect(this.testContainer).to.be.ok();
				delete this.testContainer.removeAll();
			});

			it('Should throw an Error: Interface specified is unsupported', function() {
				expect(function() {
					new Container({ interface: Boneyard.Class });
				}).to.throwException(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be.equal(UIException.TYPES.InvalidInterfaceType());
				});
			});

			it('Should throw an error: collection model is not Backbone.Collection type', function() {
				expect(_.bind(function() {
					new Container({ id: 'main', collection: new Backbone.Model() });
				}, this)).to.throwException(_.bind(function(e) {
					expect(e.message).to.be(UIException.TYPES.InvalidModelType());
				}, this));
			});

		});

		describe('#_valid()', function() {

			it('Should throw an Error: Validate undefined attributes', function() {
				this.testContainer = new Container({ id: 'main', interface: View });
				expect(_.bind(function() {
					this.testContainer._valid();
				}, this)).to.throwException(_.bind(function(e) {
					expect(e).to.be.ok();
					delete this.testContainer.removeAll();
				}, this));
			});

		});

		describe('#lookup', function() {

			it('Should perform a lookup using top-down direction', function() {
				this.testContainer = new Container({ id: 'main' });
				this.A = new Container({ id: 'cA', interface: View });
				this.B = new Container({ id: 'cB' });
				this.C = new Container({ id: 'cC', interface: View });
				// Build Parent-Child relationship
				this.A.addAll([this.viewA, this.viewD]);
				this.B.add(this.C);
				this.C.addAll([this.viewB, this.viewC]);
				this.testContainer.addAll([this.A, this.B], { renderOnAdd: true });
				var found = this.testContainer.lookup(function(v) { return (v.id === 'B'); }, Container.LOOKUP.descendant);
				expect(found).to.be.ok();
				expect(found.id).to.be.equal('B');
				// Lookup on Container B (subview of testContainer)
				found = this.B.lookup(function(v) { return (v.id === 'cC'); }, Container.LOOKUP.descendant);
				expect(found).to.be.ok();
				expect(found.id).to.be.equal('cC');
				// Not found
				found = this.testContainer.lookup(function(v) { return (v.id === 'non-existent'); }, Container.LOOKUP.descendant);
				expect(found).not.be.ok();
				delete this.testContainer.removeAll();
			});

			it('Should not perform a lookup (finder null or not defined)', function() {
				this.testContainer = new Container({ id: 'main' });
				this.A = new Container({ id: 'cA', interface: View });
				this.B = new Container({ id: 'cB' });
				this.C = new Container({ id: 'cC', interface: View });
				// Build Parent-Child relationship
				this.A.addAll([this.viewA, this.viewD]);
				this.B.add(this.C);
				this.C.addAll([this.viewB, this.viewC]);
				this.testContainer.addAll([this.A, this.B], { renderOnAdd: true });

				var result = this.testContainer.findDeep(undefined, Container.LOOKUP.descendant);
				expect(result).not.be.ok();

				delete this.testContainer.removeAll();
			});

		});

		describe('#add()', function() {

			it('Should add views in the container', function() {
				this.testContainer = new Container({ id: 'main', interface: View });
				this.testContainer.off().on(Container.EVENTS.add, function(ev) {
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
				this.testContainer.off().on(Container.EVENTS.add, function(ev) {
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
				this.testContainer.off().on(Container.EVENTS.remove, function(ev) {
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
				delete this.testContainer.detach();
				delete viewA;
				delete viewB;
			});

		});

		describe('#find()', function() {

			it('Should find a view by predicate', function() {
				this.testContainer = new Container({ id: 'main', interface: View });
				var viewA = this.testContainer.add(this.viewA);
				var viewB = this.testContainer.add(this.viewB);
				var viewC = this.testContainer.add(this.viewC);

				var result = this.testContainer.find(function(view) { return (view.id === 'B') ? view : null; });
				expect(result).to.be.a(View);
				expect(result.id).to.be('B');
				this.testContainer.removeAll();
			});

			it('Should NOT find a view by predicate (predicate null or not defined)', function() {
				this.testContainer = new Container({ id: 'main', interface: View });
				var viewA = this.testContainer.add(this.viewA);
				var viewB = this.testContainer.add(this.viewB);
				var viewC = this.testContainer.add(this.viewC);

				var result = this.testContainer.find();
				expect(result).not.be.ok();
				this.testContainer.removeAll({ silent: true });
			});

		});

		describe('#findById', function() {

			it('Should NOT find by id (id is null or not defined)', function() {
				this.testContainer = new Container({ id: 'main', interface: View });
				var viewA = this.testContainer.add(this.viewA);
				var viewB = this.testContainer.add(this.viewB);
				var viewC = this.testContainer.add(this.viewC);

				var result = this.testContainer.findById();
				expect(result).not.be.ok();
				this.testContainer.removeAll();
			});

		});

		describe('#_targetEl()', function() {

			it('Should resolver target when method after or before are used with target', function() {
				this.testContainer = new Container({ id: 'container' });
				this.testViewA = new View({ id: 'A' });
				this.testViewB = new View({ id: 'B' });
				this.testContainer.addAll([this.testViewA, this.testViewB]);
				this.testContainer.render();
				expect(this.testContainer._targetEl(this.testContainer, {
					target: 'div#B', method: View.RENDER.before
				}).attr('id')).to.be('B');
				expect(this.testContainer._targetEl(this.testContainer, {
					target: 'div#A', method: View.RENDER.after
				}).attr('id')).to.be('A');
			});

			it('Should NOT resolve target when method after or before are used with no target (or options)', function() {
				// No options
				this.testContainer = new Container({ id: 'main', method: View.RENDER.before });
				expect(this.testContainer._targetEl(this.testContainer).attr('id')).to.be('main');
			});

		});

		describe('#render()', function() {

			it('Should render the views inside the container', function() {
				this.testContainer = new Container({ id: 'render-container', interface: View });
				this.testContainer.off().on(Container.EVENTS.render, _.bind(function(container) {
					expect(container).to.be.ok();
					expect(container).to.be.a(Container);
				}, this));
				var viewA = this.testContainer.add(this.viewA),
					viewB = this.testContainer.add(this.viewB);
				var result = this.testContainer.render();
				expect(this.testContainer.$el.find('#A').length).to.be.equal(1);
				expect(this.testContainer.$el.find('#B').length).to.be.equal(1);
				delete this.testContainer.detach();
				delete viewA;
				delete viewB;
			});

			it('Should render Nested Views and combining (Container in Container and Views in Containers)', function() {
				this.testA = new Container({ id: 'main' });
				this.testB = new Container({ id: 'nested' });
				this.cglobal.add(this.testA);

				this.testA.add(new View(this.viewA));
				this.testA.add(new View(this.viewB));
				this.testA.add(this.testB);
				this.testB.add(new View(this.viewC));
				var result = this.cglobal.render(),
					$viewA = this.cglobal.$el.find('#A');
					$viewC = this.cglobal.$el.find('#C');
				// Checking integrity of the hierarchery reflecting the DOM.
				expect($viewA.length).to.be.equal(1);
				expect($viewC.length).to.be.equal(1);
				expect($viewA.parent().attr('id')).to.be.equal('main');
				expect($viewC.parent().attr('id')).to.be.equal('nested');
				this.cglobal.removeAll();
				delete this.testB.removeAll();
				delete this.testA.removeAll();
			});

		});

		describe('#update()', function() {

			it('Should update() the container and all subviews', function() {
				this.testContainer = new Container({ id: 'main', interface: View });
				var viewA = this.testContainer.add(this.viewA),
					viewB = this.testContainer.add(this.viewB);
				this.cglobal.on(Container.EVENTS.update, function(container) {
					expect(container).to.be.ok();
					expect(container).to.be.a(Container);
				});
				this.cglobal.add(this.testContainer);
				this.cglobal.render();
				this.cglobal.update();
				this.cglobal.removeAll();
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
				this.cglobal.add(this.testContainer);
				this.cglobal.render();

				var result = this.testContainer.filter(function(view) {
					return (view.id === 'A' || view.id === 'C');
				});
				expect(result).to.be.ok();
				expect(result.length).to.be.equal(2);
				expect(result[1].id).to.be.equal('C');

				this.cglobal.removeAll();
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
				this.testContainer.off().on(Container.EVENTS.show, function(ev) {
					expect(ev).to.be.ok();
					expect(ev.view).to.be.ok();
				});
				this.cglobal.add(this.testContainer);
				this.cglobal.render();
				expect(this.testContainer.hide().$el.is(':visible')).to.be.equal(false);
				expect(this.testContainer.show().$el.is(':visible')).to.be.equal(true);
				this.cglobal.removeAll();
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
				this.testContainer.off().on(Container.EVENTS.disable, function(ev) {
					expect(ev).to.be.ok();
					expect(ev.view).to.be.ok();
				}).on(Container.EVENTS.enable, function(ev) {
					expect(ev).to.be.ok();
					expect(ev.view).to.be.ok();
				});
				this.cglobal.add(this.testContainer);
				this.cglobal.render();
				expect(this.testContainer.disable().$el.attr('disabled')).to.be.equal('disabled');
				expect(this.testContainer.enable().$el.attr('disabled')).to.be.equal(undefined);
				this.cglobal.removeAll();
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
