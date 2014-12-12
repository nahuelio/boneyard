/**
*	SpinalJS Core Spec for UI Components (spinal-ui package)
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define(['specs/ui/basic.spec',
	'specs/ui/form.spec',
	'specs/ui/list.spec',
	'specs/ui/table.spec',
	'specs/ui/misc.spec'], function(BasicSpec, FormSpec, ListSpec, TableSpec, MiscSpec) {

	return {

		$id: 'ui',

		$specs: [BasicSpec, FormSpec, ListSpec, TableSpec, MiscSpec],

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
