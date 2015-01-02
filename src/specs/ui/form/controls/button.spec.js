/**
*	SpinalJS Basic Component Spec
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
			$params: { text: 'Primary', type: 'btn-primary', attrs: { style: 'margin: 0 5px;' } }
		},

		btn_info: {
			$module: 'ui/form/controls/button',
			$params: { text: 'Info', type: 'btn-info', attrs: { style: 'margin: 0 5px;' } }
		},

		btn_warning: {
			$module: 'ui/form/controls/button',
			$params: { text: 'Warning', type: 'btn-warning', attrs: { style: 'margin: 0 5px;' } }
		},

		btn_danger: {
			$module: 'ui/form/controls/button',
			$params: { text: 'Danger', type: 'btn-danger', attrs: { style: 'margin: 0 5px;' } }
		},

		$ready: [{
			'$bone!cbutton.addAll': [[
				'$bone!btn_simple',
				'$bone!btn_primary',
				'$bone!btn_info',
				'$bone!btn_warning',
				'$bone!btn_danger'
			], { renderOnAdd: true }]
		}]

	};

});
