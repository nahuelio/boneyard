/**
*	Plugin Spec Test
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define([], function() {

	return {

		$id: 'plugin',

		templates_my: { path: 'tpls/my-tpl', lazyLoading: true },
		templates_other: { path: 'tpls/other-tpl' },

		theme_my: { url: 'skins/my.css', _default: true },
		theme_other: { url: 'skins/other.css' },

		container: {
			$module: 'ui/container',
			$params: { el: 'div.global' }
		},

		view: {
			$module: 'ui/view',
			$params: { id: 'child' }
		},

		$actions: [
			{ '$bone!container.add': ['$bone!view', { renderOnAdd: true }] }
		],

		$plugins: {
			html: { my: '$bone!templates_my', other: '$bone!templates_other' },
			theme: {
				config: { basePath: '/base/test/themes/', bootstrap: true },
				my: '$bone!theme_my',
				other: '$bone!theme_other'
			}
		}

	};

});
