/**
*	Advanced Spec Test
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['specs/main.spec'], function(MainSpec) {

	return {

		$id: 'advanced',
		$specs: [MainSpec],

		content: {
			$module: 'ui/container',
			$params: { id: 'content', views: ['$bone!viewC'] }
		},

		view1: {
			$module: 'ui/view',
			$params: { id: 'view1' }
		},

		viewD: {
			$module: 'ui/view',
			$params: { id: 'viewD' }
		},

		viewC: {
			$module: 'ui/container',
			$params: { id: 'viewC', cls: '$bone!theme', views: ['$bone!viewD', '$bone!view2'] }
		},

		view2: {
			$module: 'ui/view',
			$params: { id: 'view2' }
		},

		viewE: {
			$module: 'ui/view',
			$params: { id: 'viewE' }
		},

		subcontent: {
			$module: 'ui/container',
			$params: { id: 'subcontent', model: '$bone!model', views: ['$bone!view1'] }
		},

		anotherView: {
			$module: 'ui/view',
			$params: { id: 'anotherView' }
		},

		$actions: [
			{ '$bone!content.add': ['$bone!viewE'] }
		]

	};

});
