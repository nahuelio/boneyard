/**
*	Advanced Spec Test
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	IMPORTANT NOTE:
*	There is still one more use case:
*	In a previous wiring operation: let say that the bone 'footer' was already registered in the factory
*	But wiped out from the spec, due to a reset. so it means that when it was 'put back again',
*	the _$created doesn't exists anymore, but it's still registered in the factory (previously loaded).
*
*	THIS IS THE partial specs functionality, we should be able to keep those _$created variables in place
*	So later we can do: subcontent: { $params: dependency3: '$bone!footer'} (already parsed by simple.spec.js)
*	I NEED TO DO SOMETHING WITH THE Engine.build method to keep those (Partial 'Specting')
**/
define(['specs/main.spec'], function(MainSpec) {

	return {

		$specs: [MainSpec],

		model: {
			$module: 'util/schema',
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
				// this is why the model is being added into the loading queue (even though, the simple.spec already
				// loaded it with the same bone 'id')
				model: '$bone!model',
				dependency1: '$bone!view1',
				dependency2: '$bone!view2'
			}
		}

	};

});
