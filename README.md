 [![SpinalJS UI framework](http://3dimention.github.io/spinal/images/logo.png)](http://3dimention.github.io/spinal)

### Overall Project Status: In Progress

**Note: This toolkit was not published into the public NPM registry and bower repo yet. It's still under development, trying to hit the first release coming soon.**

# Introduction

Architectural ToolKit that unifies most of the common libraries used nowadays to simplify project setup and code development in general.

If the following technology stack is your choice or you just simple love developing web-apps using these libraries, please checkout this project.

* Backbone (_underscore_)
* RequireJS
* jQuery (of course everything depends on jQuery!)
* Bootstrap

SpinalJS also, provides a minimalistic implementation of a Inversion of Control (IoC-like) pattern for Javascript running in the browser, to help you decouple business logic from his composition.

While I personally consider it experimental, because most of the logic implemented and the internal mechanisms to solve dependency injection need to be tested directly in the field with real web-apps, the usage of this package is optional either, if your decide to use it to wire all the pieces completely or partially.

Also, this IoC package was inspired by the module `wire.js` of [CujoJS Project](http://github.com/cujojs). It essentially establishes a good architectural foundation for your project and keeps the separation of concerns as clean as possible. So, you will find some similarities while declaring specs using SpinalJS.

Lastly, Spinal provides 2 more additional packages, `ui` and `util`.

* Spinal UI package offers a list of common reusable components, easy to extend and easy customize. These components are in essence, "classes" that extend the original ```Backbone.View``` to get the best of backbone's binding mechanisms, plus all the styling capabilities provided by bootstrap to skin and render those components.

* Spinal Util package, provides a set of utilities that may help you to perform some common tasks.

## Requirements

* Node And NPM installed

## Installation

The library itself is distributed on bower. So, to get the distribution you run:

`bower install spinaljs`

However, SpinalJS also ships with an optional tool called **Spinal Composer** that is only published on the NPM registry (See 'Usage' section below). This tool is a simple utility that you may run only in development mode. In your project root folder, you simply run:

`npm install --save-dev spinaljs`

## Usage

If you've decided to give **Spinal Composer** a shot, this tool may help you with the development process.

**Spinal Composer**, is a simple command line tool that allows you to test your modules/components code in real time. Just by using a config json file, it will generate a temporal folder and spin up a server to serve all your source code so you can access it with a browser to check the results.

Also, the server will be listening for code changes (whenever the source code changes, the browser will reload automatically). This should be very useful, especially while building spec configurations file from the Spinal IoC package.
It can be a tool to consider inside the development process to integrate it with Unit Test frameworks, Test runners, less or sass compilation and so on.

### Spinal Composer screenshots

![](http://3dimention.github.io/spinal/images/composer-ss-1.jpg)

<br/>

![](http://3dimention.github.io/spinal/images/composer-ss-2.jpg)

Please, visit the documentation related to the usage of this tool.

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
* Generic Interface for Lists, Tables and Dropdowns components needs a little bit of refactoring to match similar strategy used with the Autocomplete -> 'resultType' in autocomplete.spec.js (to wire generic types into list items, table rows and dropdown elements).
* Two-way Binding implementation discarded from spinal ui.
From a basic stand point, it doesn't seem that provides a lot of value to try to automate two way binding between models and views (just only in a couple of cases), but still IMHO is very 'project specific'. Also, this can end up consuming a lot of CPU overhead unnecessarily. I've decided to stick to the Backbone "nature" and leave it up to the implementer.

### Stretch Goals

* IoC Storage (HTML5 LocalStorage API | Persistent Layer that will work as a Plugin) to store specs.
* IoC API support for destroying Specs or Individual bones. This may need to be integrated with the persistent layer functionality.
* Introduce and research about Virtual DOM implementations to be included into Spinal UI package.
* Poly package development (Will use Modernizr behind the scenes)

### Documentation Roadmap

* High Level documentation
* Usage Examples, simple applications (Classic TODO application, IoC important use cases)

### Design Roadmap

* Official Website [3dimention/spinal](http://3dimention.github.io/spinal) | _In Progress_
* Logo needs more work :)

# About the author

In this first personal project, I found myself learning a lot about the javascript world, the history behind the language and particularly the big challenges that browsers present nowadays.

You will probably notice that even though I decided to ship Spinal with a spinal ui package (Simple Backbone.View "classes" that spits out some html chunks, in combination with some bootstrap css styling rules and a basic api, I'm definitely not a big fan of the DOM implementation and the HTML declarative format at all as a creational pattern.
With that being said and along with the development of this library, I found completely **unnecessary** (and annoying) for the sake of a good development process, to have to check some `<dom-tell-the-browser-to-create-a-combobox>` format to figure if a component was rendered and interpreted properly by the browser, when in fact this level of creational format details should be at least optional and encapsulated by the browser itself with a simple `new Combobox()` javascript before hand.

I think that javascript as a programming language can transcend the browser, it can be "detached" from the concept of the DOM as that was its primarily usage back in the old days.
As time passes, we've been realizing that the concept of a web app has started to become more and more complex, so thinking of the DOM as a simple "interface" (one way to describe web apps) should release Javascript from all assumptions to let it evolve  into something different with multiple possibilities.
Its best to put abstraction, good practices and design patterns in place right from the beginning when defining your project's specific scope, instead of starting from something that was meant to be too verbose and plus, relying on a third-party organization to define a standard to follow.

I strongly believe that the web development experience could be a more enjoyable place.

# License

Copyright (c) 2015 Patricio Ferreira

Licensed under the MIT License
