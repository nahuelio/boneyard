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

		main: {
			$module: 'ui/container',
			$params: {
				el: 'div#composer-main',
				cls: 'container-fluid',
				views: ['$bone!global', '$bone!menu']
			}
		},

		global: {
			$module: 'ui/container',
			$params: { id: 'global', cls: 'container col-md-10' }
		},

		menu: {
			$module: 'ui/container',
			$params: { id: 'menu', cls: 'container col-md-2 visible-md visible-lg' }
		},

		$actions: [
			{ '$bone!global.render': [{ method: 'before', target: 'div#menu'}] },
			{ '$bone!menu.render': [] }
		],

		$plugins: {
			html: {
				config: { basePath: 'text!templates' }
			},
			theme: {
				config: { basePath: 'themes', bootstrap: true }
			}
		}

	};

});
