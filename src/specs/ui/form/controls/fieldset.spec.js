/**
*	SpinalJS Fieldset Component Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-form-controls-fieldset',

		fs_simple: {
			$module: 'ui/form/controls/fieldset',
			$params: {}
		},

		fs_label: {
			$module: 'ui/basic/label',
			$params: { afor: 'fs_paragraph', content: 'Fieldset Label' }
		},

		fs_input: {
			$module: 'ui/form/controls/input',
			$params: { name: 'fs_input', placeholder: 'Input wrapped in Fieldset' }
		},

		$actions: [
			{ '$bone!fs_simple.addAll': [['$bone!fs_label', '$bone!fs_input']] },
			{ '$bone!fs_simple.addClass': ['form-group'] },
			{ '$bone!cfieldset.add': ['$bone!fs_simple'] }
		]

	};

});
