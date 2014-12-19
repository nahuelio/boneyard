/**
*	SpinalJS Input Component Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-form-controls-input',

		default_input: {
			$module: 'ui/form/controls/input',
			$params: { name: 'default_input', value: 'Default Input', placeholder: 'Default Text' }
		},

		$ready: [{
			'$bone!cinput.addAll': [[
				'$bone!default_input'
			], { renderOnAdd: true }]
		}]

	};

});
