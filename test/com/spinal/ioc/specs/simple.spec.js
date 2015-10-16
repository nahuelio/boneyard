/**
*	Simple Spec Test
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['specs/main.spec'], function(MainSpec) {

	return {

		$id: 'simple',
		$specs: [MainSpec],

		b: true,
		n: 10,
		a: ['$bone!n', 2, '$bone!b'],
		d: new Date(),
		r: new RegExp('/\./', 'i'),
		s: 'Hello',
		test: 'advanced',
		nested: [
			{ deep: '$bone!o' },
			{ prop: '$bone!n' }
		],
		o: { prop: '$bone!s' },
		holder: { subcontent: '$bone!subcontent' },

		simple: {
			$module: 'ui/view',
			$params: { id: 'simple' }
		},

		content: {
			$module: 'ui/container',
			$params: { id: 'content', views: ['$bone!simple', '$bone!subcontent'] }
		},

		subcontent: {
			$module: 'ui/container',
			$params: { id: 'subcontent', views: ['$bone!advanced'] }
		},

		advanced: {
			$module: 'ui/view',
			$params: { id: '$bone!test' }
		},

		$actions: [
			{ '$bone!model.set': ['_test', '$bone!simple.toString'] },
			{ '$bone!simple.listenTo': ['$bone!model', 'change:_b', '$bone!simple.update'] }
		]

	};

});
