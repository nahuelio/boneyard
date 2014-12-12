/**
*	SpinalJS List Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-list',

		clist: {
			$module: 'ui/container',
			$params: { id: 'ui-list-list', title: 'HTML List' }
		},

		$ready: [{
			'$bone!global.add': ['$bone!clist']
		}, {
			'$bone!clist.addClass': ['panel']
		}]

	};

});
