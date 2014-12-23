## Spinal IoC implementation

### IoC Core Known issues to be addressed soon:

* Inheritance Major issue Investigation: Calling [Class].__super__.initialize.apply(this, arguments); when a class inherits from core SpinalClass in the initialize methods are messing things up. Symptom: the object instantiated from that class ends up being of an unrelated type. Spinal Core issue (SpinalClass).

* Write Test cases for Spec semantics errors (type checking and nullability of required data, exceptions and more).

* Clean up: Wipe out 'get' and 'set' methods in Core SpinalClass. Collection and Iterator utility classes are still using this methods (Need to fix them).

### List of plugins

* IoC Plugins basic implementation were completed. This are the following plugins written so far however, changes and additional improvements need to be applied later on.

    * ##### HTMLPlugin (Template Packages) injects 3 methods in the Spinal namespace:

        Verifies if a template package is loaded
        ```
        Spinal.isTemplateLoaded([packageName:String]);
        ```

        Loads a new Template package into the list.
        ```
        Spinal.loadTemplate([packageName:String], [callback:Function])
        ```

        Pass in a data object that has properties corresponding to the template's free variables
        ```
        Spinal.tpl('[expression:String]', [data:Object])
        ```
        > Examples of valid expressions: 'package!my.awesome.template'

    * ##### ThemePlugin injects 2 methods in the Spinal namespace:

        Switch theme to the one specified by parameter
        ```
        Spinal.changeTheme([themeName:String]);
        ```

        Returns the current theme used
        ```
        Spinal.currentTheme()
        ```

        Reset Lastest Theme applied
        ```
        Spinal.resetTheme()
        ```
