/**
*	SpinalJS Basic Component Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-misc-panel',

		panel_simple: {
			$module: 'ui/misc/panel',
			$params: { id: 'panel_simple', title: 'Simple Panel' }
		},

		$ready: [{
			'$bone!cpanel.addAll': [[
				'$bone!panel_simple'
			], { renderOnAdd: true }]
		}]

	};

});
