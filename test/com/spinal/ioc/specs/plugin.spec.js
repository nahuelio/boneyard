/**
*	Plugin Spec Test
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define([], function() {

	return {

		container: {
			$class: 'ui/container',
			$params: { el: 'div.global' },
			$ready: [
				{ add: ['$bone!view', { renderOnAdd: true }] },
				{ render: [] }
			]
		},

		view: {
			$class: 'ui/view',
			$params: { id: 'child' }
		},

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
