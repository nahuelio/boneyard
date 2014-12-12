/**
*	SpinalJS Form Controls Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define(['specs/ui/form/controls/button.spec'], function(ButtonSpec) {

	return {

		$id: 'ui-form-controls',
		$specs: [ButtonSpec],

		cbutton: {
			$module: 'ui/misc/panel',
			$params: { id: 'ui-form-controls-button', title: 'HTML Buttons' }
		},

		$ready: [{
			'$bone!cbutton.addAll': [[
				'$bone!btn_simple',
				'$bone!btn_primary',
				'$bone!btn_info',
				'$bone!btn_warning',
				'$bone!btn_danger'
			]]
		}, {
			'$bone!global.add': ['$bone!cbutton', { renderOnAdd: true }]
		}]

	};

});
