<img src="http://3dimention.github.io/boneyard/images/boneyard/boneyard-logo-v1.png" width="500" />

**Overall Project Status: 0.1.0 release is coming...**

# Introduction

Architectural Toolkit that unifies most of the common libraries used nowadays to simplify project setup and code development in general.

If the following technology stack is your choice or you just simple love developing web-apps using these libraries, please checkout this project.

* Backbone (_underscore_)
* RequireJS (_text_ plugin)
* jQuery
* Bootstrap

Boneyard also, provides a minimalistic implementation of a Inversion of Control (IoC-like) pattern for Javascript running in the browser, to help you decouple business logic from his composition.

While I personally consider it experimental, because most of the logic implemented and the internal mechanisms to solve dependency injection need to be tested directly in the field with real web-apps, the usage of this package is optional either, if your decide to use it to wire all the pieces completely or partially.

Also, this IoC package was inspired by the module `wire.js` of [CujoJS Project](http://github.com/cujojs). It essentially establishes a good architectural foundation for your project and keeps the separation of concerns as clean as possible. So, you will find some similarities while declaring specs using Boneyard.

Lastly, Boneyard provides 2 more additional packages, `ui` and `util`.

* Boneyard UI package offers a list of common reusable components, easy to extend and easy customize. These components are in essence, "classes" that extend the original ```Backbone.View``` to get the best of backbone's binding mechanisms, plus all the styling capabilities provided by bootstrap to skin and render those components.

* Boneyard Util package, provides a set of utilities that may help you to perform some common tasks.

#### Important Note
Boneyard was empirically crafted by following common good practices discovered while developing web apps using backbone/requirejs libraries. However, **boneyard is still not recommended to be ran in production environments but for experimental purposes only**, due to the fact that the patterns and decisions that made up this toolbox are going to be subjected to change over time. As long as the community will provide feedback based on their experiences using this toolkit to keep improving the original idea until the tool itself will reach a certain level of maturity to consider it _production ready_.

## Requirements

* Node And NPM installed

## Installation

The library itself is distributed on bower. So, to get the distribution you run:

`bower install boneyard`

However, Boneyard also ships with an optional tool called **Boneyard Composer** that is only published on the NPM registry (See 'Usage' section below). This tool is a simple utility that in general you will run only in development mode. In your project root folder, you simply run:

`npm install --save-dev boneyard`

## Usage

If you've decided to give **Boneyard Composer** a shot, this tool may help you with the development process.

**Boneyard Composer**, is a simple command line tool that allows you to test your modules/components code in real time. Just by using a config json file, it will generate a temporal folder and spin up a server to serve all your source code so you can access it within a browser to check the results.

Also, the server will be listening for code changes (whenever the source code changes, the browser will reload automatically). This should be very useful, especially while building spec configurations file from the Boneyard IoC package.
It can be a tool to consider inside the development process to integrate it with Unit Test frameworks, less/sass based themes development, HTML template packages compilation and so on.

### Boneyard Composer screenshots

![](http://3dimention.github.io/boneyard/images/composer-ss-1.png)

<br/>

![](http://3dimention.github.io/boneyard/images/composer-ss-2.png)

Please, visit the documentation related to the usage of this tool.

# Developers or Contributors

If you want to provide feedback, suggest changes or simply check the source code, here are some quick notes and steps after pulling the code from master.

### Build from source:

1. Run ```npm install -g karma-cli```
* Run ```npm install -g bower```
* Run ```npm install```
* Run ```make build```

### Running Composer Tool on Boneyard Core Project

* Once boneyard has been installed via ```npm install``` (step 3)
* By running ```make composer``` you will have access to hit ```localhost:9393/index.html```

### API Documentation

* YUIDoc Available after running ```make build``` on ```/apidocs```

### Unit Testing / Code Coverage

* Available after running ```make build``` on ```/coverage```

# Development Roadmap

* Boneyard IoC: Dependency injection of a single instances on multiple targets (one to many). This will wrap up the IoC/DI full functionality. This is a **must have** for the next few releases of the library.

* Boneyard Annotation Engine: A new project started a few weeks ago in a different repo at [3dimention/boneyard-annotation](https://github.com/3dimention/boneyard-annotation) and the goal is to automate specs generation via annotations. At his core, it will instrument component source code by scanning annotations located inside block comments and convert them into specs automatically without the necessity for the developer to write them manually. Development and the final manifesto are still in progress. Contributors are very welcome!.

### Development Stretch Goals

* IoC API support for destroying Specs or Individual bones. This may need to be integrated with the persistent layer functionality.
* There are plans of doing a complete rewrite of this library to use ES6 standard (ES2015) instead. By using babeljs for transpiling code to ES5, will help us to clean up boneyard core and his dependencies to reduce complexity.
Current API will be reviewed, but not major changes are predicted so far on the way the classes or components are used. More information about this topic will be available.

### Documentation Roadmap

* High Level documentation
* Examples of usage, simple applications (Classic TODO application, IoC important use cases).

# About the author

In this first personal project, I found myself learning a lot about the javascript world, the history behind the language and particularly the big challenges that browsers present nowadays.

You will probably notice that even though I decided to ship Boneyard with a boneyard-ui package (Simple Backbone.View "classes" that spits out some html chunks, in combination with some bootstrap css styling rules and a basic api, I'm definitely not a big fan of the DOM implementation and the HTML declarative format at all as a creational pattern.

With that being said and along with the development of this library, I found completely **difficult** (and annoying) for the sake of a good development process, to let a declarative format resolve the concept of **child > parent relationship structures** of a web app `<div><dom-tell-the-browser-to-create-a-combobox-inside-this-div></div>`, when in fact this level
of details makes different moving parts very hard to keep track. De-structuring probably was one of the major goals on this project, by providing techniques on how a developer can efficiently wire or establish structural relationships between elements.

I think that javascript as a programming language can transcend the browser, it can be "detached" from the concept of the DOM as that was its primarily usage back in the old days.
As time passes, we've been realizing that the concept of a web app has started to become more and more complex, so thinking of the DOM as a simple "interface" (one way to describe web apps) should release Javascript from all assumptions to let it evolve into something different with multiple possibilities.
Its best to put abstraction, good practices and design patterns in place right from the beginning when defining your project's specific scope, instead of starting from something that was meant to be too verbose and plus, relying on a third-party organization to define a standard to follow.

I strongly believe that the web development experience could be a more enjoyable place.

# License

Copyright (c) 2015 Patricio Ferreira

Licensed under the MIT License
