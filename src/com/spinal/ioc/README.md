## Spinal IoC implementation

### IoC Core Improvements notes:

* Inheritance Major issue Investigation: Calling [Class].__super__.initialize.apply(this, arguments); in some of the initialize methods inside classes is messing things up. like the object instanciated it
from a class that has this code, it ends up being of a different type. Spinal Core issue (SpinalClass) (Weird).

* Write Test cases for Spec semantics errors (type checking and nullability of required data, exceptions and more).

##### List of plugins

* IoC Plugins basic implementation were completed. This are the following plugins written so far however, changes and additional improvements need to be applied later on.

    * #### HTMLPlugin (Template Packages) injects 3 methods in a context instance:

        Verifies if a template package is loaded
        ```
        this.context.html_loaded([packageName:String]);
        ```

        Loads a new Template package into the list.
        ```
        this.context.html_load([callback:Function])
        ```

        Pass in a data object that has properties corresponding to the template's free variables
        ```
        this.context.html_tpl('[expression:String]', [data:Object])
        ```
        > Examples of valid expressions: 'spinal!my.awesome.template'([packageName]![dotnotation]).

    * #### ThemePlugin injects 2 methods in a context instance:

        Switch theme to the one specified by parameter
        ```
        this.context.theme_change([ThemeName:String]);
        ```

        Returns the current theme used
        ```
        this.context.theme_current()
        ```
