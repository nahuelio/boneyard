/**
*	Benchmark for Spinal Core
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
$(document).ready(function() {
	
	/** Spinal.namespace('a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.y.z.End', function() { }); **/
	
	Bench.suite.add('core#namespace', function() {
		Spinal.namespace('a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.y.z.End', function() { });
	}, Bench._events);
	
	Bench.suite.add('core#_extend', function() {
		
	}, Bench._events);
	
	Bench.suite.add('core#inherit', function() {
		
	}, Bench._events);
	
	Bench.suite.emit('created');
	
});