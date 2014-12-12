/**
*	SpinalJS List Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-list',

		clist: {
			$module: 'ui/misc/panel',
			$params: { id: 'ui-list-list', title: 'List' }
		},

		$ready: [{
			'$bone!global.add': ['$bone!clist', { renderOnAdd: true }]
		}]

	};

});
