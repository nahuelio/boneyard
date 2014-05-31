/**
*	com.spinal.ui.View Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	FIXME:
*		- Couple of issues with View Hierarchery between succesor and the view itself.
*		- Fix Test case on render, when model + template inline is specified.
*		- Improve expect analysis to check the DOM reflecting the hierarchery.
*		- Add edge cases when View receives a 'el' attribute or when el is a jquery instance, etc.
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
			if(this.testView) {
				this.testView.remove();
				delete this.testView;
			}
		});

		describe('#new()', function() {

			it('Should return an instance of View (successor)', function() {
				this.testView = new View({ successor: this.genericContainer });
				expect(this.testView).to.be.ok();
				expect(this.testView.className).to.be.equal('com:spinal:ui:view');
			});

			it('Should return instance of View (successor + inline template)', function() {
				this.testView = new View({
					successor: this.genericContainer,
					template: '<input class="test" />'
				});
				expect(this.testView).to.be.ok();
				expect($(this.testView.template({}))[0].nodeName.toLowerCase()).to.be.equal('input');
				expect($(this.testView.template({})).hasClass('test')).to.be.equal(true);
			});

			it('Should return instance of View (successor + model)', function() {
				this.testView = new View({
					successor: this.genericContainer,
					model: new Backbone.Model({ name: 'foo' })
				});
				expect(this.testView).to.be.ok();
				expect(this.testView.model.get('name')).to.be.equal('foo');
			});

			it('Should return instance of View (successor + valid render method)', function() {
				this.testView = new View({
					successor: this.genericContainer,
					method: View.RENDER.prependTo
				});
				expect(this.testView).to.be.ok();
				expect(this.testView.method).to.be.equal(View.RENDER.prependTo);
			});

			it('Should throw an Error: new View() no parameters', function() {
				expect(function() {
					new View();
				}).to.throwException(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be.equal(UIException.TYPES.SuccessorNotSpecified);
				});
			});

			it('Should throw an Error: new View() with id type number instead of string', function() {
				expect(function() {
					new View({ id: 1 });
				}).to.throwException(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be.equal(UIException.TYPES.InvalidIDType);
				});
			});

			it('Should throw an Error: successor is not an instance of com.spinal.ui.Container', function() {
				expect(function() {
					new View({ successor: new Backbone.View({ name: 'foo' }) });
				}).to.throwException(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be.equal(UIException.TYPES.InvalidSuccessorType);
				});
			});

			it('Should throw an Error: model is not an instance of Backbone.Model', function() {
				expect(_.bind(function() {
					new View({
						successor: this.genericContainer,
						model: new Spinal.SpinalClass({ name: 'foo' })
					});
				}, this)).to.throwException(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be.equal(UIException.TYPES.InvalidModelType);
				});
			});

			it('Should throw an Error: Passed unexistent (unsupported) method as parameter to the View constructor', function() {
				// Null as method
				expect(_.bind(function() {
					new View({
						successor: this.genericContainer,
						method: 'non-existent'
					});
				}, this)).to.throwException(function(e) {
					expect(e).to.be.ok();
					expect(e.message).to.be.equal(UIException.TYPES.UnsupportedRenderMethod);
				});
			});

		});

		describe('#render()', function() {

			it('Should render a View instance', function() {
				this.testView = new View({ successor: this.genericContainer });
				this.testView.off().on(View.EVENTS.rendered, function(ev) {
					expect(ev).to.be.ok();
					expect(ev.view).to.be.ok();
					expect(ev.view.$el.attr('class')).to.be.equal('com:spinal:ui:view');
				});
				var result = this.testView.render();
				expect(result).to.be.ok();
				expect(result).to.be.a(View);
				// Override Render method explicity
				this.testView.render({ method: View.RENDER.prepend });
				// Silent (No event triggering)
				this.testView.render({ silent: true });
			});

			it('Should render a View instance with template', function() {
				this.testView = new View({
					successor: this.genericContainer,
					template: '<input class="test" />'
				});
				var result = this.testView.render();
				expect(result).to.be.ok();
				expect(result.template).to.be.a(Function);
			});

			it('Should render a View instance with template + model data', function() {
				this.testView = new View({
					successor: this.genericContainer,
					model: new Backbone.Model({ name: 'Hello Spinal' }),
					template: '<p>{{name}}</p>'
				});
				var result = this.testView.render();
				expect(result).to.be.ok();
				expect(result.model).to.be.a(Backbone.Model);
				expect(result.template).to.be.a(Function);
			});

		});

		describe('#update()', function() {

			it('Should update the View and return the instance', function() {
				this.testView = new View({ successor: this.genericContainer });
				this.testView.off().on(View.EVENTS.updated, function(ev) {
					expect(ev).to.be.ok();
					expect(ev.view).to.be.ok();
				});
				var result = this.testView.update();
				expect(result).to.be.a(View);
				result = this.testView.update({ silent: true });
			});

		});

		describe('#lookup()', function() {

			it('Should return the successor instance', function() {
				this.testView = new View({ successor: this.genericContainer });
				var result = this.testView.lookup('global');
				expect(result).to.be.ok();
				expect(result.id).to.be.equal('global');
				expect(this.testView.successor).to.be.a(Container);
			});

			it('Should NOT return the successor instance (null)', function() {
				this.testView = new View({ successor: this.genericContainer });
				var result = this.testView.lookup('non-existent');
				expect(result).to.be.equal(null);
				result = this.testView.lookup();
				expect(result).to.be.equal(null);
			});

		});

		describe('#show()', function() {

			it('Should show the view', function() {
				this.testView = new View({ successor: this.genericContainer });
				this.testView.off().on(View.EVENTS.shown, function(ev) { expect(ev).to.be.ok(); });
				var result = this.testView.show();
				result = this.testView.show({ silent: true });
			});

		});

		describe('#hide()', function() {

			it('Should hide the view', function() {
				this.testView = new View({ successor: this.genericContainer });
				this.testView.off().on(View.EVENTS.hidden, function(ev) { expect(ev).to.be.ok(); });
				var result = this.testView.hide();
				result = this.testView.hide({ silent: true });
			});

		});

		describe('#enable()', function() {

			it('Should enable the view', function() {
				this.testView = new View({ successor: this.genericContainer });
				this.testView.off().on(View.EVENTS.enabled, function(ev) { expect(ev).to.be.ok(); });
				var result = this.testView.enable();
				result = this.testView.enable({ silent: true });
			});

		});

		describe('#disable()', function() {

			it('Should disable the view', function() {
				this.testView = new View({ successor: this.genericContainer });
				this.testView.off().on(View.EVENTS.disabled, function(ev) { expect(ev).to.be.ok(); });
				var result = this.testView.disable();
				result = this.testView.disable({ silent: true });
			});

		});

		describe('#clear()', function() {

			it('Should clear the view', function() {
				this.testView = new View({ successor: this.genericContainer });
				this.testView.off().on(View.EVENTS.cleared, function(ev) { expect(ev).to.be.ok(); });
				var result = this.testView.clear({ silent: true });
			});

		});

		describe('#toString()', function() {

			it('Should return a string representation of the instance of view', function() {
				this.testView = new View({ successor: this.genericContainer });
				expect(this.testView.toString()).to.be.equal('[object View]');
			});

		});

	});

});
