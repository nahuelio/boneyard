 [![SpinalJS UI framework](http://3dimention.github.io/spinal/images/logo.png)](http://3dimention.github.io/spinal)

# SpinalJS
### Overall Project Status: In Progress

Architectural ToolKit that unifies most of common libraries and provides a simplistic high level API
to build scalable and robust web apps.

* Backbone (_underscore_)
* RequireJS
* jQuery (of course everything depends on jQuery!)
* Bootstrap
* Modernizr

### Requirements

* Node And NPM installed

### Installation

* Run ```npm install spinaljs``` in your project folder
* Or add ```"spinaljs": "version"``` in your dependency list in your package.json and then run ```npm install```

### Usage

Once installed, Spinal provides a command line tool ready -to-use that could help you with the development process.

**Spinal Composer**, will allow you to test your modules/components code in real time.
Just by using a simple config json file, this tool will generate a temporal folder, spin up a server to serve all your source code so you can access it with a browser to check the results.
Also, the server will be listening for code changes (whenever the source code changes, the browser will reload automatically). This should be very useful, specially while building spec configurations file from the Spinal IOC package.

Please, visit the documentation related to the usage of these tools.

# Developers or Contributors

If you want to provide feedback, suggest changes or simply check the source code, here are some quick notes and steps after pulling the code from master.

### Build from source:

1. Run ```npm install -g karma-cli```
* Run ```npm install -g bower```
* Run ```npm install```
* Run ```make build```

### API Documentation

* YUIDoc Available after running ```make build``` on ```/apidocs```

### Unit Testing / Code Coverage

* Available after running ```make build``` on ```/coverage```

# Development Roadmap

* Spinal UI package development (Components and MV* utilities)
* Two-way Binding support (model & views).

### Stretch Goals

* IoC Storage (HTML5 LocalStorage API | Persistent Layer that will work as a Plugin) to store specs.
* IoC API support for destroying Specs or Individual bones. This needs to be integrated with the persistent layer functionality.
* Poly package development (Will use Modernizr behind the scenes)

### Documentation Roadmap

* High Level documentation
* Usage Examples, simple applications (Classic TODO application, IoC important use cases)

### Design Roadmap

* Official Website [3dimention/spinal](http://3dimention.github.io/spinal) | _In Progress_
* Logo needs more work :)
