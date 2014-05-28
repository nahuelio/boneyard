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

        });

        describe('#render()', function() {

            it('Should render a View instance', function() {
                this.testView = new View({ succesor: this.container });
                this.testView.off().on(View.EVENTS.rendered, function(ev) {
                    expect(ev).to.be.ok();
                    expect(ev.view).to.be.ok();
                });
                var result = this.testView.render();
                expect(result).to.be.ok();
                expect(result).to.be.a(View);
                //console.log(result.$el);
            });

        });
	});

});
