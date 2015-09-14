/**
*	SpinalJS Form Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define(['specs/ui/form/form.simple.spec',
	'specs/ui/form/form.advanced.spec',
	'specs/ui/form/form.controls.spec'], function(FormSimpleSpec, FormAdvancedSpec, FormControlsSpec) {

	return {

		$id: 'ui-form',
		//$specs: [FormSimpleSpec, FormAdvancedSpec, FormControlsSpec],
		$specs: [FormSimpleSpec, FormControlsSpec],

		form_header: {
			$module: 'ui/basic/header',
			$params: {
				content: 'Form <small><kbd>com.spinal.ui.form</kbd></small>',
				heading: '2'
			}
		},

		cform: {
			$module: 'ui/misc/panel',
			$params: { id: 'form', title: 'Form' }
		},

		$ready: [{
			'$bone!global.addAll': [[
				'$bone!form_header',
				'$bone!cform'
			], { renderOnAdd: true }]
		}]

	};

});
