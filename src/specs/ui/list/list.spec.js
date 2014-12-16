/**
*	SpinalJS List Component Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-list-list',

		list_test_p: {
			$module: 'ui/basic/paragraph',
			$params: { id: 'list_test_p', content: 'Paragraph wrapped in a ListItem' }
		},

		/** FIXME: Use case to resolve dependencies **/

		list_items: [
			{ id: 'list_item_c_1', views: '$bone!items_p' },
			{ id: 'list_item_c_2', views: '$bone!items_p' },
			{ id: 'list_item_c_3', views: '$bone!items_p' }
		],

		list_container: {
			$module: 'ui/list/list',
			$params: {
				id: 'list_container',
				items: '$bone!list_items'
			}
		},

		$ready: [{
			'$bone!clist.add': ['$bone!list_container', { renderOnAdd: true }]
		}]

	};

});
