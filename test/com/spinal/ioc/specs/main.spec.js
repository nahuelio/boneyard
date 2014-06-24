/**
*	Main Spec Test
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*
*	Notations:
*		$specs, (inheritance model for specs)
*		(Life Cycle phases)
*		$module (class, args)
*		$ready (methods)
*		$destroy (methods)
*
*	String notations:
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
			$module: {
				class: 'ui/container',
				args: { el: 'div.global', theme: '$bone!theme' }
			},
			$ready: {
				add: ['$bone!header'],
				add: ['$bone!content'],
				add: ['$bone!footer']
			},
			$destroy: {}
		},

		viewA: {
			$module: {
				class: 'ui/view',
				args: { id: 'viewA' }
			},
			$ready: {
				'$bone!content:add': ['viewA', { renderOnAdd: true }]
			},
			$destroy: {}
		},

		viewB: {
			$module: {
				class: 'ui/view',
				args: { id: 'viewB' }
			},
			$ready: {
				'$bone!content:add': ['viewB', { renderOnAdd: true }]
			},
			$destroy: {}
		},

		$plugins: ['aop', 'poly', 'i18n']

	};

});
