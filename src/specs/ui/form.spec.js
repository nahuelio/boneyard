/**
*	SpinalJS Form Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define(['specs/ui/form/form.controls.spec'], function(FormControlsSpec) {

	return {

		$id: 'ui-form',
		$specs: [FormControlsSpec],

		cform: {
			$module: 'ui/misc/panel',
			$params: { id: 'ui-form-form', title: 'Form' }
		},

		/** Define Form Component **/

		$ready: [{
			'$bone!global.add': ['$bone!cform', { renderOnAdd: true }]
		}]

	};

});
