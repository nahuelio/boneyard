/**
*	SpinalJS Form Simple Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-form-simple',

		form_simple_model: new Backbone.Model({
			username: {
				type: 'Input',
				autoId: true,
				value: 'johndoe',
				placeholder: 'Enter Username...',
				options: {
					fieldset: { attrs: { cls: 'fieldset' } },
					label: { content: 'Username' }
				}
			},
			password: {
				type: 'Password',
				autoId: true,
				options: {
					fieldset: { attrs: { cls: 'fieldset' } },
					label: { content: 'Password' }
				}
			},
			display: {
				type: 'Checkbox',
				autoId: true,
				value: true,
				options: {
					fieldset: { attrs: { cls: 'fieldset' } },
					label: { content: 'Stay signed in' }
				}
			}
		}),

		form_simple: {
			$module: 'ui/form/form',
			$params: {
				name: 'form_simple',
				action: 'http:/localhost:9393/',
				model: '$bone!form_simple_model'
			}
		},

		$actions: [
			{ '$bone!p_form_simple.addAll': [['$bone!form_simple']] }
		]

	};

});
