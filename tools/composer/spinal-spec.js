/**
*	Main Composer Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui',

		global: {
			$module: 'ui/container',
			$params: { el: 'div#global' }
		},

		$plugins: {
			theme: {
				config: { basePath: 'themes/', bootstrap: true }
			}
		}

	};

});
