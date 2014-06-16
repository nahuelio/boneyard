/**
*	Main Spec Test
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*
*	Annotations:
*		$specs,
*		$create, $ready, $destroy
*		$module, $params, $call
*
*	String processors:
*		$bone! [boneId] -> Access to bones
*		$bone! [boneId] : [property | method] Access to bone's properties or methods
*
**/
define(['specs/header.spec',
		'specs/footer.spec'], function(HeaderSpec, FooterSpec) {

	return {

		$specs: [HeaderSpec, FooterSpec],

		theme: 'chrome',

		global: {
			$create: {
				$module: 'ui/container',
				$params: { el: 'div.global', theme: '$bone!theme' }
			},
			$ready: {
				add: ['$bone!header'],
				add: ['$bone!content'],
				add: ['$bone!footer'],
				render: {}
			},
			$destroy: {}
		},

		viewA: {
			$create: {
				$module: 'ui/view',
				$params: { id: 'viewA' }
			},
			$ready: {
				$call: { '$bone!content:add': ['viewA', { renderOnAdd: true }] }
			},
			$destroy: {}
		},

		viewB: {
			$create: {
				$module: 'ui/view',
				$params: { id: 'viewB' }
			},
			$ready: {
				$call: { '$bone!content:add': ['viewB', { renderOnAdd: true }] }
			},
			$destroy: {}
		}

		/** Plugins or Additional Features **/

		/**
		*	$aop: { },
		*	$poly: { },
		*	$i18n: { }, etc
		**/

	};

});
