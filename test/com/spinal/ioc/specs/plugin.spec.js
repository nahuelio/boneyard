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
			html: { path: 'templates', autowire: true }
			//theme: { paths: [], default: 'default' },
			//aop: { }
		}

	};

});
