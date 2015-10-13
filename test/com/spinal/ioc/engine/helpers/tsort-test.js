/**
*	com.spinal.ioc.engine.helpers.TSort Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/helpers/tsort',
	'ioc/engine/annotation/bone',
	'ioc/engine/helpers/dependency',
	'util/adt/collection'], function(TSort, Bone, Dependency, Collection) {

	describe.only('com.spinal.ioc.helpers.TSort', function() {

		before(function() {
			this.bones = [
				{ boneA: {
						$module: 'ui/container',
						$params: { id: 'boneA', views: ['$bone!boneB', '$bone!boneC'] }
					}
				}, {
					boneB: {
						$module: 'ui/view',
						$params: { id: 'boneB' }
					}
				}, {
					boneC: {
						$module: 'ui/container',
						$params: { id: 'boneC', views: ['$bone!boneD'] }
					}
				}, {
					boneD: {
						$module: 'ui/view',
						$params: { id: 'boneD' }
					}
				}
			];
			this.graph = null;
		});

		after(function() {
			delete this.bones;
			delete this.graph;
		});

		describe('#new()', function() {

			it('Should return an instance of TSort', function() {
				this.graph = new TSort();
				expect(this.graph).to.be.ok();
				expect(this.graph.bones).to.be.a(Collection);
			});

		});

		describe('#add()', function() {

			it('Should add new nodes to the topological dependency graph', function() {
				expect(this.graph.add(this.bones)).to.be.a(TSort);
				expect(this.graph.bones.size()).to.be(4);
			});

		});

		describe('#sort()', function() {

			it('Should sort and return dependency nodes graph', function() {
				// CONTINUE HERE...
				//console.log('FINAL: ', this.graph.sort());
			});

		});

		describe('#visit()', function() {

		});

	});

});
