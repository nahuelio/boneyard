/**
*	Main Spec Test
*	@author Patricio Ferreira <3dimentionar@gmail.com>
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
			$ready: [
				{ add: ['$bone!header'] },
				{ add: ['$bone!content'], update: [{ silent: true }] },
				{ add: ['$bone!footer'] }
			]
		},

		viewA: {
			$module: {
				class: 'ui/view',
				params: { id: 'viewA' }
			},
			$ready: [
				{ '$bone!content.add': ['$this', { renderOnAdd: true }] }
			]
		},

		viewB: {
			$module: {
				class: 'ui/view',
				params: { id: 'viewB' }
			},
			$ready: [
				{ '$bone!content.add': ['$this', { renderOnAdd: true }] }
			]
		}

		//$plugins: ['aop', 'poly', 'i18n', 'theme']

		/** Possible updated to the spec structure -> i.e:
			viewB: {
				$class: 'ui/container',
				$params: { el: 'div.global', css: '$bone!theme' },
				$ready: [
					{ '$bone!content.add': ['args'] },
					{ '$bone!content.add': ['args'] }
				]
			}
		**/

	};

});
