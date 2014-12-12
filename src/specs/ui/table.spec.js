/**
*	SpinalJS Table Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-table',

		ctable: {
			$module: 'ui/container',
			$params: { id: 'ui-table-table', title: 'HTML Table' }
		},

		$ready: [{
			'$bone!global.add': ['$bone!ctable']
		}, {
			'$bone!ctable.addClass': ['panel']
		}]

	};

});
