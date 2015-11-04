/**
*	Boneyard Form Controls Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define(['specs/ui/form/controls/button.spec',
		'specs/ui/form/controls/fieldset.spec',
		'specs/ui/form/controls/input.spec',
		'specs/ui/form/controls/select.spec',
		'specs/ui/form/controls/textarea.spec'], function(ButtonSpec, FieldsetSpec, InputSpec, SelectSpec,
			TextareaSpec) {

	return {

		$id: 'ui-form-controls',
		$specs: [ButtonSpec, FieldsetSpec, InputSpec, SelectSpec, TextareaSpec],

		cfieldset: {
			$module: 'ui/misc/panel',
			$params: { id: 'fieldset', title: 'HTML Fieldset' }
		},

		cbutton: {
			$module: 'ui/misc/panel',
			$params: { id: 'button', title: 'HTML Buttons' }
		},

		cinput: {
			$module: 'ui/misc/panel',
			$params: { id: 'input', title: 'HTML Inputs' }
		},

		ctextarea: {
			$module: 'ui/misc/panel',
			$params: { id: 'textarea', title: 'HTML Textarea' }
		},

		cselect: {
			$module: 'ui/misc/panel',
			$params: { id: 'select', title: 'HTML Select' }
		},

		$actions: [{
			'$bone!cform_controls.addAll': [[
				'$bone!cfieldset',
				'$bone!cbutton',
				'$bone!cinput',
				'$bone!ctextarea',
				'$bone!cselect'
			]]
		}]

	};

});
