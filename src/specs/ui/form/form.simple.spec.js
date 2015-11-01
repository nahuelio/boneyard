/**
*	SpinalJS Form Simple Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-form-simple',

		form_simple_model: new Backbone.Model({
			username: {
				type: 'input',
				name: 'username',
				value: 'johndoe',
				placeholder: 'Enter Username...',
				options: {
					fieldset: { cls: 'form-group' },
					label: { content: 'Username' }
				}
			},
			password: {
				type: 'password',
				name: 'password',
				options: {
					fieldset: { cls: 'form-group' },
					label: { content: 'Password' }
				}
			},
			signedin: {
				type: 'checkbox',
				name: 'signedin',
				value: true,
				options: {
					fieldset: { cls: 'form-group' },
					label: { content: 'Stay signed in &nbsp;' }
				}
			},
			signin: {
				type: 'button',
				text: 'Sign In',
				style: 'btn-primary',
				attrs: { type: 'submit' },
				options: {
					fieldset: { cls: 'form-group' }
				}
			}
		}),

		simple_validator: {
			$module: 'ui/form/validator/validator',
			$params: [{
					name: 'username',
					type: 'onlyAlphanumeric'
				}, {
					name: 'username',
					type: 'required'
				}, {
					name: 'password',
					type: 'required'
			}]
		},

		simple_form_mapper: {
			$module: 'ui/form/mapper/form-mapper',
			$params: {}
		},

		form_simple: {
			$module: 'ui/form/form',
			$params: {
				name: 'form_simple',
				model: '$bone!form_simple_model',
				mapper: '$bone!simple_form_mapper',
				validator: '$bone!simple_validator'
			}
		},

		$actions: [
			{ '$bone!p_form_simple.addAll': [['$bone!form_simple']] }
		]

	};

});
