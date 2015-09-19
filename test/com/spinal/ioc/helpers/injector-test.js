/**
*	com.spinal.ioc.Context Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/helpers/injector',
		'ioc/processor/bone',
		'ioc/engine/engine'], function(Injector, BoneProcessor, Engine) {

	describe.skip('com.spinal.ioc.helpers.Injector', function() {

		before(function() {
			this.common = 'my-container';
			this.viewA = { $module: 'ui/view', $params: { id: 'viewA' } };
			this.containerA = { $module: 'ui/container', $params: { id: 'containerA', views: ['$bone!viewB'] } };
			this.viewB = { $module: 'ui/view', $params: { id: 'viewB' } };
			this.sample = {
				$module: 'ui/container',
				$params: {
					id: 'sample',
					cls: '$bone!common',
					views: ['$bone!viewA', '$bone!containerA']
				}
			};
			this.engine = Engine.new();
			this.engine.root['common'] = this.common;
			this.engine.root['viewA'] = this.viewA;
			this.engine.root['containerA'] = this.containerA;
			this.engine.root['viewB'] = this.viewB;
			this.engine.root['sample'] = this.sample;
			this.boneProcessor = new BoneProcessor(this.engine);
		});

		after(function() {
			delete this.common;
			delete this.viewA;
			delete this.containerB;
			delete this.viewB;
			delete this.sample;
			delete this.engine;
			delete this.boneProcessor;
			delete this.injector;
		});

		describe('#initialize()', function() {

			it('Should return an instance of Injector', function() {
				this.injector = new Injector(this.boneProcessor, this.sample);
				expect(this.injector).to.be.ok();
			});

			it('Should throw an Error: constructor parameters not passed or invalid', function() {
				// No Parameters
				expect(function() { new Injector(); }).to.throwException(function(e) {
					expect(e.message).to.be('Injector requires a processor in order to perform injections');
				});

				// Processor passed but not a bone
				expect(_.bind(function() { new Injector(this.boneProcessor); }, this)).to.throwException(function(e) {
					expect(e.message).to.be('Injector requires bone metadata information in order to perform injections');
				});

				// Both parameters passed but processor is not an instance of BoneProcessor
				expect(_.bind(function() { new Injector({}, this.sample) }, this)).to.throwException(function(e) {
					expect(e.message).to.be('Injector requires a processor in order to perform injections');
				});
			});

		});

		describe('#_validate()', function() {

			it('Should return true: All parameters passed meet expectations', function() {
				expect(this.injector._validate(this.boneProcessor, this.sample)).to.be(true);
			});

		});

		describe('#getFactory()', function() {

			it('Should return factory associated to the processor', function() {
				var factory = this.injector.getFactory();
				expect(factory).to.be.ok();
			});

		});

		describe('#getParams()', function() {

			it('Should return bone parameters', function() {
				var params = this.injector.getParams();
				expect(params).to.be.ok();
				expect(params).to.not.be.empty();
				expect(params.views).to.be.an('array');
			});

		});

		describe('#inject', function() {

			it('Should Inject dependencies', function() {
				expect(this.injector.inject()).to.be.ok();
				var sample = this.engine.getBone('sample');
				expect(sample.$params.id).to.be('sample');
				expect(sample.$params.cls).to.be('my-container');

				var sampleViews = sample.$params.views;
				expect(sampleViews).to.have.length(2);
				expect(sampleViews[0]).to.be.ok();
				expect(sampleViews[0].$params.id).to.be('viewA');
				expect(sampleViews[1].$params.id).to.be('containerA');

				// Remember: Each Bone needs and injector.
				// CreateProcessor will create one for each one but here, we need to do it manually to test.
				this.injectorContainerA = new Injector(this.boneProcessor, this.containerA).inject();
				var containerA = this.engine.getBone('containerA');
				expect(containerA).to.be.ok();
				expect(containerA.$params.views).to.have.length(1);
				expect(containerA.$params.views[0].$params.id).to.be('viewB');
			});

		});

	});

});
