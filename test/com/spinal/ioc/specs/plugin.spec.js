/**
*	Plugin Spec Test
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define([], function() {

	return {

		$id: 'plugin',

		account_html: { path: 'tpls/account', lazyload: true },
		cart_html: { path: 'tpls/cart' },

		minimal: { url: 'skins/minimal.css', default: true },
		silver: { url: 'skins/silver.css' },

		container: {
			$module: 'ui/container',
			$params: { el: 'div.global' }
		},

		account: {
			$module: 'ui/container',
			$params: { id: 'account' }
		},

		cart: {
			$module: 'ui/view',
			$params: { id: 'cart' }
		},

		$actions: [
			{ '$bone!container.add': ['$bone!account'] },
			{ '$bone!container.add': ['$bone!cart'] },
			{ '$bone!container.render': [] }
		],

		$plugins: {
			html: { account: '$bone!account_html', cart: '$bone!cart_html' },
			theme: {
				config: { basePath: '/base/test/themes/' },
				bootstrap: ['bootstrap/css/bootstrap.min.css', 'bootstrap/css/bootstrap-theme.min.css'],
				minimal: '$bone!minimal',
				silver: '$bone!silver'
			}
		}

	};

});
