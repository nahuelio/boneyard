/**
*	Advanced Spec Test
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['specs/main.spec'], function(MainSpec) {

	return {

		$specs: [MainSpec],

		model: {
			$class: 'util/schema',
			$params: {
				schema: {
					_boolean: 'boolean',
					_string: 'string',
					_int: 'int',
					_float: 'float'
				},
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
			$class: 'ui/container',
			$params: { id: 'content', dependencyA: '$bone!viewC' }
		},

		view1: {
			$class: 'ui/view',
			$params: { id: 'view1' }
		},

		viewD: {
			$class: 'ui/view',
			$params: { id: 'viewD' }
		},

		view2: {
			$class: 'ui/view',
			$params: { id: 'view2' }
		},

		viewC: {
			$class: 'ui/container',
			$params: { id: 'viewC', css: '$bone!theme', dependencyA: '$bone!viewD' }
		},

		subcontent: {
			$class: 'ui/container',
			$params: {
				id: 'subcontent',
				model: '$bone!model',
				dependency1: '$bone!view1',
				dependency2: '$bone!view2'
			}
		}

	};

});
