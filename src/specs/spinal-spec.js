/**
*	SpinalJS Core Spec for UI Components (spinal-ui package)
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	Dev Notes:
*		- Create UIAffix as a menu to navigate through panels
*		- Create Theme Switcher / Draggable to change themes on components (Strech Goal)
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
			$params: { el: 'div#composer-main', cls: 'container-fluid' }
		},

		global: {
			$module: 'ui/container',
			$params: { id: 'global', cls: 'container col-md-10' }
		},

		menu: {
			$module: 'ui/container',
			$params: { id: 'menu', cls: 'container col-md-2 visible-md visible-lg' }
		},

		$ready: [{
			'$bone!main.addAll': [[
				'$bone!global',
				'$bone!menu'
			], { renderOnAdd: true }]
		}],

		$plugins: {
			html: {},
			theme: {
				config: { basePath: 'themes/', bootstrap: true }
			}
		}

	};

});
