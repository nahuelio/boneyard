/**
*	Benchmark for Spinal Core
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
$(document).ready(function() {
	
	var benchs = {
		coreNamespace: new Benchmark('core#namespace', function() {
			Spinal.namespace('a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.y.z.End', function() {});
		}, Bench._events),
		coreExtend: new Benchmark('core#_extend', function() {
			Spinal._extend({}, {
				str: 'one',
				num: 1
			}, {
				func: function() { },
				bol: true
			}, {
				obj: { str: 'two', num: 2 },
				nul: null
			}, {
				dat: new Date(),
				und: undefined
			}, {
				arr: ['1','2','3','4','5']
			}, {
				arr: [{ str: 'three' }, { num: 3 }, { func: function() { } }, { bol: false }, { dat: new Date() }]
			});
		}, Bench._events),
		coreInherit: new Benchmark('core#inherit', function() {
			
		}, Bench._events)
	}
	
	Bench.suite.emit('created', benchs);
    
});