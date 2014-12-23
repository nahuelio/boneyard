/**
*	Plugin Spec Test
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define([], function() {

	return {

		$id: 'plugin',

		container: {
			$module: 'ui/container',
			$params: { el: 'div.global' }
		},

		view: {
			$module: 'ui/view',
			$params: { id: 'child' }
		},

		$ready: [
			{ '$bone!container.add': ['$bone!view', { renderOnAdd: true }] }
		],

		$plugins: {
			html: {
				my: { path: 'tpls/my-tpl', lazyLoading: true },
				other: { path: 'tpls/other-tpl' }
			},
			theme: {
				config: { basePath: '/base/test/themes/', bootstrap: true },
				my: { url: '/base/test/com/spinal/ioc/skins/my.css', _default: true },
				yours: { url: '/base/test/com/spinal/ioc/skins/yours.css' }
			}
		}

	};

});