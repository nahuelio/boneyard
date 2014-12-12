/**
*	SpinalJS Label Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-basic-label',

		lbl_simple: {
			$module: 'ui/basic/label',
			$params: { id: 'lbl_simple', content: 'Label Text', afor: 'label-for' }
		},

		$ready: [{
			'$bone!clabel.addAll': [[
				'$bone!lbl_simple'
			], { renderOnAdd: true }]
		}]
	};

});
