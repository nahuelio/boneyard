/**
*	SpinalJS Misc Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define(['specs/ui/misc/panel.spec'], function(PanelSpec) {

	return {

		$id: 'ui-misc',
		$specs: [PanelSpec],

		misc_header: {
			$module: 'ui/basic/header',
			$params: {
				content: 'Miscellaneous <small><kbd>com.spinal.ui.misc</kbd></small>',
				heading: '2'
			}
		},

		cpanel: {
			$module: 'ui/misc/panel',
			$params: { title: 'Panels' }
		},

		cdropdown: {
			$module: 'ui/misc/panel',
			$params: { title: 'Dropdown' }
		},

		cdialog: {
			$module: 'ui/misc/panel',
			$params: { title: 'Dialog' }
		},

		cautocomplete: {
			$module: 'ui/misc/panel',
			$params: { title: 'Autocomplete' }
		},

		caffix: {
			$module: 'ui/misc/panel',
			$params: { title: 'Affix' }
		},

		ccarousel: {
			$module: 'ui/misc/panel',
			$params: { title: 'Carousel' }
		},

		cpaginator: {
			$module: 'ui/misc/panel',
			$params: { title: 'Paginator' }
		},

		$ready: [{
			'$bone!global.addAll': [[
				'$bone!misc_header',
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
