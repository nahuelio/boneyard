/**
*	SpinalJS List Component Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define(['ui/basic/image'], function(Image) {

	return {

		$id: 'ui-list-list',

		list_p_s: { $module: 'ui/basic/paragraph', $params: { content: '<code>Simple Styling</code>' } },
		list_p_a: { $module: 'ui/basic/paragraph', $params: { content: '<code>Advanced Styling</code>' } },

		list_items_simple: new Backbone.Collection([
			{
				cls: 'list-group-item',
				content: 'Item 1'
			},
			{
				cls: 'list-group-item',
				content: 'Item 2'
			},
			{
				cls: 'list-group-item',
				content: 'Item 3'
			}
		]),

		list_items_advanced: new Backbone.Collection([{
			cls: 'list-group-item backbone',
			content: {
				src: 'http://backbonejs.org/docs/images/backbone.png',
				alt: 'Backbone Logo',
				attrs: { width: 150, style: 'padding: 3px' }
			}
		}, {
			cls: 'list-group-item emberjs',
			content: {
				src: 'http://www.gravatar.com/avatar/0cf15665a9146ba852bf042b0652780a?s=100',
				alt: 'EmberJS Logo',
				attrs: { width: 100, style: 'padding: 3px' }
			}
		}, {
			cls: 'list-group-item react',
			content: {
				src: 'http://facebook.github.io/react/img/logo.svg',
				alt: 'React Logo',
				attrs: { width: 100, style: 'padding: 3px;' }
			}
		}, {
			cls: 'list-group-item puremvc',
			content: {
				src: 'http://puremvc.org/templates/js_element_blue/images/logo.png',
				alt: 'PureMVC Logo',
				attrs: { width: 150, style: 'padding: 3px;' }
			}
		}]),

		list_simple: {
			$module: 'ui/list/list',
			$params: { cls: 'list-group', collection: '$bone!list_items_simple' }
		},

		list_advanced: {
			$module: 'ui/list/list',
			$params: { cls: 'list-group', collection: '$bone!list_items_advanced', type: Image }
		},

		$ready: [{
			'$bone!clist.addAll': [[
				'$bone!list_p_s',
				'$bone!list_simple',
				'$bone!list_p_a',
				'$bone!list_advanced'
			], { renderOnAdd: true }]
		}]

	};

});
