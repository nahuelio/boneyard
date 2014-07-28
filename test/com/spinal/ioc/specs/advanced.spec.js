/**
*	Advanced Spec Test
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['specs/main.spec'], function(MainSpec) {

	return {

		$specs: MainSpec,

		content: {
			$module: {
				class: 'ui/container',
				params: { id: 'content', dependencyA: '$bone!viewC' }
			}
		},

		view1: {
			$module: {
				class: 'ui/view',
				params: { id: 'view1' }
			}
		},

		viewD: {
			$module: {
				class: 'ui/view',
				params: { id: 'viewD' }
			}
		},

		view2: {
			$module: {
				class: 'ui/view',
				params: { id: 'view2' }
			}
		},

		viewC: {
			$module: {
				class: 'ui/container',
				params: { id: 'viewC', dependencyA: '$bone!viewD' }
			}
		},

		subcontent: {
			$module: {
				class: 'ui/container',
				params: {
					id: 'subcontent',
					css: '$bone!theme',
					dependency1: '$bone!view1',
					dependency2: '$bone!view2'
				}
			}
		}

	};

});
