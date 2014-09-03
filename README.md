 [![SpinalJS UI framework](http://3dimention.github.io/spinal/images/logo.png)](http://3dimention.github.io/spinal)

# SpinalJS

Architectural UI framework built on top of BackboneJS/RequireJS

Overall Project Status: <b style="color: blue;">Work in Progress</b>

---

### Installation and Setup

Build from source (master):

1. Run npm 'install -g karma-cli'
2. Run npm 'install -g bower'
1. Run 'npm install'
2. Run 'make build'
3. spinal-[version]-SNAPSHOT.js file and his dependencies will be generated inside the ./target folder (Fix this.)

Download latest stable release:

* Go to [3dimention/spinal](http://3dimention.github.io/spinal) and click on the links to download the tar/zip.

### Basic Usage

* Spinal Builder Command-line Tool documentation (TBD)

### API Documentation

* YUIDoc Available and completed (URL deploy needed)

---

## Development Roadmap

* IoC Implementation (Initial release) | <b style="color: green;">Completed</b>

* Spinal Composer Tool development | <b style="color: green;">Completed</b>

* i18n/css/html Implementation | <b style="color: blue;">In Progress</b><br/>
  (RequireJS plugin to make it work both ways, as part of the AMD and on the IoC Implementation)

* Benchmark IoC Implementation - setup test cases and specs | <b style="color: red;">To be Completed</b><br/>
  (The tool is broken now due to a bunch of new changes since the first shot).

    ### Improvements

    * #### IoC Implementation:
      * Refactor BoneQuery Class into the BoneProcessor Base Class | <b style="color: red;">To be Completed</b>
      * IoC Wiring bones with "partial specs" capabilities | <b style="color: red;">To be Completed</b>
      * Make the usage of spinal through the "script" tag easier | <b style="color: red;">To be Completed</b>

## Stretch Goals

* AoP Implementation | <b>Medium Priority</b>
* IoC Storage (HTML5 LocalStorage API. Persistent Layer that will work as a Plugin) to store modules states
  across Request-Responses via ajax or classic request-response strategies | <b>Low Priority</b>
* Poly package development (Must have) | <b>Low Priority</b>
* Lo-dash hook up (Performance Boost) | <b>Low Priority</b>

## Documentation Roadmap

* High Level documentation (TBD) | <b>Low Priority</b>
* Usage Examples, simple applications | <b>Low Priority</b>

## Design Roadmap

* Official Website [3dimention/spinal](http://3dimention.github.io/spinal) | <b>Low Priority</b>
* Logo need more work | <b>Low Priority</b>
