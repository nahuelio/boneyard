/**
*	SpinalJS Form Advanced Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-form-advanced',

		form_l_a: { $module: 'ui/basic/paragraph', $params: { content: '<code>Advanced Form</code>' } },

		form_advanced_collection: new Backbone.Collection([
			{ login: 'username' },
			{ password: '' }
		]),

		form_advanced_collection: new Backbone.Collection([{
			type: 'Input',
			value: 'johndoe',
			placeholder: 'Enter Username...',
			options: {
				fieldset: { attrs: { cls: 'fieldset' } },
				label: { content: 'Username' }
			}
		}, {
			type: 'Password',
			options: {
				fieldset: { attrs: { cls: 'fieldset' } },
				label: { content: 'Password' }
			}
		}, {
			type: 'Checkbox',
			value: true,
			options: {
				fieldset: { attrs: { cls: 'fieldset' } },
				label: { content: 'Stay signed in' }
			}
		}]),

		form_advanced: {
			$module: 'ui/form/form',
			$params: {
				name: 'form_advanced',
				action: 'http:/localhost:9393/',
				collection: '$bone!form_advanced_collection'
			}
		},

		$actions: [{
			'$bone!cform.addAll': [[
				'$bone!form_l_a',
				'$bone!form_advanced'
			]]
		}]

	};

});
