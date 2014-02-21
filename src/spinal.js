/**
*  Spinal UI Framework
*  Version: 0.0.1
*  @author Patricio Ferrerira <3dimentionar@gmail.com>
**/
var Spinal = (function() {
    
    var inherit = function(proto, static) {
        var Parent = this, Child;
    
        var F = function() { this.constructor = Child; };
        F.prototype = Parent.prototype;
        Child = function() { Parent.apply(this, arguments); };
        Child.prototype = new F();
  
        // TODO: Implement Deep Object Cloning
        if(proto) for(var i in proto) Child.prototype[i] = proto[i];
        _.extend(child, parent, staticProps);  
      
        Child.__super__ = Parent.constructor;
        return Child;
    };

    return {
        __VERSION__: '0.0.1',
        inherit: inherit,
    };

}());