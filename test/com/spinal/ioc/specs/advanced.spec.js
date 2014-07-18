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
				params: { id: 'content', dependency: '$bone!viewC' }
			}
		},

		viewC: {
			$module: {
				class: 'ui/container',
				params: { id: 'viewC', dependency: '$bone!viewD' }
			}
		},

		viewD: {
			$module: {
				class: 'ui/view',
				params: { id: 'viewD' }
			}
		}

	};

});
