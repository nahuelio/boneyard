/**
*	com.spinal.ioc.Context Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/context',
	'ioc/engine/engine'], function(Context, Engine) {

	describe('com.spinal.ioc.Context', function() {

		before(function() {
			this.context = null;
			this.spec = { $id: 'test' };
		});

		after(function() {
			delete this.spec;
			delete this.context;
		});

		describe('#new()', function() {

			it('Should return a new instance of Context', function() {
				var ContextApiStub = sinon.stub(Context.prototype, 'api').returns(Context.prototype);

				this.context = new Context();
				expect(this.context).to.be.ok();
				expect(_.keys(this.context._listeningTo)[0]).to.be(this.context.getEngine()._listenId);

				Context.prototype.api.restore();
			});

		});

		describe('#api()', function() {

			it('Should proxify Engine\'s public api to make it available on the current context', function() {
				expect(this.context.api()).to.be.a(Context);
				expect(this.context.spec).to.be.a('function');
				expect(this.context.bone).to.be.a('function');
				expect(this.context.bonesByClass).to.be.a('function');
			});

		});

		describe('#getEngine()', function() {

			it('Should return unique Engine instance reference', function() {
				expect(this.context.getEngine()).to.be.an(Engine);
			});

		});

		describe('#wire()', function() {

			it('Should wire a new spec and executes callback once finished', function() {
				var callback = sinon.spy(), engineMock = sinon.mock(Context.engine);

				engineMock.expects('wire')
					.once()
					.yields([this.spec, callback, this.context])
					.returns(Context.engine);

				var result = this.context.wire(this.spec, callback);
				expect(result).to.be.a(Context);
				expect(callback.calledOnce);

				engineMock.verify();
				engineMock.restore();
			});

			it('Should wire a new spec and without a callback', function() {
				var engineMock = sinon.mock(Context.engine);

				engineMock.expects('wire')
					.once()
					.withExactArgs(this.spec, undefined, this.context)
					.returns(Context.engine);

				var result = this.context.wire(this.spec);
				expect(result).to.be.a(Context);

				engineMock.verify();
				engineMock.restore();
			});

		});

		describe('#unwire()', function() {

			it('Should unwire an existing spec and executes callback once finished', function() {
				var callback = sinon.spy(), engineMock = sinon.mock(Context.engine);

				engineMock.expects('unwire')
					.once()
					.yields([this.spec, callback, this.context])
					.returns(Context.engine);

				var result = this.context.unwire(this.spec, callback);
				expect(result).to.be.a(Context);
				expect(callback.calledOnce);

				engineMock.verify();
				engineMock.restore();
			});

			it('Should unwire an existing spec and without a callback', function() {
				var engineMock = sinon.mock(Context.engine);

				engineMock.expects('unwire')
					.once()
					.withExactArgs(this.spec, undefined, this.context)
					.returns(Context.engine);

				var result = this.context.unwire(this.spec);
				expect(result).to.be.a(Context);

				engineMock.verify();
				engineMock.restore();
			});

		});

		describe('#onStart()', function() {

			it('Should trigger Context.EVENTS.start event', function() {
				var callback = sinon.spy();
				this.context.on(Context.EVENTS.start, callback);
				expect(this.context.onStart(Context.engine)).to.be.a(Context);
				expect(callback.calledOnce);
				expect(callback.calledWith(this.context)).to.be(true);
			});

		});

		describe('#onWire()', function() {

			it('Should trigger Context.EVENTS.complete (Engine.EVENTS.wire) event', function() {
				var callback = sinon.spy();
				this.context.on(Context.EVENTS.complete, callback);
				expect(this.context.onWire(this.spec)).to.be.a(Context);
				expect(callback.calledOnce);
				expect(callback.calledWith(this.context, Engine.EVENTS.wire, this.spec)).to.be(true);
			});

		});

		describe('#onUnwire()', function() {

			it('Should trigger Context.EVENTS.complete (Engine.EVENTS.unwire) event', function() {
				var callback = sinon.spy();
				this.context.on(Context.EVENTS.complete, callback);
				expect(this.context.onUnwire(this.spec)).to.be.a(Context);
				expect(callback.calledOnce);
				expect(callback.calledWith(this.context, Engine.EVENTS.unwire, this.spec)).to.be(true);
			});

		});

		describe('static#LazyLoad()', function() {

			it('Should trigger automatic Context Lazy Loading (with spec wiring from \'data-spec\' attribute)', function(done) {
				var callback = _.bind(function() { Context.prototype.wire.restore(); done(); }, this),
					contextWireStub = sinon.stub(Context.prototype, 'wire', _.bind(function() {
					callback();
					return this.context;
				}, this));

				$('head').append('<script data-spec="specs/simple.spec"></script>');

				var result = Context.LazyLoad(callback);
				expect(result).to.be(Context);

				$('head > script[data-spec]').remove();
			});

			it('Should NOT trigger automatic Context Lazy Loading', function() {
				var result = Context.LazyLoad();
				expect(result).to.be(Context);
			});

		});

	});

});
