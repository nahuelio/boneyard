## Spinal IoC implementation

### IoC Core Improvements notes on next iteration:

* Engine should take care of partials specs loading (Clean up $created references before merging).

* Write Test cases for Spec semantics errors (type checking and nullability of required data, exceptions and more).

* Verify that while $bone! string annotations are being evaluated, it replaces substrings partially.
  Useful when building dynamic paths as bone dependencies.

##### List of plugins to develop

* AOP (Aspects) - nice to have on first release but not required
