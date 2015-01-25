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
					{ cls: 'bg-primary', template: '<h4>Components</h4>' },
					{ template: '<a href="#paragraph">Paragraph</a>' },
					{ template: '<a href="#link">Link</a>' },
					{ template: '<a href="#header">Header</a>' },
					{ template: '<a href="#label">Label</a>' },
					{ template: '<a href="#span">Span</a>' },
					{ template: '<a href="#image">Images</a>' },
					{ template: '<a href="#form">Form</a>' },
					{ template: '<a href="#fieldset">Fieldset</a>' },
					{ template: '<a href="#buttons">Buttons</a>' },
					{ template: '<a href="#inputs">Inputs</a>' },
					{ template: '<a href="#textarea">Textarea</a>' },
					{ template: '<a href="#select">Select</a>' },
					{ template: '<a href="#list">List</a>' },
					{ template: '<a href="#table">Table</a>' },
					{ template: '<a href="#panel">Panel</a>' },
					{ template: '<a href="#dropdown">Dropdown</a>' },
					{ template: '<a href="#dialog">Dialog</a>' },
					{ template: '<a href="#autocomplete">Autocomplete</a>' },
				]
			}
		},

		affix: {
			$module: 'ui/misc/affix',
			$params: {
				id: 'navigation',
				list: '$bone!components',
				cls: 'affix-top',
				attrs: { 'data-spy': 'affix' },
				config: { offset: { top: 290 } }
			}
		},

		$ready: [{
			'$bone!menu.add': ['$bone!affix', { renderOnAdd: true }]
		}]

	};

});
