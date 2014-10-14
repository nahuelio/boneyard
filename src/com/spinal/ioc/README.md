## Spinal IoC implementation

### IoC Core Improvements notes on next iteration:

* Refactor BoneQuery to be BoneEngine class and move the reference to the base class BoneProcessor
* Move 'build' method implementation outside of Context class to be in BoneEngine
* BoneEngine should take care of partials specs loading (Clean up $created references before merging).
* Swap usage of Regexp to the native 'indexOf' instead to query IoC notations inside specs (performance boost).
* Review matchNotation and getDependency and processParams (several implemented methods in Ready/Create processors)
  The code can be even more simple and reusable (specially while resolving dependency injection between create
  and ready processors, evaluating keys and params).
* Write Test cases for Spec semantics errors (type checking and nullability of required data, exceptions and more).
* Verify that while $bone! string annotations are being evaluated, it replaces substrings partially.
  Useful when building dynamic paths as bone dependencies.
* __Reminder:__ the major goal is to simplify business wiring and keep the bussiness logic completely decoupled through the composition layer.
IoC Context must be the only entry point for accessing module instances (facade).

### IoC Plugins development notes:

* __Don't reinvent the wheel__, essentially as the requirejs css plugin described that there is no efficient mechanism
to load css resources on demand and inject those in the DOM (due to the nature of HTML). Instead, evaluate the possibility of
developing a simple and flexible __theme plugin__ to load bootstrap templates to make themes available on UI components.
* About the Templates plugins, use a custom declaration in the builder to specify a path (or multiple) where the templates are located.
This tool will create a json structure that will be hook into the IoC context.
The Plugin processor will provide the IoC with a basic query mechanism (dot notation?) to inject those templates inside the amd UI modules in a flexible manner.
* Simple, fast and flexible enough! Don't go crazy to make it generic enough to fit all needs, start with something basic.

##### List of plugins to develop

* Theme - must have on first release
* Templates - must have on first release
* AOP (Aspects) - nice to have on first release but not required
