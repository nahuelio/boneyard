## Spinal IoC implementation

### Improvements:

* Refactored BoneQuery to be BoneEngine class and move the reference to the base class BoneProcessor
* Move \_build method implementation outside of Context class to be in BoneEngine
* BoneEngine should take care of partials specs loading
* Swap usage of Regexp to the native 'indexOf' instead to query IoC notations inside specs
* Review matchNotation and getDependency and processParams (several implemented methods in Ready/Create processors)
* Write Test cases for Spec semantics errors (type checking and nullability of required data, exceptions and more).
