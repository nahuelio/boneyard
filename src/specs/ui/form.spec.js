/**
*	SpinalJS Form Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define(['specs/ui/form/form.simple.spec',
	'specs/ui/form/form.advanced.spec',
	'specs/ui/form/form.controls.spec'], function(FormSimpleSpec, FormAdvancedSpec, FormControlsSpec) {

	return {

		$id: 'ui-form',
		$specs: [FormSimpleSpec, FormControlsSpec],

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
				content: 'Form <small><kbd>com.spinal.ui.form</kbd></small>',
				heading: '2'
			}
		},

		cform_controls: {
			$module: 'ui/container',
			$params: { id: 'cform_controls' }
		},

		cform: {
			$module: 'ui/container',
			$params: { id: 'form', views: ['$bone!p_form_simple', '$bone!p_form_advanced'] }
		},

		p_form_simple: {
			$module: 'ui/misc/panel',
			$params: { id: 'p_form_simple', title: 'Simple Form' }
		},

		p_form_advanced: {
			$module: 'ui/misc/panel',
			$params: { id: 'p_form_advanced', title: 'Advanced Form' }
		},

		$actions: [
			{ '$bone!global.addAll': [[
				'$bone!form_header',
				'$bone!cform',
				'$bone!form_controls_header',
				'$bone!cform_controls'
			]]
		}]

	};

});
