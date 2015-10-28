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
				value: 'johndoe',
				placeholder: 'Enter Username...',
				options: {
					fieldset: { attrs: { class: 'form-group' } },
					label: { content: 'Username' }
				}
			},
			password: {
				type: 'password',
				options: {
					fieldset: { attrs: { class: 'form-group' } },
					label: { content: 'Password' }
				}
			},
			signedin: {
				type: 'checkbox',
				value: true,
				options: {
					fieldset: { attrs: { class: 'form-group' } },
					label: { content: 'Stay signed in &nbsp;' }
				}
			},
			signin: {
				type: 'button',
				text: 'Sign In',
				style: 'btn-primary',
				options: {
					fieldset: { attrs: { class: 'form-group' } }
				}
			}
		}),

		simple_form_mapper: {
			$module: 'ui/form/mapper/form-mapper',
			$params: {}
		},

		form_simple: {
			$module: 'ui/form/form',
			$params: {
				name: 'form_simple',
				action: 'http:/localhost:9393/',
				model: '$bone!form_simple_model',
				mapper: '$bone!simple_form_mapper'
			}
		},

		$actions: [
			{ '$bone!p_form_simple.addAll': [['$bone!form_simple']] }
		]

	};

});
