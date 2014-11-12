/**
*	Simple Spec Test
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['specs/main.spec'], function(MainSpec) {

	return {

		$specs: MainSpec,

		b: true,
		s: 'Hello',
		n: 10,
		o: { prop: '$bone!s' },
		a: ['$bone!n', 2, '$bone!b'],
		d: new Date(),
		r: new RegExp('/\./', 'i'),

		model: {
			$module: {
				class: 'util/schema',
				params: {
					_b: '$bone!b',
					_s: '$bone!s',
					_n: '$bone!n',
					_o: '$bone!o',
					_a: '$bone!a',
					_d: '$bone!d',
					_r: '$bone!r'
				}
			}
		},

		content: {
			$module: {
				class: 'ui/container',
				params: { id: 'content' }
			}
		}

	};

});
