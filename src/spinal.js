/**
*  Spinal UI Framework
*  Version: 0.0.1
*  @author Patricio Ferrerira <3dimentionar@gmail.com>
**/
var Spinal = (function() {

    var extend = function(proto, static) {
        var Parent = this, Child;
    
        var F = function() { this.constructor = Child; };
        F.prototype = Parent.prototype;
        Child = function() { Parent.apply(this, arguments); };
        Child.prototype = new F();
  
        // TODO: Implement Deep Object Cloning
        if(proto) for(var i in proto) Child.prototype[i] = proto[i];
    
        Child.__super__ = Parent.constructor;
        return Child;
    };
    
    var static = function(protoStatic) {
        // TODO: Implement Extending statics
    };

    return {
        __VERSION__: '0.0.1',
        extend: extend,
        static: static
    };

}());