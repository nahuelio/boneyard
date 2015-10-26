/**
*	SpinalJS Form Simple Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-form-simple',

		form_l_s: { $module: 'ui/basic/paragraph', $params: { content: '<code>Simple Form</code>' } },

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

		form_simple_mapper: {
			$module: 'ui/form/mapper/form-mapper'
		},

		form_simple: {
			$module: 'ui/form/form',
			$params: {
				name: 'form_simple',
				action: 'http:/localhost:9393/',
				model: '$bone!form_simple_model',
				mapper: '$bone!form_simple_mapper'
			}
		},

		$actions: [
			{ '$bone!cform.addAll': [['$bone!form_l_s', '$bone!form_simple']] }
		]

	};

});
