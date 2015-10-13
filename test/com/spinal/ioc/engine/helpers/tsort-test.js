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
			this.graph = null;
		});

		after(function() {
			delete this.bone1;
			delete this.bone2;
			delete this.bone3;
			delete this.bone4;
			delete this.bone5;
			delete this.bone6;
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
				this.graph.sort();
				// continue here...
			});

		});

		describe('#visit()', function() {

		});

	});

});
