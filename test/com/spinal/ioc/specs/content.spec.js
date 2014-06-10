/**
*	Content Spec Test
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['specs/main.spec'], function(MainSpec) {

	return Spinal.extend({

		content: {

			$create: {
				$module: 'ui/container',
				$params: { id: 'content' }
			}

		}

	}, MainSpec);

});
