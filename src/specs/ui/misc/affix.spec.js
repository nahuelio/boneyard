/**
*	SpinalJS Affix Component Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define([], function() {

	return {

		$id: 'ui-misc-affix',

		components_items: new Backbone.Collection([
			{ content: { href: '#paragraph', content: 'Paragraph' } },
			{ content: { href: '#link', content: 'Link' } },
			{ content: { href: '#header', content: 'Header' } },
			{ content: { href: '#label', content: 'Label' } },
			{ content: { href: '#span', content: 'Span' } },
			{ content: { href: '#image', content: 'Image' } },
			{ content: { href: '#form', content: 'Form' } },
			{ content: { href: '#fieldset', content: 'Fieldset' } },
			{ content: { href: '#button', content: 'Button' } },
			{ content: { href: '#input', content: 'Input' } },
			{ content: { href: '#textarea', content: 'Textarea' } },
			{ content: { href: '#select', content: 'Select' } },
			{ content: { href: '#list', content: 'List' } },
			{ content: { href: '#table', content: 'Table' } },
			{ content: { href: '#panel', content: 'Panel' } },
			{ content: { href: '#dropdown', content: 'Dropdown' } },
			{ content: { href: '#dialog', content: 'Dialog' } },
			{ content: { href: '#autocomplete', content: 'Autocomplete' } }
		]),

		components: {
			$module: 'ui/list/list',
			$params: {
				cls: 'nav',
				collection: '$bone!components_items'
			}
		},

		affix: {
			$module: 'ui/misc/affix',
			$params: {
				id: 'navigation',
				title: 'Components',
				list: '$bone!components',
				cls: 'affix-top',
				attrs: { 'data-spy': 'affix' },
				config: { offset: { top: 290 } }
			}
		},

		$actions: [{
			'$bone!menu.add': ['$bone!affix', { renderOnAdd: true }]
		}]

	};

});
