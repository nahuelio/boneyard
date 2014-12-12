/**
*	SpinalJS Table Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-table',

		ctable: {
			$module: 'ui/misc/panel',
			$params: { id: 'ui-table-table', title: 'Table' }
		},

		$ready: [{
			'$bone!global.add': ['$bone!ctable', { renderOnAdd: true }]
		}]

	};

});
