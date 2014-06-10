/**
*	Main Spec Test
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['specs/header.spec',
		'specs/footer.spec'], function(HeaderSpec, FooterSpec) {

	return Spinal.extend({

		theme: 'chrome',

		global: {
			$create: {
				$module: 'ui/container',
				$params: { el: 'div.global', theme: '$theme' } }
			},
			$ready: {
				add: { $ref: 'header' },
				add: { $ref: 'content' },
				add: { $ref: 'footer' },
				render: {}
			},
			$destroy: { }
		},

		viewA: {
			$create: {
				$module: 'ui/view',
				$params: { id: 'viewA' }
			},
			$ready: {
				$ref: { 'content!add': ['viewA', { renderOnAdd: true }] }
			},
			$destroy: { }
		},

		viewB: {
			$create: {
				$module: 'ui/view',
				$params: { id: 'viewB' }
			},
			$ready: {
				$ref: { 'content!add': ['viewB', { renderOnAdd: true }] }
			},
			$destroy: { }
		}

		/** Plugins or Additional Features **/

		/**
		*	$aop: { },
		*	$poly: { },
		*	$i18n: { }, etc
		**/

	}, HeaderSpec, FooterSpec);

});
