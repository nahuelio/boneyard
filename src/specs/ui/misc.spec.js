/**
*	SpinalJS Misc Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define(['specs/ui/misc/panel.spec'], function(PanelSpec) {

	return {

		$id: 'ui-misc',
		$specs: [PanelSpec],

		cpanel: {
			$module: 'ui/misc/panel',
			$params: { id: 'ui-misc-panel', title: 'Panel' }
		},

		cdropdown: {
			$module: 'ui/misc/panel',
			$params: { id: 'ui-misc-dropdown', title: 'Dropdown' }
		},

		cdialog: {
			$module: 'ui/misc/panel',
			$params: { id: 'ui-misc-dialog', title: 'Dialog' }
		},

		cautocomplete: {
			$module: 'ui/misc/panel',
			$params: { id: 'ui-misc-autocomplete', title: 'Autocomplete' }
		},

		caffix: {
			$module: 'ui/misc/panel',
			$params: { id: 'ui-misc-affix', title: 'Affix' }
		},

		ccarousel: {
			$module: 'ui/misc/panel',
			$params: { id: 'ui-misc-carousel', title: 'Carousel' }
		},

		cpaginator: {
			$module: 'ui/misc/panel',
			$params: { id: 'ui-misc-paginator', title: 'Paginator' }
		},

		$ready: [{
			'$bone!global.addAll': [[
				'$bone!cpanel',
				'$bone!cdropdown',
				'$bone!cdialog',
				'$bone!cautocomplete',
				'$bone!caffix',
				'$bone!ccarousel',
				'$bone!cpaginator'
			], { renderOnAdd: true }]
		}]

	};

});
