/**
*    Spinal UI Framework
*    Version: 1.0
*    Closure Library by Google
*    https://code.google.com/p/closure-library/wiki/NodeJS
**/
var Spinal = (function() {

    var extend = function(proto, protoStatic) {
        var Parent = this,
            Child;
    
        var F = function() { this.constructor = Child; };
        F.prototype = Parent.prototype;
        Child = function() { Parent.apply(this, arguments); };
        Child.prototype = new F();

        if(proto) for(var i in proto) Child.prototype[i] = proto[i];
        if(protoStatic) for(var j in protoStatic) Child[j] = protoStatic[j];
    
        Child.__super__ = Parent.constructor;

        return Child;
    };

    var Model = function(attrs) {
        attrs || (attrs = {});
        this.attributes = attrs;
        if(this.initialize) this.initialize.apply(this, arguments);
    };
    Model.extend = extend;

    return { 
        VERSION: '0.0.1',
        DESCRIPTION: 'UI Framework',
        Model: Model
    };

}());