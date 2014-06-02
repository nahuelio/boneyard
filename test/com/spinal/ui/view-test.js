/**
*	com.spinal.ui.View Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	FIXME:
*		- Fix Test case on render, when model + template inline is specified.
**/
define(['core/spinal',
		'ui/view',
		'ui/container',
		'util/error/types/ui-exception'], function(Spinal, View, Container, UIException) {

	describe('com.spinal.ui.View', function() {

		before(function() {
			this.genericContainer = new Container({ id: 'global', el: 'body' });
		});

		afterEach(function() {
			if(this.testView) delete this.testView.detach();
		});

		describe('#new()', function() {

			it('Should return an instance of View with no arguments', function() {
				this.testView = new View();
				expect(this.testView).to.be.ok();
				expect(this.testView.className).to.be.equal('com:spinal:ui:view');
				expect(this.testView.tagName).to.be.equal('div');
				expect(this.testView.$el.attr('id')).to.be.equal(this.testView.id);
			});

			it('Should return an instance of View with el specified as a jquery type instance', function() {
				this.testView = new View({ el: $('html') });
				expect(this.testView).to.be.ok();
				expect(this.testView.className).to.be.equal('com:spinal:ui:view');
				expect(this.testView.$el[0].nodeName.toLowerCase()).to.be.equal('html');
				this.testView = new View({ el: $('p.non-existent') });
				expect(this.testView.$el[0].nodeName.toLowerCase()).to.be.equal('div');
			});

			it('Should return instance of View with inline template', function() {
				this.testView = new View({
					template: '<input class="test" />'
				});
				expect(this.testView).to.be.ok();
				expect($(this.testView.template({}))[0].nodeName.toLowerCase()).to.be.equal('input');
				expect($(this.testView.template({})).hasClass('test')).to.be.equal(true);
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

			/** Errors **/

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
				this.testView = new View({ id: 'render-test' });
				this.testView.off().on(View.EVENTS.rendered, function(ev) {
					expect(ev).to.be.ok();
					expect(ev.view).to.be.ok();
					expect(ev.view.$el.attr('class')).to.be.equal('com:spinal:ui:view');
				});
				this.genericContainer.add(this.testView);
				var result = this.testView.render();
				expect(result).to.be.ok();
				expect(result).to.be.a(View);
				// Silent (No event triggering)
				this.testView.render({ silent: true });
				this.genericContainer.detach();
			});

			it('Should render a View instance with method inline', function() {
				this.testView = new View({ id: 'render-test' });
				this.genericContainer.add(this.testView);
				// Override Render method explicity
				this.testView.render({ method: View.RENDER.prepend });
				this.genericContainer.detach();
			});

			it('Should render a View instance with template', function() {
				this.testView = new View({
					template: '<input class="test" />'
				});
				this.genericContainer.add(this.testView);
				var result = this.testView.render();
				expect(result).to.be.ok();
				expect(result.template).to.be.a(Function);
				this.genericContainer.detach();
			});

			it('Should render a View instance with template + model data', function() {
				this.testView = new View({
					model: new Backbone.Model({ name: 'Hello Spinal!' }),
					template: '<p>{{name}}</p>'
				});
				this.genericContainer.add(this.testView);
				var result = this.testView.render();
				expect(result).to.be.ok();
				expect(result.model).to.be.a(Backbone.Model);
				expect(result.template).to.be.a(Function);
				this.genericContainer.detach();
			});

			/** Errors **/

			it('Should throw an Error: Unable to render the View due to the successor ref is not defined.', function() {
				expect(_.bind(function() {
					new View({ id: 'view-error' }).render();
				}, this)).to.throwException(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be.equal(UIException.TYPES.SuccessorNotSpecified);
				});
			});

			it('Should throw an Error: successor is not an instance of com.spinal.ui.Container', function() {
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

		});

		describe('#update()', function() {

			it('Should update the View and return the instance', function() {
				this.testView = new View({ id: 'test-update'});
				this.testView.off().on(View.EVENTS.updated, function(ev) {
					expect(ev).to.be.ok();
					expect(ev.view).to.be.ok();
				});
				this.genericContainer.add(this.testView);
				var result = this.testView.update();
				expect(result).to.be.a(View);
				result = this.testView.update({ silent: true });
				this.genericContainer.detach();
			});

		});

		describe('#lookup()', function() {

			it('Should return the successor instance', function() {
				this.testView = new View({ id: 'child-of-global'});
				this.genericContainer.add(this.testView);
				var result = this.testView.lookup('global');
				expect(result).to.be.ok();
				expect(result.id).to.be.equal('global');
				expect(this.testView.successor).to.be.a(Container);
				this.genericContainer.detach();
			});

			it('Should NOT return the successor instance (null)', function() {
				this.testView = new View({ id: 'child-of-global' });
				this.genericContainer.add(this.testView);
				var result = this.testView.lookup('non-existent');
				expect(result).to.be.equal(null);
				result = this.testView.lookup();
				expect(result).to.be.equal(null);
				this.genericContainer.detach();
			});

		});

		describe('#show()', function() {

			it('Should show the view', function() {
				this.testView = new View({ });
				this.testView.off().on(View.EVENTS.shown, function(ev) { expect(ev).to.be.ok(); });
				var result = this.testView.show();
				result = this.testView.show({ silent: true });
			});

		});

		describe('#hide()', function() {

			it('Should hide the view', function() {
				this.testView = new View();
				this.testView.off().on(View.EVENTS.hidden, function(ev) { expect(ev).to.be.ok(); });
				var result = this.testView.hide();
				result = this.testView.hide({ silent: true });
			});

		});

		describe('#enable()', function() {

			it('Should enable the view', function() {
				this.testView = new View();
				this.testView.off().on(View.EVENTS.enabled, function(ev) { expect(ev).to.be.ok(); });
				var result = this.testView.enable();
				result = this.testView.enable({ silent: true });
			});

		});

		describe('#disable()', function() {

			it('Should disable the view', function() {
				this.testView = new View();
				this.testView.off().on(View.EVENTS.disabled, function(ev) { expect(ev).to.be.ok(); });
				var result = this.testView.disable();
				result = this.testView.disable({ silent: true });
			});

		});

		describe('#detach()', function() {

			it('Should detach the dom (el) from the view instance', function() {
				this.testView = new View({ id: 'to-detach' });
				this.genericContainer.add(this.testView);
				this.testView.off().on(View.EVENTS.detached, function(ev) { expect(ev).to.be.ok(); });
				var result = this.testView.detach({ silent: true });
				this.genericContainer.detach();
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
