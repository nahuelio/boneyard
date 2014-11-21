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
				spinal: { path: 'templates/spinal-tpl', lazyLoading: true },
				ui: { path: 'templates/ui-tpl' }
			},
			theme: {
				spinal: { path: 'base/test/com/spinal/ioc/themes/spinal.css', default: true },
				bootstrap: { path: 'base/test/com/spinal/ioc/themes/bootstrap.css' }
			}
		}

	};

});
