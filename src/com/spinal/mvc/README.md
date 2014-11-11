### This package will be removed, it's not going to be part of spinal as a package.

* The plan is to move our Base Controller implementation into a HTTP Utility _helper_ that performs operations over ajax or classic Request-Response mechanism and leave the door _open_ to let developers implement their own base controller mechanism.
* Same for the Service Layer, but this particular one with __NO__ utility helper at all. They can always use their own strategy of their choice or even, extend from Spinal.SpinalClass to implement the serialization/deserialization process of model data as they want.
* Finally for the model layer: there is gonna be a simple utility helper to check for schema data types definition. This is still in review process.
