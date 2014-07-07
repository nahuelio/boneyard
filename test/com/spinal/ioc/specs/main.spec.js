/**
*	Main Spec Test
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*
*	Composition Layer (Inversion of control)
*
*	Notations:
*		$specs, (inheritance model for specs)
*		$create ->
*			$module (class)
*			$params (parameters to pass to the constructor)
*		$ready ->
*			(operations)
*
*	String notations:
*		$bone! [boneId] -> Access to bones
*		$bone! [boneId] . [property | method] Access to bone's properties or methods
*
*	- See if an IoC implementation should compose app flow like declaring event binding
*	(when 'ready' state happends)
*
**/
define(['specs/header.spec',
		'specs/footer.spec'], function(HeaderSpec, FooterSpec) {

	return {

		$specs: [HeaderSpec, FooterSpec],

		theme: 'chrome',

		global: {
			$module: 'ui/container',
			$params: { el: 'div.global', theme: '$bone!theme' },
			$ready: {
				add: ['$bone!header'],
				add: ['$bone!content'],
				add: ['$bone!footer']
			}
		},

		viewA: {
			$module: 'ui/view',
			$params: { id: 'viewA' },
			$ready: {
				'$bone!content.add': ['viewA', { renderOnAdd: true }]
			}
		},

		viewB: {
			$module: 'ui/view',
			$params: { id: 'viewB' },
			$ready: {
				'$bone!content.add': ['viewB', { renderOnAdd: true }]
			}
		},

		$plugins: ['aop', 'poly', 'i18n']

	};

});
