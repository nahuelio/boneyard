/**
*  Spinal UI Framework
*  @author Patricio Ferrerira <3dimentionar@gmail.com>
**/
var Spinal = (function() {
    
	/**
	*	Namespacing Strategy
	**/
	var namespace: function(path, constructor) {
		var parts = ns.split('.'), parent = c, pl, i;
		pl = parts.length;
		for (i = 0; i < pl; i++) {
			if (typeof parent[parts[i]] == 'undefined') parent[parts[i]] = {};
			parent = parent[parts[i]];
		}
		this.packages = parent;
	};
	
	/**
	*	Inheritance Strategy
	**/
    var inherit = function(proto, static) {
        var Parent = this, Child;
    
        var F = function() { this.constructor = Child; };
        F.prototype = Parent.prototype;
        Child = function() { Parent.apply(this, arguments); };
        Child.prototype = new F();
  
        if(proto) for(var i in proto) Child.prototype[i] = proto[i];
      
        Child.__super__ = Parent.constructor;
        return Child;
    };
	
	/**
	*	Interface uses Strategy
	**/
	var uses = function() {
		// IMPLEMENT
	};

    return {
        __VERSION__: '<%= version %>',
		packages: {},
		namespace: namespace,
        inherit: inherit,
		uses: uses
    };

}());