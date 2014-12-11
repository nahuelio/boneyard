/**
*	SpinalJS Core Spec for UI Components (spinal-ui package)
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define(['specs/ui/basic.spec',
	'specs/ui/list.spec',
	'specs/ui/form.spec',
	'specs/ui/dialog.spec',
	'specs/ui/misc.spec'], function(BasicSpec, ListSpec, FormSpec, DialogSpec, MiscSpec) {

	return {

		$id: 'ui',

		$specs: [BasicSpec, ListSpec, FormSpec, DialogSpec, MiscSpec],

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
