/**
*	SpinalJS Basic Component Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-form-controls-button',

		btn_simple: {
			$module: 'ui/form/controls/button',
			$params: { id: 'btn_simple', text: 'Simple' }
		},

		btn_primary: {
			$module: 'ui/form/controls/button',
			$params: { id: 'btn_primary', text: 'Primary', type: 'btn-primary' }
		},

		btn_info: {
			$module: 'ui/form/controls/button',
			$params: { id: 'btn_info', text: 'Info', type: 'btn-info' }
		},

		btn_warning: {
			$module: 'ui/form/controls/button',
			$params: { id: 'btn_warning', text: 'Warning', type: 'btn-warning' }
		},

		btn_danger: {
			$module: 'ui/form/controls/button',
			$params: { id: 'btn_danger', text: 'Danger', type: 'btn-danger' }
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
