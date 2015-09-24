/**
*	com.spinal.ioc.Context Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/helpers/injector',
		'ioc/engine/helpers/dependency',
		'ioc/engine/annotation/bone',
		'util/adt/collection'], function(Injector, Dependency, Bone, Collection) {

	describe('com.spinal.ioc.helpers.Injector', function() {

		before(function() {
			this.boneComplex = { complex: {
				$module: 'ui/view',
				$params: {
					id: 'view',
					views: ['$bone!boneObj', true],
					render: '$bone!boneBool',
					other: { option: [{ key: '$bone!boneArr'}, 100] }
				}
			}};
			this.bone = new Bone(this.boneComplex);
		});

		after(function() {
			delete this.boneComplex;
			delete this.bone;
		});

		describe('#new', function() {

			it('Should return an instance of an Injector', function() {
				var spyGet = sinon.spy(this.bone, 'get');
				var spyRetrieve = sinon.spy(this.bone, 'retrieve');

				this.injector = new Injector(this.bone);

				expect(spyGet.calledOnce);
				expect(spyRetrieve.called);

				this.bone.get.restore();
				this.bone.retrieve.restore();
			});

		});

		describe('#getDependencies', function() {

			it('Should return a collection of dependencies', function() {
				expect(this.injector.getDependencies()).to.be.a(Collection);
				expect(this.injector.getDependencies().size()).to.be(3);
			});

		});

		describe('#create', function() {

			it('Should assign an instance into the injector bone', function() {
				var spyGet = sinon.spy(this.bone, 'get');
				this.instance = new Array();

				expect(this.injector.assign(this.instance));
				expect(this.injector.get()._$created).to.be.ok();
				expect(this.injector.get()._$created).to.be.an('array');
				expect(spyGet.called);

				this.bone.get.restore();
			});

		});

		describe('#resolve', function() {

			it('Should invoke resolve method on every dependency', function() {
				var resolveStub = sinon.stub(Dependency.prototype, 'resolve');

				resolveStub.onFirstCall().returns(new Dependency({
					expression: '$bone!boneObj',
					property: '0',
					target: this.boneComplex.complex.$params.views,
					bone: this.bone
				}));

				resolveStub.onSecondCall().returns(new Dependency({
					expression: '$bone!boneBool',
					property: 'render',
					target: this.boneComplex.complex.$params,
					bone: this.bone
				}));

				resolveStub.onThirdCall().returns(new Dependency({
					expression: '$bone!boneArr',
					property: 'key',
					target: this.boneComplex.complex.$params.other.option[0],
					bone: this.bone
				}));

				this.injector = new Injector(this.bone);

				var spyInvoke = sinon.spy(this.injector.getDependencies(), 'invoke').withArgs('resolve', this.injector);
				var result = this.injector.resolve();

				expect(spyInvoke.calledOnce);
				expect(result).to.be.ok();
				expect(result).not.be.empty();
				expect(result).to.have.length(3);
				expect(result[1].getExpression()).to.be('$bone!boneBool');

				resolveStub.restore();
				this.injector.getDependencies().invoke.restore();
			});

		});

		describe('#inject', function() {

			it('Should inject dependency into targets property on the current bone property', function() {
				var dependency = new Dependency({
					expression: '$bone!boneObj',
					property: '0',
					target: this.boneComplex.complex.$params.views,
					bone: this.bone
				});
				var stubGet = sinon.stub(dependency, 'get').returns(function() {});
				var result = this.injector.inject(dependency);

				expect(result).to.be.ok();
				expect(result).to.be.a(Dependency);
				expect(result.getExpression()).to.be(dependency.getExpression());
				expect(result.getTarget()[result.getProperty()]).to.be.a('function');

				stubGet.restore();
			});

			it('Should inject dependency and delete partial function as on hold', function() {
				var dependency = new Dependency({
					expression: '$bone!boneObj',
					property: '0',
					target: this.boneComplex.complex.$params.views,
					bone: this.bone,
					hold: function() {}
				});
				var stubGet = sinon.stub(dependency, 'get').returns(function() {});
				var stubHold = sinon.stub(dependency, 'hold').returns(_.bind(this.injector.inject, this.injector, dependency));
				var result = this.injector.inject(dependency);

				expect(result).to.be.ok();
				expect(result).to.be.a(Dependency);
				expect(result.hold).to.be(undefined);

				stubGet.restore();
				stubHold.restore();
			});

		});

		describe('#hold', function() {

			it('Should assign inject method as a partial function in the current dependency', function() {
				var dependency = new Dependency({
					expression: '$bone!boneObj',
					property: '0',
					target: this.boneComplex.complex.$params.views,
					bone: this.bone
				});
				var injectStub = sinon.stub(this.injector, 'inject').returns(dependency);
				var result = this.injector.hold(dependency);
				var holdResult = result.hold();

				expect(result).to.be.ok();
				expect(result).to.be.a(Dependency);
				expect(result.hold).to.be.a('function');
				expect(injectStub.calledOnce);

				injectStub.restore();
			});

		});

	});

});
