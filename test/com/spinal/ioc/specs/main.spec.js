/**
*	Main Spec Test
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define({

	theme: 'chrome',

	global: {
		$create: {
			$module: 'ui/container',
			$params: { el: 'div.global' }
		},
		$ready: {
			add: { $ref: 'header' },
			add: { $ref: 'content' },
			add: { $ref: 'footer' },
			render: {}
		}
	},

	viewA: {
		$create: {
			$module: 'ui/view',
			$params: { id: 'viewA' }
		},
		$ready: {
			$ref: { 'content!add': ['viewA', { renderOnAdd: true }] }
		}
	},

	viewB: {
		$create: {
			$module: 'ui/view',
			$params: { id: 'viewB' }
		},
		$ready: {
			$ref: { 'content!add': ['viewB', { renderOnAdd: true }] }
		}
	}

	/** Plugins or Additional Features **/

	/**
	*	$aop: { },
	*	$poly: { },
	*	$i18n: { }, etc
	**/

});
