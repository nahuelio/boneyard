/**
*	SpinalJS Input Component Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-form-controls-input',

		input_p_d: { $module: 'ui/basic/paragraph', $params: { content: '<code>InputText</code>' } },
		input_p_c: { $module: 'ui/basic/paragraph', $params: { content: '<code>Checkbox</code>' } },
		input_p_r: { $module: 'ui/basic/paragraph', $params: { content: '<code>RadioButton</code>' } },

		default_input: {
			$module: 'ui/form/controls/input',
			$params: { name: 'default_input', value: 'Default Input', placeholder: 'Default Text' }
		},

		checkbox: {
			$module: 'ui/form/controls/checkbox',
			$params: { name: 'checkbox' }
		},

		radio: {
			$module: 'ui/form/controls/radio',
			$params: { name: 'radio' }
		},

		$ready: [{
			'$bone!cinput.addAll': [[
				'$bone!input_p_d',
				'$bone!default_input',
				'$bone!input_p_c',
				'$bone!checkbox',
				'$bone!input_p_r',
				'$bone!radio'
			], { renderOnAdd: true }]
		}]

	};

});
