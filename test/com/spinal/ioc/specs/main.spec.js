/**
*	Main Spec Test
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['specs/header.spec',
		'specs/footer.spec'], function(HeaderSpec, FooterSpec) {

	return {

		$specs: [HeaderSpec, FooterSpec],

		theme: 'chrome',

		global: {
			$module: 'ui/container',
			$params: { el: 'div.global', css: '$bone!theme' },
			$ready: [
				{ add: ['$bone!header'] },
				{ add: ['$bone!content'], update: [{ silent: true }] },
				{ add: ['$bone!footer'] }
			]
		},

		viewA: {
			$module: 'ui/view',
			$params: { id: 'viewA' },
			$ready: [
				{ '$bone!content.add': ['$this', { renderOnAdd: true }] }
			]
		},

		viewB: {
			$module: 'ui/view',
			$params: { id: 'viewB' },
			$ready: [
				{ '$bone!content.add': ['$this', { renderOnAdd: true }] }
			]
		}

	};

});
