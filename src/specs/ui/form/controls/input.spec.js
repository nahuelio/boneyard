/**
*	Boneyard Input Component Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-form-controls-input',

		input_p_d: { $module: 'ui/basic/paragraph', $params: { content: '<code>Input Text</code>' } },
		input_p_c: { $module: 'ui/basic/paragraph', $params: { content: '<code>Input Checkbox</code>' } },
		input_p_r: { $module: 'ui/basic/paragraph', $params: { content: '<code>Input Radio</code>' } },
		input_p_p: { $module: 'ui/basic/paragraph', $params: { content: '<code>Input Password</code>' } },

		c_default: { $module: 'ui/container', $params: { className: 'form-group' } },
		c_checkbox: { $module: 'ui/container', $params: { className: 'form-group' } },
		c_radio: { $module: 'ui/container', $params: { className: 'form-group' } },
		c_password: { $module: 'ui/container', $params: { className: 'form-group' } },

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

		password: {
			$module: 'ui/form/controls/password',
			$params: { name: 'password' }
		},

		hidden: {
			$module: 'ui/form/controls/hidden',
			$params: { name: 'hidden', value: 'myhiddenvalue' }
		},

		$actions: [
			{ '$bone!c_default.addAll': [['$bone!input_p_d', '$bone!default_input']] },
			{ '$bone!c_checkbox.addAll': [['$bone!input_p_c', '$bone!checkbox']] },
			{ '$bone!c_radio.addAll': [['$bone!input_p_r', '$bone!radio']] },
			{ '$bone!c_password.addAll': [['$bone!input_p_p', '$bone!password']] },
			{ '$bone!cinput.addAll': [['$bone!c_default', '$bone!c_checkbox', '$bone!c_radio', '$bone!c_password', '$bone!hidden']] }
		]

	};

});
