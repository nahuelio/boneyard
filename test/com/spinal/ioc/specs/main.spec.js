/**
*	Main Spec Test
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*
*	Composition Layer (Inversion of control)
*
*	Notations:
*		$specs, (inheritance model for specs) OK
*		$module -> (class, params)
*		$ready -> (operations)
*
*	String notations:
*		$bone! [boneId] -> Access to bones
*		$bone! [boneId] . [property | method] Access to bone's properties or methods
*
*	- See if an IoC implementation should compose app flow like declaring event binding
*	(when 'ready' state happens)
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
				params: { el: 'div.global', css: '$bone!theme' }
			},
			$ready: {
				add: ['$bone!header'],
				add: ['$bone!content'],
				add: ['$bone!footer']
			}
		},

		viewA: {
			$module: {
				class: 'ui/view',
				params: { id: 'viewA' }
			},
			$ready: {
				'$bone!content.add': ['viewA', { renderOnAdd: true }]
			}
		},

		viewB: {
			$module: {
				class: 'ui/view',
				params: { id: 'viewB' }
			},
			$ready: {
				'$bone!content.add': ['viewB', { renderOnAdd: true }]
			}
		},

		$plugins: ['aop', 'poly', 'i18n']

	};

});
