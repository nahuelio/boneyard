/**
*	Advanced Spec Test
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['specs/main.spec'], function(MainSpec) {

	return {

		$id: 'advanced',
		$specs: [MainSpec],

		schema: {
			_boolean: 'boolean',
			_string: 'string',
			_int: 'int',
			_float: 'float'
		},

		model: {
			$module: 'util/schema',
			$params: {
				schema: '$bone!schema',
				_boolean: true,
				_string: '$bone!theme',
				_int: 10,
				_float: 0.5,
				_object: { prop: 'value' },
				_array: [1, 2, 3],
				_date: new Date(),
				_regexp: new RegExp()
			}
		},

		content: {
			$module: 'ui/container',
			$params: { id: 'content', views: ['$bone!viewC'] }
		},

		view1: {
			$module: 'ui/view',
			$params: { id: 'view1' }
		},

		viewD: {
			$module: 'ui/view',
			$params: { id: 'viewD' }
		},

		viewC: {
			$module: 'ui/container',
			$params: { id: 'viewC', cls: '$bone!theme', views: ['$bone!viewD', '$bone!view2'] }
		},

		view2: {
			$module: 'ui/view',
			$params: { id: 'view2' }
		},

		viewE: {
			$module: 'ui/view',
			$params: { id: 'viewE' }
		},

		subcontent: {
			$module: 'ui/container',
			$params: { id: 'subcontent', model: '$bone!model', views: ['$bone!view1'] }
		},

		integrity: {
			$module: 'util/schema',
			$params: { schema: '$bone!schema', anotherView: '$bone!anotherView' }
		},

		anotherView: {
			$module: 'ui/view',
			$params: { id: 'anotherView' }
		},

		$ready: [
			{ '$bone!content.add': ['$bone!viewE'] }
		]

	};

});
