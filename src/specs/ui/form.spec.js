/**
*	SpinalJS Form Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define(['specs/ui/form/form.simple.spec',
	'specs/ui/form/form.advanced.spec',
	'specs/ui/form/form.controls.spec'], function(FormSimpleSpec, FormAdvancedSpec, FormControlsSpec) {

	return {

		$id: 'ui-form',
		$specs: [FormControlsSpec],

		form_controls_header: {
			$module: 'ui/basic/header',
			$params: {
				content: 'Form Controls <small><kbd>com.spinal.ui.form.controls</kbd></small>',
				heading: '2'
			}
		},

		form_header: {
			$module: 'ui/basic/header',
			$params: {
				content: 'Form Controls <small><kbd>com.spinal.ui.form</kbd></small>',
				heading: '2'
			}
		},

		cform_controls: {
			$module: 'ui/misc/panel',
			$params: { id: 'form-simple', title: 'Form Controls' }
		},

		$actions: [
			{ '$bone!global.addAll': [[
				'$bone!form_controls_header',
				'$bone!cform_controls',
				'$bone!form_header'
			]]
		}]

	};

});
