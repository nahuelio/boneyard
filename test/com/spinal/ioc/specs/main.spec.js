/**
*	Main Spec Test
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['specs/header.spec',
		'specs/footer.spec'], function(HeaderSpec, FooterSpec) {

	return {

		$id: 'main',

		$specs: [HeaderSpec, FooterSpec],

		theme: 'chrome',

		global: {
			$module: 'ui/container',
			$params: { el: 'div.global', cls: '$bone!theme' }
		},

		viewA: {
			$module: 'ui/view',
			$params: { id: 'viewA' }
		},

		viewB: {
			$module: 'ui/view',
			$params: { id: 'viewB' }
		},

		$ready: [
			{ '$bone!global.add': ['$bone!header'] },
			{ '$bone!global.add': ['$bone!footer'] },
			{
				'$bone!global.add': ['$bone!content'],
				'$bone!global.update': [{ silent: true }]
			},
			{ '$bone!content.add': ['$bone!viewA', { renderOnAdd: true }] },
			{ '$bone!content.add': ['$bone!viewB', { renderOnAdd: true }] },
			{ '$bone!content.render': [] }
		]

	};

});
