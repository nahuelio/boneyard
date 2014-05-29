/**
*	com.spinal.ui.View Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal', 'ui/view'], function(Spinal, View) {

    describe('com.spinal.ui.View', function() {

        before(function() {
            this.container = new Backbone.View({ el: 'body' });
        });

        describe('#new()', function() {

    		it('Should return an instance of View (succesor)', function() {
                this.testView = new View({ succesor: new Backbone.View({ el: 'div' }) });
                expect(this.testView).to.be.ok();
                expect(this.testView.className).to.be.equal('com:spinal:ui:view');
    		});

    		it('Should return instance of View (tpl + succesor)', function() {
                this.testView = new View({
                    succesor: new Backbone.View({ el: 'div' }),
                    tpl: '<input />'
                });
                expect(this.testView).to.be.ok();
                expect($(this.testView.template({ className: 'test' }))[0].nodeName.toLowerCase()).to.be.equal('input');
                expect($(this.testView.template({ className: 'test' })).hasClass('test')).to.be.equal(true);
    		});

    		it('Should return instance of View (succesor + model)', function() {
                this.testView = new View({
                    succesor: new Backbone.View({ el: 'div' }),
                    model: new Backbone.Model({ name: 'foo' })
                });
                expect(this.testView).to.be.ok();
                expect(this.testView.model.get('name')).to.be.equal('foo');
    		});

            it('Should return instance of View (succesor + valid render method)', function() {
                this.testView = new View({
                    succesor: new Backbone.View({ el: 'div' }),
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
                    expect(e.message).to.be.equal('[object View] requires a \'succesor\' attribute passed to the constructor.');
                });
    		});

            it('Should throw an Error: succesor is not an instance of Backbone.View', function() {
                expect(function() {
                    new View({ succesor: new Spinal.SpinalClass({ name: 'foo' }) });
                }).to.throwException(function(e) {
                    expect(e).to.be.ok();
                    expect(e.message).to.be.equal('[object View] \'succesor\' must be an instance of Backbone.View.');
                });
            });

            it('Should throw an Error: model is not an instance of Backbone.Model', function() {
                expect(function() {
                    new View({
                        succesor: new Backbone.View({ el: 'div' }),
                        model: new Spinal.SpinalClass({ name: 'foo' })
                    });
                }).to.throwException(function(e) {
                    expect(e).to.be.ok();
                    expect(e.message).to.be.equal('[object View] \'model\' must be an instance of Backbone.Model.');
                });
            });

            it('Should throw an Error: Passed method \'html\' (and unsupported method) as parameter to the View constructor', function() {
                // HTML method
                expect(function() {
                    new View({
                        succesor: new Backbone.View({ el: 'div' }),
                        method: View.RENDER.html
                    });
                }).to.throwException(function(e) {
                    expect(e).to.be.ok();
                    expect(e.message).to.be.equal('[object View] html render method is unsupported for instances of View Class.');
                });
                // Null as method
                expect(function() {
                    new View({
                        succesor: new Backbone.View({ el: 'div' }),
                        method: 'non-existent'
                    });
                }).to.throwException(function(e) {
                    expect(e).to.be.ok();
                    expect(e.message).to.be.equal('[object View] unsupported render \'method -> non-existent\'.');
                });
            });

        });

        describe('#render()', function() {

            it('Should render a View instance', function() {
                this.testView = new View({ succesor: this.container });
                this.testView.off().on(View.EVENTS.rendered, function(ev) {
                    expect(ev).to.be.ok();
                    expect(ev.view).to.be.ok();
                    expect(ev.view.$el.attr('class')).to.be.equal('com:spinal:ui:view');
                });
                var result = this.testView.render();
                expect(result).to.be.ok();
                expect(result).to.be.a(View);
                // Methods: appendTo (default), append, prependTo, prepend, html
                this.testView.render({ method: View.RENDER.append }); // defaults to appendTo
                this.testView.render({ method: View.RENDER.appendTo });
                this.testView.render({ method: View.RENDER.prependTo });
                this.testView.render({ method: View.RENDER.prepend }); // defaults to prependTo
                this.testView.render({ method: View.RENDER.html }); // defaults to appendTo
                // Silent (No event triggering)
                this.testView.render({ silent: true });
            });

        });

        describe('#update()', function() {

        });

        describe('#lookup()', function() {

        });

        describe('#show()', function() {

        });

        describe('#hide()', function() {

        });

        describe('#enable()', function() {

        });

        describe('#disable()', function() {

        });

        describe('#clear()', function() {

        });

        describe('#_next()', function() {

        });

        describe('#toString()', function() {

        });

	});

});
