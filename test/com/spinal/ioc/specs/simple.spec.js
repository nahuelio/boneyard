/**
*	Simple Spec Test
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['specs/main.spec'], function(MainSpec) {

	return {

		$specs: MainSpec,

		content: {

			$module: {
				class: 'ui/container',
				params: { id: 'content' }
			}
		}

	};

});
