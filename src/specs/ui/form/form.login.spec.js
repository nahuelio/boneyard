/**
*	Boneyard Form Simple Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-form-login',

		form_model: new Backbone.Model({
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

		form_validator: {
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

		form_mapper: {
			$module: 'ui/form/mapper/form-mapper'
		},

		form_login: {
			$module: 'ui/form/form',
			$params: {
				name: 'form_login',
				model: '$bone!form_model',
				mapper: '$bone!form_mapper',
				validator: '$bone!form_validator'
			}
		},

		$actions: [
			{ '$bone!p_form_login.addAll': [['$bone!form_login']] }
		]

	};

});
