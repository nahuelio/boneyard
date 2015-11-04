/**
*	com.boneyard.ui.View Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/boneyard',
		'ui/view',
		'ui/container',
		'util/exception/ui/ui'], function(Boneyard, View, Container, UIException) {

	describe('com.boneyard.ui.View', function() {

		beforeEach(function() {
			$('div.global').remove();
			$('body').append('<div class="global"></div>');
			this.cglobal = new Container({ id: 'global', el: 'div.global', interface: View });
		});

		afterEach(function() {
			this.cglobal.removeAll();
			delete this.cglobal.detach();
		});

		describe('#new()', function() {

			it('Should return an instance of View with no arguments', function() {
				this.testView = new View();
				expect(this.testView).to.be.ok();
				expect(this.testView.className).to.be.equal('ui-view');
				expect(this.testView.tagName).to.be.equal('div');
				expect(this.testView.$el.attr('id')).to.be.equal(undefined);
			});

			it('Should return an instance of View with el specified as part of the constructor', function() {
				this.testView = new View({ el: 'body' });
				expect(this.testView).to.be.ok();
				expect(this.testView.className).to.be.equal('ui-view');
				expect(this.testView.$el[0].nodeName.toLowerCase()).to.be.equal('body');
				this.testView = new View({ el: 'p.non-existent' });
				expect(this.testView.el).to.be.equal(undefined);
			});

			it('Should return instance of View with inline template as String', function() {
				this.testView = new View({ template: '<input class="test" />' });
				expect(this.testView).to.be.ok();
				expect(this.testView.html).to.be.a(Function);
				expect(this.testView.$el[0].nodeName.toLowerCase()).to.be.equal('div');
				this.testView.template();
				expect(this.testView.$el.children()[0].nodeName.toLowerCase()).to.be.equal('input');
			});

			it('Should throw an Error: template passed as constructor param is not a string', function() {
				expect(function() {
					new View({ template: _.template('<input class="<%= className %>" />') });
				}).to.throwException(function(e) {
					expect(e.message).to.be(UIException.TYPES.InvalidTemplateFormat({}));
				});
			});

			it('Should return instance of View passing a model)', function() {
				this.testView = new View({
					model: new Backbone.Model({ name: 'foo' })
				});
				expect(this.testView).to.be.ok();
				expect(this.testView.model.get('name')).to.be.equal('foo');
			});

			it('Should return instance of View (successor + valid render method)', function() {
				this.testView = new View({
					method: View.RENDER.prepend
				});
				expect(this.testView).to.be.ok();
				expect(this.testView.method).to.be.equal(View.RENDER.prepend);
			});

			it('Should throw an Error: new View() with id type number instead of string', function() {
				expect(function() {
					new View({ id: 1 });
				}).to.throwException(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be.equal(UIException.getMessage('InvalidIDType'));
				});
			});

			it('Should throw an Error: model is not an instance of Backbone.Model', function() {
				expect(_.bind(function() {
					new View({ model: new Boneyard.Class({ name: 'foo' }) });
				}, this)).to.throwException(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be.equal(UIException.getMessage('InvalidModelType'));
				});
			});

			it('Should throw an Error: Passed unexistent (unsupported) method as parameter to the View constructor', function() {
				expect(_.bind(function() {
					new View({ method: 'non-existent-method' });
				}, this)).to.throwException(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be.equal(UIException.getMessage('UnsupportedRenderMethod', { method: 'non-existent-method' }));
				});
			});

		});

		describe('#render()', function() {

			it('Should render a View instance', function() {
				this.testView = { id: 'render-test' };
				var view = this.cglobal.add(this.testView);
				view.off().on(View.EVENTS.render, function(view) {
					expect(view).to.be.ok();
					expect(view).to.be.a(View);
					expect(view.$el.attr('class')).to.be.equal('ui-view');
				});
				var result = view.render();
				expect(result).to.be.ok();
				expect(result).to.be.a(View);
				expect(this.cglobal.$el.find('div#render-test').length).to.be.equal(1);
				// Silent (No event triggering)
				view.render({ silent: true });
				expect(this.cglobal.$el.find('div#render-test').length).to.be.equal(1);
				this.cglobal.removeAll();
				delete view;
			});

			it('Should render a View instance with method inline', function() {
				this.testView = { id: 'append-test' };
				this.testView2 = { id: 'prepend-test' };
				var view = this.cglobal.add(this.testView);
				var view2 = this.cglobal.add(this.testView2);
				view.render(); // Default 'append' method defined in View Class
				view2.render({ method: View.RENDER.prepend }); // Override Render method explicity to prepend
				expect(this.cglobal.views.size()).to.be.equal(2);
				expect(this.cglobal.$el.children().first().attr('id')).to.be.equal('prepend-test');
				this.cglobal.removeAll();
				delete view;
				delete view2;
			});

			// FIXME: Missing Method Types Support (append and prepend work, but prependTo, appendTo and HTML won't)!

			it('Should render a View instance with template', function() {
				this.testView = { template: '<input class="test" />' };
				var view = this.cglobal.add(this.testView);
				var result = view.render();
				expect(result).to.be.ok();
				expect(result.template).to.be.a(Function);
				expect(result.$el.find('input').hasClass('test')).to.be.equal(true);
				expect(this.cglobal.$el.find('.ui-view').length).to.be.equal(1);
				this.cglobal.removeAll();
				delete view;
			});

			it('Should throw an Error: Unable to render the View due to the successor ref is not defined.', function() {
				expect(_.bind(function() {
					new View({ id: 'view-error-no-successor-defined' }).render();
				}, this)).to.throwException(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be.equal(UIException.getMessage('SuccessorNotSpecified'));
				});
			});

			it('Should throw an Error [EDGE CASE]: _successor is not an instance of com.boneyard.ui.Container', function() {
				expect(_.bind(function() {
					var test = new View({ id: 'view-error' });
					// trying to inject a successor reference by settting the prop explicitly
					test._parent = new Boneyard.Class({ name: 'no-valid' });
					test.render();
				}, this)).to.throwException(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be.equal(UIException.getMessage('InvalidSuccessorType'));
				});
			});

			it('Should throw an Error [EDGE CASE]: _successor property is explicitly defined as a com.boneyard.ui.Container, but NOT added in the Container', function() {
				expect(_.bind(function() {
					var test = new View({ id: 'view-error' });
					// trying to inject a successor reference by settting the prop explicitly
					test._parent = new Container({ id: 'container-declared-inline', el: 'body' });
					test.render();
				}, this)).to.throwException(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be.equal(UIException.getMessage('UIStackViolation', { viewId: 'view-error', succesorId: 'container-declared-inline' }));
				});
			});

		});

		describe('#update()', function() {

			it('Should update the View and return the instance', function() {
				this.testView = { id: 'test-update'};
				var view = this.cglobal.add(this.testView);
				view.off().on(View.EVENTS.update, function(view) {
					expect(view).to.be.ok();
					expect(view).to.be.a(View);
				});
				var result = view.update();
				expect(result).to.be.a(View);
				result = view.update({ silent: true });
				this.cglobal.removeAll();
				delete view;
			});

		});

		describe('#lookup()', function() {

			it('Should return the parent instance', function() {
				this.testView = { id: 'child-of-global'};
				var view = this.cglobal.add(this.testView);
				var result = view.lookup(function(v) { return (v.id === 'child-of-global'); });
				expect(result).to.be.ok();
				expect(result.id).to.be.equal('child-of-global');
				expect(view._parent).to.be.a(Container);
				this.cglobal.removeAll();
				delete view;
			});

			it('Should NOT return the parent instance (null)', function() {
				this.testView = { id: 'child-of-global' };
				var view = this.cglobal.add(this.testView);
				var result = view.lookup(function(v) { return (v.id === 'non-existent'); });
				expect(result).to.be.equal(null);
				result = view.lookup();
				expect(result).to.be.equal(null);
				this.cglobal.removeAll();
				delete view;
			});

		});

		describe('#show()', function() {

			it('Should show the view', function() {
				this.testView = { id: 'show-test' };
				var view = this.cglobal.add(this.testView);
				this.cglobal.render();
				view.off().on(View.EVENTS.shown, function(ev) { expect(ev).to.be.ok(); });
				var result = view.show();
				result = view.show({ silent: true });
				this.cglobal.removeAll();
				delete view;
			});

		});

		describe('#hide()', function() {

			it('Should hide the view', function() {
				this.testView = { id: 'hide-test' };
				var view = this.cglobal.add(this.testView);
				this.cglobal.render();
				view.off().on(View.EVENTS.hide, function(ev) { expect(ev).to.be.ok(); });
				var result = view.hide();
				result = view.hide({ silent: true });
				this.cglobal.removeAll();
				delete view;
			});

		});

		describe('#enable()', function() {

			it('Should enable the view', function() {
				this.testView = new View();
				this.testView.off().on(View.EVENTS.enable, function(ev) { expect(ev).to.be.ok(); });
				var result = this.testView.enable();
				this.testView.disable();
				expect(this.testView.$el.attr('disabled')).to.be.equal('disabled');
				result = this.testView.enable({ silent: true });
				expect(this.testView.$el.attr('disabled')).to.be.equal(undefined);
			});

		});

		describe('#disable()', function() {

			it('Should disable the view', function() {
				this.testView = new View();
				this.testView.off().on(View.EVENTS.disable, function(ev) { expect(ev).to.be.ok(); });
				var result = this.testView.disable();
				result = this.testView.disable({ silent: true });
				expect(this.testView.$el.attr('disabled')).to.be.equal('disabled');
			});

		});

		describe('#detach()', function() {

			it('Should detach the dom (el) from the view instance', function() {
				this.testView = new View({ id: 'to-detach' });
				this.cglobal.add(this.testView);
				this.testView.off().on(View.EVENTS.detach, function(ev) { expect(ev).to.be.ok(); });
				var result = this.testView.detach({ silent: true });
				this.cglobal.removeAll();
			});

		});

		describe('#toString()', function() {

			it('Should return a string representation of the instance of view', function() {
				this.testView = new View();
				expect(this.testView.toString()).to.be.equal('[object View]');
			});

		});

	});

});
