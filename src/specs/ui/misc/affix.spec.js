/**
*	SpinalJS Affix Component Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define([], function() {

	return {

		$id: 'ui-misc-affix',

		components: {
			$module: 'ui/list/list',
			$params: {
				cls: 'nav',
				items: [
					{ template: '<a href="#paragraph">Paragraph</a>' },
					{ template: '<a href="#link">Link</a>' },
					{ template: '<a href="#header">Header</a>' },
					{ template: '<a href="#label">Label</a>' },
					{ template: '<a href="#span">Span</a>' }
				]
			}
		},

		affix: {
			$module: 'ui/misc/affix',
			$params: {
				id: 'navigation',
				list: '$bone!components',
				attrs: { 'data-spy': 'affix' },
				config: { offset: { top: 290, bottom: 150 } }
			}
		},

		$ready: [{
			'$bone!menu.add': ['$bone!affix', { renderOnAdd: true }]
		}]

	};

});
