/**
*	SpinalJS Label Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-basic-label',

		lbl_simple: {
			$module: 'ui/basic/label',
			$params: { content: 'Label Text', afor: 'label-for' }
		},

		$actions: [{
			'$bone!clabel.addAll': [[
				'$bone!lbl_simple'
			], { renderOnAdd: true }]
		}]
	};

});
