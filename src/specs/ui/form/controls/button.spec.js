/**
*	Boneyard Basic Component Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-form-controls-button',

		btn_simple: {
			$module: 'ui/form/controls/button',
			$params: { text: 'Simple', attrs: { style: 'margin: 0 5px;' } }
		},

		btn_primary: {
			$module: 'ui/form/controls/button',
			$params: { text: 'Primary', style: 'btn-primary', attrs: { style: 'margin: 0 5px;' } }
		},

		btn_success: {
			$module: 'ui/form/controls/button',
			$params: { text: 'Success', style: 'btn-success', attrs: { style: 'margin: 0 5px;' } }
		},

		btn_info: {
			$module: 'ui/form/controls/button',
			$params: { text: 'Info', style: 'btn-info', attrs: { style: 'margin: 0 5px;' } }
		},

		btn_warning: {
			$module: 'ui/form/controls/button',
			$params: { text: 'Warning', style: 'btn-warning', attrs: { style: 'margin: 0 5px;' } }
		},

		btn_danger: {
			$module: 'ui/form/controls/button',
			$params: { text: 'Danger', style: 'btn-danger', attrs: { style: 'margin: 0 5px;' } }
		},

		$actions: [{
			'$bone!cbutton.addAll': [[
				'$bone!btn_simple',
				'$bone!btn_primary',
				'$bone!btn_success',
				'$bone!btn_info',
				'$bone!btn_warning',
				'$bone!btn_danger'
			]]
		}]

	};

});
