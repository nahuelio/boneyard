/**
*	Simple Spec Test
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['specs/main.spec'], function(MainSpec) {

	return {

		$id: 'simple',
		$specs: [MainSpec],

		b: true,
		s: 'Hello',
		n: 10,
		o: { prop: '$bone!s' },
		a: ['$bone!n', 2, '$bone!b'],
		d: new Date(),
		r: new RegExp('/\./', 'i'),
		test: 'default',
		nested: [
			{ deep: '$bone!o' },
			{ prop: '$bone!n' }
		],

		model: {
			$module: 'util/schema',
			$params: {
				_b: '$bone!b',
				_s: '$bone!s',
				_n: '$bone!n',
				_o: '$bone!o',
				_a: '$bone!a',
				_d: '$bone!d',
				_r: '$bone!r',
				_test: '$bone!test',
				_nested: '$bone!nested'
			}
		},

		content: {
			$module: 'ui/container',
			$params: { id: 'content' }
		},

		simple: {
			$module: 'ui/view',
			$params: { id: 'simple' }
		},

		$ready: [
			{ '$bone!model.set': ['_test', '$bone!simple.toString'] },
			{ '$bone!simple.listenTo': ['$bone!model', 'change:_b', '$bone-ref!simple.update'] }
		]

	};

});
