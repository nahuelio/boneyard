## Spinal IoC implementation

### IoC Core Improvements notes on next iteration:

* Inheritance Major issue Investigation: Calling [Class].__super__.initialize.apply(this, arguments); in some of the initialize methods inside classes is messing things up. like the object instanciated it
from a class that has this code, it ends up being of a different type. Spinal Core issue (SpinalClass) (Weird).

* Engine should take care of partials specs loading (Clean up $created references before merging).

* Write Test cases for Spec semantics errors (type checking and nullability of required data, exceptions and more).

* Verify that while $bone! string annotations are being evaluated, it replaces substrings partially.
  Useful when building dynamic paths as bone dependencies.

##### List of plugins to develop

* AOP (Aspects) - nice to have on first release but not required
