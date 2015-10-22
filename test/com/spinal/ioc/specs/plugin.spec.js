/**
*	Plugin Spec Test
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define([], function() {

	return {

		$id: 'plugin',

		account_html: 'html/account.json',
		cart_html: 'html/cart.json',

		spinal_theme: 'com/spinal/ioc/themes/spinal.css',
		silver_theme: 'com/spinal/ioc/themes/silver.css',

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

			html: {
				config: { basePath: 'text!/base/test/com/spinal/ioc' },
				account: { path: '$bone!account_html', lazyload: true },
				cart: { path: '$bone!cart_html' },
				checkout: { path: 'html/checkout.json' }
			},

			theme: {
				config: { basePath: '/base/test', bootstrap: true, defaultTheme: true },
				spinal: { path: '$bone!spinal_theme', default: true },
				silver: { path: '$bone!silver_theme' }
			}

		}

	};

});
