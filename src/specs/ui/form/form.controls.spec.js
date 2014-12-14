/**
*	SpinalJS Form Controls Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define(['specs/ui/form/controls/button.spec'], function(ButtonSpec) {

	return {

		$id: 'ui-form-controls',
		$specs: [ButtonSpec],

		cfieldset: {
			$module: 'ui/misc/panel',
			$params: { id: 'ui-form-controls-fieldset', title: 'HTML Fieldset' }
		},

		cbutton: {
			$module: 'ui/misc/panel',
			$params: { id: 'ui-form-controls-button', title: 'HTML Buttons' }
		},

		cinput: {
			$module: 'ui/misc/panel',
			$params: { id: 'ui-form-controls-input', title: 'HTML Inputs' }
		},

		ctextarea: {
			$module: 'ui/misc/panel',
			$params: { id: 'ui-form-controls-textarea', title: 'HTML Textarea' }
		},

		cselect: {
			$module: 'ui/misc/panel',
			$params: { id: 'ui-form-controls-select', title: 'HTML Select' }
		},

		$ready: [{
			'$bone!global.addAll': [[
				'$bone!cfieldset',
				'$bone!cbutton',
				'$bone!cinput',
				'$bone!ctextarea',
				'$bone!cselect'
			], { renderOnAdd: true }]
		}]

	};

});
