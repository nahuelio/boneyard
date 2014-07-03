/**
*	@module com/spinal/util
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal'], function(Spinal) {

	/**
	*	Object Util Class
	*	@namespace Object
	**/
	(function(export) {

		/**
		*	Test Case:
		*		var test = {
					"store": {
					    "book": [
					      { "category": "reference",
					        "author": "Nigel Rees",
					        "title": "Sayings of the Century",
					        "price": 8.95
					      },
					      { "category": "fiction",
					        "author": "Evelyn Waugh",
					        "title": "Sword of Honour",
					        "price": 12.99
					      },
					      { "category": "fiction",
					        "author": "Herman Melville",
					        "title": "Moby Dick",
					        "isbn": "0-553-21311-3",
					        "price": 8.99
					      },
					      { "category": "fiction",
					        "author": "J. R. R. Tolkien",
					        "title": "The Lord of the Rings",
					        "isbn": "0-395-19395-8",
					        "price": 22.99
					      }
					    ],
					    "bicycle": {
					      "color": "red",
					      "price": 19.95
						}
					}
				}
		*
		*		test.query('$.store.bicycle['color']') || test.query('library.bicycle.color');
		*		test.query('$..book[?(@.price < 100), ?(@.title.indexOf('the'))].title');
		*		test.query('$.store[?(@.address.street.indexOf('1234'))]');
		**/

		var operators = {
			'$': 'R', // root element
			'..': 'S', // recursive descendent
			'*': 'W', // wildcard. All objects regardless their key names.
			'@': 'E', // current element in a expr
			'[_]|.': 'C', // child operator
			',': 'U', // Union operator
			'?(_)': 'F' // filter operator
		};

		/**
		*	Tokenize query based on child operator
		*	@private
		*	@method _tokenize
		*	@param expr {String} query expr
		*	@return Array
		**/
		function _tokenize(expr) {
			// TODO
		}

		/**
		*	Validates/executes a valid query expression against the list of supported operators
		*	@private
		*	@method _match
		*	@param expr {String} query expr
		*	@return Array
		**/
		function _match(expr) {
			var tks = _tokenize(expr);
			if(tks && typeof tks === 'array') {
				for(var i = 0; i < tks.length; i++)

			}
		}

		function _R() { }
		function _S() { }
		function _W() { }
		function _E() { }
		function _C() { }
		function _U() { }
		function _F() { }

		Object.prototype.query = function(expr) {
			return _match(expr)();
		};

	})(typeof exports === 'undefined' ? window : exports);

});
