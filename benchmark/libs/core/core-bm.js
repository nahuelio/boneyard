/**
*	Benchmark for Spinal Core
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
var suite = Benchmark.Suite();

/** Spinal.namespace('a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.y.z.End', function() { }); **/

suite.add('core#namespace', function() {
	
}, config);

suite.add('core#_extend', function() {
	
}, config);

suite.add('core#inherit', function() {
	
}, config);

/** Global Suite Events **/

suite.on('start', function() { });
suite.on('cycle', function() { });
suite.on('complete', function() { });

suite.run();