## Spinal IoC implementation

### IoC Core Improvements notes on next iteration:

* Refactor BoneQuery to be BoneEngine class and move the reference to the base class BoneProcessor

* Move 'build' method implementation outside of Context class to be in BoneEngine (In Progress)

* Move bone-factory into com.spinal.util.factory as 'AsyncFactory' Spinal Class. (In Progress)

* BoneEngine should take care of partials specs loading (Clean up $created references before merging).

* Swap usage of Regexp to the native 'indexOf' instead to query IoC notations inside specs (performance boost).

* Review matchNotation and getDependency and processParams (several implemented methods in Ready/Create processors)
  The code can be even more simple and reusable (specially while resolving dependency injection between create
  and ready processors, evaluating keys and params).

* Write Test cases for Spec semantics errors (type checking and nullability of required data, exceptions and more).

* Verify that while $bone! string annotations are being evaluated, it replaces substrings partially.
  Useful when building dynamic paths as bone dependencies.

* Look at the test/com/spinal/ioc/specs/main.specs.js -> Possible Change: $module$viewA: {}, $module$viewB: {}, etc as a simplification.
It can be simplified even more...

##### List of plugins to develop

* AOP (Aspects) - nice to have on first release but not required
