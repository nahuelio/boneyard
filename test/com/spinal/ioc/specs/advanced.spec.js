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
			$params: { id: 'content', dependencyA: '$bone!viewC' }
		},

		view1: {
			$module: 'ui/view',
			$params: { id: 'view1' }
		},

		viewD: {
			$module: 'ui/view',
			$params: { id: 'viewD' }
		},

		view2: {
			$module: 'ui/view',
			$params: { id: 'view2' }
		},

		viewC: {
			$module: 'ui/container',
			$params: { id: 'viewC', css: '$bone!theme', dependencyA: '$bone!viewD' }
		},

		subcontent: {
			$module: 'ui/container',
			$params: {
				id: 'subcontent',
				model: '$bone!model',
				dependency1: '$bone!view1',
				dependency2: '$bone!view2'
			}
		},

		integrity: {
			$module: 'util/schema',
			// Offer support with this: $params: '$bone!schema'
			$params: {
				schema: '$bone!schema',
				simple: '$bone!simple'
			}
		},

		$ready: [
			{ '$bone!content.add': ['$bone!view1'] }
		]

	};

});
