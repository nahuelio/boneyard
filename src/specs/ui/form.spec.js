/**
*	SpinalJS Form Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define(['specs/ui/form/form.controls.spec'], function(FormControlsSpec) {

	return {

		$id: 'ui-form',
		$specs: [FormControlsSpec],

		form_header: {
			$module: 'ui/basic/header',
			$params: {
				id: 'form_header',
				content: 'Form <small><kbd>com.spinal.ui.form</kbd></small>',
				heading: '2'
			}
		},

		cform: {
			$module: 'ui/misc/panel',
			$params: { id: 'ui-form-form', title: 'Form' }
		},

		/** Define Form Component **/

		$ready: [{
			'$bone!global.addAll': [[
				'$bone!form_header',
				'$bone!cform',
			], { renderOnAdd: true }]
		}]

	};

});
