/**
*	com.spinal.ui.View Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'ui/view',
		'ui/container',
		'util/error/types/ui-exception'], function(Spinal, View, Container, UIException) {

	describe('com.spinal.ui.View', function() {

		before(function() {
			this.genericContainer = new Container({ id: 'global', el: 'body', interface: View });
		});

		after(function() {
			this.genericContainer.removeAll();
		});

		describe('#new()', function() {

			it('Should return an instance of View with no arguments', function() {
				this.testView = new View();
				expect(this.testView).to.be.ok();
				expect(this.testView.className).to.be.equal('com-spinal-ui-view');
				expect(this.testView.tagName).to.be.equal('div');
				expect(this.testView.$el.attr('id')).to.be.equal(this.testView.id);
			});

			it('Should return an instance of View with el specified as part of the constructor', function() {
				this.testView = new View({ el: 'body' });
				expect(this.testView).to.be.ok();
				expect(this.testView.className).to.be.equal('com-spinal-ui-view');
				expect(this.testView.$el[0].nodeName.toLowerCase()).to.be.equal('body');
				this.testView = new View({ el: 'p.non-existent' });
				expect(this.testView.el).to.be.equal(undefined);
			});

			it('Should return instance of View with inline template as String', function() {
				this.testView = new View({
					template: '<input class="test" />'
				});
				expect(this.testView).to.be.ok();
				expect(this.testView.template).to.be.a(Function);
				expect(this.testView.$el[0].nodeName.toLowerCase()).to.be.equal('div');
				expect($(this.testView.template({}))[0].nodeName.toLowerCase()).to.be.equal('input');
			});

			it('Should return instance of View with precompiled inline template as Function', function() {
				this.testView = new View({
					template: _.template('<input class="{{className}}" />')
				});
				expect(this.testView).to.be.ok();
				expect(this.testView.template).to.be.a(Function);
				expect(this.testView.$el[0].nodeName.toLowerCase()).to.be.equal('div');
				var result = this.testView.template({ className: 'test' });
				expect($(result)[0].nodeName.toLowerCase()).to.be.equal('input');
				expect($(result).hasClass('test')).to.be.equal(true);
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
					method: View.RENDER.prependTo
				});
				expect(this.testView).to.be.ok();
				expect(this.testView.method).to.be.equal(View.RENDER.prependTo);
			});

			it('Should throw an Error: new View() with id type number instead of string', function() {
				expect(function() {
					new View({ id: 1 });
				}).to.throwException(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be.equal(UIException.TYPES.InvalidIDType);
				});
			});

			it('Should throw an Error: model is not an instance of Backbone.Model', function() {
				expect(_.bind(function() {
					new View({ model: new Spinal.SpinalClass({ name: 'foo' }) });
				}, this)).to.throwException(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be.equal(UIException.TYPES.InvalidModelType);
				});
			});

			it('Should throw an Error: Passed unexistent (unsupported) method as parameter to the View constructor', function() {
				expect(_.bind(function() {
					new View({ method: 'non-existent' });
				}, this)).to.throwException(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be.equal(UIException.TYPES.UnsupportedRenderMethod);
				});
			});

		});

		describe('#render()', function() {

			it('Should render a View instance', function() {
				this.testView = { id: 'render-test' };
				var view = this.genericContainer.add(this.testView);
				view.off().on(View.EVENTS.rendered, function(ev) {
					expect(ev).to.be.ok();
					expect(ev.view).to.be.ok();
					expect(ev.view.$el.attr('class')).to.be.equal('com-spinal-ui-view');
				});
				var result = view.render();
				expect(result).to.be.ok();
				expect(result).to.be.a(View);
				expect(this.genericContainer.$el.find('div#render-test').length).to.be.equal(1);
				// Silent (No event triggering)
				view.render({ silent: true });
				expect(this.genericContainer.$el.find('div#render-test').length).to.be.equal(1);
				this.genericContainer.removeAll();
				delete view;
			});

			it('Should render a View instance with method inline', function() {
				this.testView = { id: 'append-test' };
				this.testView2 = { id: 'prepend-test' };
				var view = this.genericContainer.add(this.testView);
				var view2 = this.genericContainer.add(this.testView2);
				view.render(); // Default 'append' method defined in View Class
				view2.render({ method: View.RENDER.prepend }); // Override Render method explicity to prepend
				expect(this.genericContainer.views.size()).to.be.equal(2);
				expect(this.genericContainer.$el.children().first().attr('id')).to.be.equal('prepend-test');
				this.genericContainer.removeAll();
				delete view;
				delete view2;
			});

			it('Should render a View instance with template', function() {
				this.testView = { template: '<input class="test" />' };
				var view = this.genericContainer.add(this.testView);
				var result = view.render();
				expect(result).to.be.ok();
				expect(result.template).to.be.a(Function);
				expect(result.$el.find('input').hasClass('test')).to.be.equal(true);
				expect(this.genericContainer.$el.find('.com-spinal-ui-view').length).to.be.equal(1);
				expect(this.genericContainer.$el.find('#' + view.id).length).to.be.equal(1);
				this.genericContainer.removeAll();
				delete view;
			});

			it('Should render a View instance with template + model data', function() {
				this.testView = {
					model: new Backbone.Model({ name: 'Hello Spinal!' }),
					template: '<p>{{name}}</p>'
				};
				var view = this.genericContainer.add(this.testView);
				var result = view.render();
				expect(result).to.be.ok();
				expect(result.model).to.be.a(Backbone.Model);
				expect(result.template).to.be.a(Function);
				expect(view.$el.find('p').text()).to.be.equal(view.model.get('name'));
				this.genericContainer.removeAll();
				delete view;
			});

			it('Should render a View instance with template + model data provided by the successor', function() {
				var temporalContainer = new Container({
					id: 'global-temporal',
					el: 'body',
					model: new Backbone.Model({ name: 'Hello Spinal from successor!' }),
					interface: View
				});
				this.testView = { template: '<p>{{name}}</p>' };
				var view = temporalContainer.add(this.testView);
				var result = view.render();
				expect(result).to.be.ok();
				expect(result.model).not.be.ok();
				expect(temporalContainer.model).to.be.ok();
				expect(view.$el.find('p').text()).to.be.equal(temporalContainer.model.get('name'));
				temporalContainer.removeAll();
				delete view;
			});

			it('Should throw an Error: Unable to render the View due to the successor ref is not defined.', function() {
				expect(_.bind(function() {
					new View({ id: 'view-error-no-successor-defined' }).render();
				}, this)).to.throwException(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be.equal(UIException.TYPES.SuccessorNotSpecified);
				});
			});

			it('Should throw an Error [EDGE CASE]: _successor is not an instance of com.spinal.ui.Container', function() {
				expect(_.bind(function() {
					var test = new View({ id: 'view-error' });
					// trying to inject a successor reference by settting the prop explicitly
					test._successor = new Spinal.SpinalClass({ name: 'no-valid' });
					test.render();
				}, this)).to.throwException(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be.equal(UIException.TYPES.InvalidSuccessorType);
				});
			});

			it('Should throw an Error [EDGE CASE]: _successor property is explicitly defined as a com.spinal.ui.Container, but NOT added in the Container', function() {
				expect(_.bind(function() {
					var test = new View({ id: 'view-error' });
					// trying to inject a successor reference by settting the prop explicitly
					test._successor = new Container({ id: 'container-declared-inline', el: 'body' });
					test.render();
				}, this)).to.throwException(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be.equal(UIException.TYPES.UIStackViolation);
				});
			});

		});

		describe('#update()', function() {

			it('Should update the View and return the instance', function() {
				this.testView = { id: 'test-update'};
				var view = this.genericContainer.add(this.testView);
				view.off().on(View.EVENTS.updated, function(ev) {
					expect(ev).to.be.ok();
					expect(ev.view).to.be.ok();
				});
				var result = view.update();
				expect(result).to.be.a(View);
				result = view.update({ silent: true });
				this.genericContainer.removeAll();
				delete view;
			});

		});

		describe('#lookup()', function() {

			it('Should return the successor instance', function() {
				this.testView = { id: 'child-of-global'};
				var view = this.genericContainer.add(this.testView);
				var result = view.lookup('child-of-global');
				expect(result).to.be.ok();
				expect(result.id).to.be.equal('child-of-global');
				expect(view._successor).to.be.a(Container);
				this.genericContainer.removeAll();
				delete view;
			});

			it('Should NOT return the successor instance (null)', function() {
				this.testView = { id: 'child-of-global' };
				var view = this.genericContainer.add(this.testView);
				var result = view.lookup('non-existent');
				expect(result).to.be.equal(null);
				result = view.lookup();
				expect(result).to.be.equal(null);
				this.genericContainer.removeAll();
				delete view;
			});

		});

		describe('#show()', function() {

			it('Should show the view', function() {
				this.testView = { id: 'show-test' };
				var view = this.genericContainer.add(this.testView);
				this.genericContainer.render();
				view.off().on(View.EVENTS.shown, function(ev) { expect(ev).to.be.ok(); });
				var result = view.show();
				console.log('HELLO');
				result = view.show({ silent: true });
				this.genericContainer.removeAll();
				delete view;
			});

		});

		describe('#hide()', function() {

			it('Should hide the view', function() {
				this.testView = { id: 'hide-test' };
				var view = this.genericContainer.add(this.testView);
				this.genericContainer.render();
				view.off().on(View.EVENTS.hidden, function(ev) { expect(ev).to.be.ok(); });
				var result = view.hide();
				result = view.hide({ silent: true });
				this.genericContainer.removeAll();
				delete view;
			});

		});

		describe('#enable()', function() {

			it('Should enable the view', function() {
				this.testView = new View();
				this.testView.off().on(View.EVENTS.enabled, function(ev) { expect(ev).to.be.ok(); });
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
				this.testView.off().on(View.EVENTS.disabled, function(ev) { expect(ev).to.be.ok(); });
				var result = this.testView.disable();
				result = this.testView.disable({ silent: true });
				expect(this.testView.$el.attr('disabled')).to.be.equal('disabled');
			});

		});

		describe('#detach()', function() {

			it('Should detach the dom (el) from the view instance', function() {
				this.testView = new View({ id: 'to-detach' });
				this.genericContainer.add(this.testView);
				this.testView.off().on(View.EVENTS.detached, function(ev) { expect(ev).to.be.ok(); });
				var result = this.testView.detach({ silent: true });
				this.genericContainer.removeAll();
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
