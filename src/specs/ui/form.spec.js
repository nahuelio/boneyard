/**
*	SpinalJS Form Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define(['specs/ui/form/form.login.spec',
	'specs/ui/form/form.controls.spec'], function(FormLoginSpec, FormControlsSpec) {

	return {

		$id: 'ui-form',
		$specs: [FormLoginSpec, FormControlsSpec],

		form_header: {
			$module: 'ui/basic/header',
			$params: {
				content: 'Form <small><kbd>com.spinal.ui.form</kbd></small>',
				heading: '2'
			}
		},

		p_form_login: {
			$module: 'ui/misc/panel',
			$params: { id: 'p_form_login', title: 'Login Form' }
		},

		cform: {
			$module: 'ui/container',
			$params: { id: 'form', views: ['$bone!p_form_login'] }
		},

		form_controls_header: {
			$module: 'ui/basic/header',
			$params: {
				content: 'Form Controls <small><kbd>com.spinal.ui.form.controls</kbd></small>',
				heading: '2'
			}
		},

		cform_controls: {
			$module: 'ui/container',
			$params: { id: 'cform_controls' }
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
