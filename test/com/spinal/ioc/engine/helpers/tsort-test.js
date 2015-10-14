/**
*	com.spinal.ioc.engine.helpers.TSort Class Tests
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/helpers/tsort'], function(TSort) {

	describe.only('com.spinal.ioc.helpers.TSort', function() {

		before(function() {
			this.bone1 = ['holder', 'subcontent'];
			this.bone2 = ['content', 'simple', 'subcontent'];
			this.bone3 = ['subcontent', 'advanced'];
			this.bone4 = ['advanced', 'test'];

			this.boneA = ['boneA', 'boneB'];
			this.boneB = ['boneB', 'boneC', 'boneD'];
			this.boneC = ['boneC', 'boneA'];

			this.graph = null;
		});

		after(function() {
			delete this.boneA;
			delete this.boneB;
			delete this.boneC;

			delete this.bone1;
			delete this.bone2;
			delete this.bone3;
			delete this.bone4;
			delete this.graph;
		});

		describe('#new()', function() {

			it('Should return an instance of TSort', function() {
				this.graph = new TSort();
				expect(this.graph).to.be.ok();
				expect(this.graph.nodes).to.be.an('object');
				expect(this.graph.nodes).to.be.empty();
			});

		});

		describe('#add()', function() {

			it('Should add new nodes to the topological dependency graph', function() {
				expect(this.graph.add(this.bone1)
					.add(this.bone2)
					.add(this.bone3)
					.add(this.bone4)
				).to.be.a(TSort);
				expect(this.graph.nodes).not.be.empty();
			});

		});

		describe('#sort()', function() {

			it('Should sort and return dependency nodes graph', function() {
				var result = this.graph.sort();
				expect(result).to.be.an('array');
				expect(result).to.have.length(6);
				// checking dependency order
				expect(_.indexOf(result, 'test')).to.be.below(_.indexOf(result, 'advanced'));
				expect(_.indexOf(result, 'advanced')).to.be.below(_.indexOf(result, 'subcontent'));
				expect(_.indexOf(result, 'subcontent')).to.be.below(_.indexOf(result, 'content'));
				expect(_.indexOf(result, 'holder')).to.be.above(_.indexOf(result, 'subcontent'));
				expect(_.indexOf(result, 'content')).to.be.above(_.indexOf(result, 'simple'));
			});

			it('Should throw an Error: Circular Dependency detected', function() {
				expect(_.bind(function() {
					var graphCD = new TSort();
					var result = graphCD.add(this.boneA)
						.add(this.boneB)
						.add(this.boneC).sort();
				}, this)).to.throwException(function(e) {
					expect(e.message).to.be('Circular dependency detected. It\'s not possible to derive a topological sort.');
				})
			});

		});

	});

});
