/**
*	SpinalJS Basic Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-basic',

		cparagraph: {
			$module: 'ui/container',
			$params: { id: 'ui-basic-paragraph', title: 'HTML Paragraph' }
		},

		clink: {
			$module: 'ui/container',
			$params: { id: 'ui-basic-link', title: 'HTML Link' }
		},

		cheader: {
			$module: 'ui/container',
			$params: { id: 'ui-basic-header', title: 'HTML Headers' }
		},

		clabel: {
			$module: 'ui/container',
			$params: { id: 'ui-basic-label', title: 'HTML Label' }
		},

		cspan: {
			$module: 'ui/container',
			$params: { id: 'ui-basic-span', title: 'HTML Spans' }
		},

		cimage: {
			$module: 'ui/container',
			$params: { id: 'ui-basic-image', title: 'HTML Images' }
		},

		$ready: [{
			'$bone!global.addAll': [[
				'$bone!cparagraph',
				'$bone!clink',
				'$bone!cheader',
				'$bone!clabel',
				'$bone!cspan',
				'$bone!cimage'
			], { renderOnAdd: true }]
		}, {
			'$bone!cparagraph.addClass': ['panel'],
			'$bone!clink.addClass': ['panel'],
			'$bone!cheader.addClass': ['panel'],
			'$bone!clabel.addClass': ['panel'],
			'$bone!cspan.addClass': ['panel'],
			'$bone!cimage.addClass': ['panel']
		}]

	};

});
