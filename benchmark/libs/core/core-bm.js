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
			var C1 = Spinal.com.spinal.core.Class.inherit({
				_string: 'C1-string',
				_number: 1,
				mymethod: function() { return this._string + ' - ' + this._number.toString(); }
			}, { NAME: 'C1' });
			var C2 = C1.inherit({
				_string: 'C2-string',
				_number: 2,
				mymethod: function() { return this._string + ' - ' + this._number.toString(); }
			}, { NAME: 'C2' });
			var C3 = C2.inherit({
				_string: 'C3-string',
				_number: 3,
				mymethod: function() { return this._string + ' - ' + this._number.toString(); }
			}, { NAME: 'C3' });
			var C4 = C3.inherit({
				_string: 'C4-string',
				_number: 4,
				mymethod: function() { return this._string + ' - ' + this._number.toString(); }
			}, { NAME: 'C4' });
			var C5 = C4.inherit({
				_string: 'C5-string',
				_number: 5,
				mymethod: function() { return this._string + ' - ' + this._number.toString(); }
			}, { NAME: 'C5' });
		}, Bench._events)
	}
	
	Bench.suite.emit('created', benchs);
    
});