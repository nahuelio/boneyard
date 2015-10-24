/**
*	SpinalJS Misc Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['specs/ui/misc/panel.spec',
		'specs/ui/misc/dropdown.spec',
		'specs/ui/misc/dialog.spec',
		'specs/ui/misc/autocomplete.spec',
		'specs/ui/misc/affix.spec'], function(PanelSpec, DropdownSpec, DialogSpec, AutocompleteSpec, AffixSpec) {

	return {

		$id: 'ui-misc',
		$specs: [PanelSpec, DropdownSpec, DialogSpec, AutocompleteSpec, AffixSpec],

		misc_header: {
			$module: 'ui/basic/header',
			$params: {
				content: 'Miscellaneous <small><kbd>com.spinal.ui.misc</kbd></small>',
				heading: '2'
			}
		},

		cpanel: {
			$module: 'ui/misc/panel',
			$params: { id: 'panel', title: 'Panels' }
		},

		cdropdown: {
			$module: 'ui/misc/panel',
			$params: { id: 'dropdown', title: 'Dropdown' }
		},

		cdialog: {
			$module: 'ui/misc/panel',
			$params: { id: 'dialog', title: 'Dialog' }
		},

		cautocomplete: {
			$module: 'ui/misc/panel',
			$params: { id: 'autocomplete', title: 'Autocomplete' }
		},

		$actions: [{
			'$bone!global.addAll': [[
				'$bone!misc_header',
				'$bone!cpanel',
				'$bone!cdropdown',
				'$bone!cdialog',
				'$bone!cautocomplete'
			], { renderOnAdd: true }]
		}]

	};

});
