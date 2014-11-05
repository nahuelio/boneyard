/**
*	Plugin Spec Test
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define([], function() {

	return {

		container: {
			$module: { class: 'ui/container', params: { el: 'div.global' } },
			$ready: [
				{ add: ['$bone!view', { renderOnAdd: true }] },
				{ render: [] }
			]
		},

		view: {
			$module: { class: 'ui/view', params: { id: 'child' } }
		},

		$plugins: {
			// Usage: context.changeTheme('spinal');
			theme: {
				spinal: { path: 'base/test/com/spinal/ioc/themes/spinal.css', default: true },
				bootstrap: { path: 'base/test/com/spinal/ioc/themes/bootstrap.css' }
			},
			// Usage: context.tpl('[package]!ui.button', { label: 'saraza', ... });
			html: {
				spinal: { path: 'templates/spinal-tpl', default: true, lazyLoading: true },
				ui: { path: 'templates/ui-tpl' }
			}
		}

	};

});
