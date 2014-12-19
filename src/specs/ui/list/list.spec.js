/**
*	SpinalJS List Component Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-list-list',

		list_test_p: {
			$module: 'ui/basic/paragraph',
			$params: { content: 'Paragraph wrapped in a ListItem' }
		},

		/** FIXME: Use case to resolve dependencies **/

		list_items: [
			{ views: '$bone!items_p' },
			{ views: '$bone!items_p' },
			{ views: '$bone!items_p' }
		],

		list_container: {
			$module: 'ui/list/list',
			$params: { items: '$bone!list_items' }
		},

		$ready: [{
			'$bone!clist.add': ['$bone!list_container', { renderOnAdd: true }]
		}]

	};

});
