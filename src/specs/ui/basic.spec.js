/**
*	SpinalJS Basic Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define(['specs/ui/basic/paragraph.spec',
	'specs/ui/basic/link.spec',
	'specs/ui/basic/header.spec'], function(ParagraphSpec, LinkSpec, HeaderSpec) {

	return {

		$id: 'ui-basic',
		$specs: [ParagraphSpec, LinkSpec, HeaderSpec],

		cparagraph: {
			$module: 'ui/misc/panel',
			$params: { id: 'ui-basic-paragraph', title: 'Paragraph' }
		},

		clink: {
			$module: 'ui/misc/panel',
			$params: { id: 'ui-basic-link', title: 'Link' }
		},

		cheader: {
			$module: 'ui/misc/panel',
			$params: { id: 'ui-basic-header', title: 'Headers' }
		},

		clabel: {
			$module: 'ui/misc/panel',
			$params: { id: 'ui-basic-label', title: 'Label' }
		},

		cspan: {
			$module: 'ui/misc/panel',
			$params: { id: 'ui-basic-span', title: 'Spans' }
		},

		cimage: {
			$module: 'ui/misc/panel',
			$params: { id: 'ui-basic-image', title: 'Images' }
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
		}]

	};

});
