/**
*	Plugin Spec Test
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define([], function() {

	return {

		$id: 'plugin',

		account_html: 'html/account.json',
		cart_html: 'html/cart.json',

		boneyard_theme: 'com/boneyard/ioc/themes/boneyard.css',
		silver_theme: 'com/boneyard/ioc/themes/silver.css',

		container: {
			$module: 'ui/container',
			$params: { id: 'mycontainer' }
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
			{ '$bone!global.add': ['$bone!container'] },
			{ '$bone!container.add': ['$bone!account'] },
			{ '$bone!container.add': ['$bone!cart'] },
			{ '$bone!container.render': [] }
		],

		$plugins: {

			html: {
				config: { basePath: 'text!test/com/boneyard/ioc' },
				account: { path: '$bone!account_html', lazyload: true },
				cart: { path: '$bone!cart_html', lazyload: true },
				checkout: { path: 'html/checkout.json' },
				product: { path: 'html/product.json' }
			},

			theme: {
				config: { basePath: 'test', bootstrap: true, defaultTheme: true },
				boneyard: { path: 'com/boneyard/ioc/themes/boneyard.css', default: true },
				silver: { path: '$bone!silver_theme' }
			}

		}

	};

});
