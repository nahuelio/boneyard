/**
*	SpinalJS Misc Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-misc',

		cpanel: {
			$module: 'ui/container',
			$params: { id: 'ui-misc-panel', title: 'Panel' }
		},

		cdropdown: {
			$module: 'ui/container',
			$params: { id: 'ui-misc-dropdown', title: 'Dropdown' }
		},

		cdialog: {
			$module: 'ui/container',
			$params: { id: 'ui-misc-dialog', title: 'Dialog' }
		},

		cautocomplete: {
			$module: 'ui/container',
			$params: { id: 'ui-misc-autocomplete', title: 'Autocomplete' }
		},

		caffix: {
			$module: 'ui/container',
			$params: { id: 'ui-misc-affix', title: 'Affix' }
		},

		ccarousel: {
			$module: 'ui/container',
			$params: { id: 'ui-misc-carousel', title: 'Carousel' }
		},

		cpaginator: {
			$module: 'ui/container',
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
		}, {
			'$bone!cpanel.addClass': ['panel'],
			'$bone!cdropdown.addClass': ['panel'],
			'$bone!cdialog.addClass': ['panel'],
			'$bone!cautocomplete.addClass': ['panel'],
			'$bone!caffix.addClass': ['panel'],
			'$bone!ccarousel.addClass': ['panel'],
			'$bone!cpaginator.addClass': ['panel']
		}]

	};

});
