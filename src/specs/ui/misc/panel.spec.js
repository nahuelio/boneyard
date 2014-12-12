/**
*	SpinalJS Basic Component Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-misc-panel',

		panelContent: {
			$module: 'ui/basic/paragraph',
			$params: { id: 'panelContent', content: 'Simple Text Content or with <strong>HTML</strong>' }
		},

		panel_simple: {
			$module: 'ui/misc/panel',
			$params: { id: 'panel_simple', title: 'Simple Panel' }
		},

		panel_primary: {
			$module: 'ui/misc/panel',
			$params: { id: 'panel_primary', title: 'Primary Panel', type: 'panel-primary' }
		},

		panel_success: {
			$module: 'ui/misc/panel',
			$params: { id: 'panel_success', title: 'Success Panel', type: 'panel-success' }
		},

		panel_info: {
			$module: 'ui/misc/panel',
			$params: { id: 'panel_info', title: 'Info Panel', type: 'panel-info' }
		},

		panel_warning: {
			$module: 'ui/misc/panel',
			$params: { id: 'panel_warning', title: 'Warning Panel', type: 'panel-warning' }
		},

		panel_danger: {
			$module: 'ui/misc/panel',
			$params: { id: 'panel_danger', title: 'Danger Panel', type: 'panel-danger' }
		},

		$ready: [{
			'$bone!cpanel.addAll': [[
				'$bone!panel_simple',
				'$bone!panel_primary',
				'$bone!panel_success',
				'$bone!panel_info',
				'$bone!panel_warning',
				'$bone!panel_danger'
			], { renderOnAdd: true }]
		}, {
			'$bone!panel_simple.add': ['$bone!panelContent', { renderOnAdd: true }]
		}]

	};

});
