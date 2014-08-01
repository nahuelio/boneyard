 [![SpinalJS UI framework](http://3dimention.github.io/spinal/images/logo.png)](http://3dimention.github.io/spinal)

# SpinalJS

Architectural UI framework built on top of BackboneJS/RequireJS

Overall Project Status: Work in Progress

=========================

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

* YUIDoc Avialable and completed (URL deploy needed)

=========================

### Development Roadmap

* IoC Implementation | <b>In Progresss</b>
*     -> Refactor BoneQuery Class into the BoneProcessor Base Class (Must have)
*     -> IoC Wiring bones with "partial specs" capabilities ("Nice to have" for a second release)
* i18n/css/html Implementation | <b>To be Completed</b> (Must have)
  (RequireJS plugin to make it work in combination with the IoC Implementation)
* Benchmark IoC Implementation - setup test cases and specs | <b>To be Completed</b>
  (The tool is broken now due to a bunch of new changes since the first shot).
* Spinal Composer Tool development <b>To be Completed</b>
* AoP Implementation | <b>To be Completed</b>

### Stretch Goals

* IoC Storage (HTML5 LocalStorage API. Persitent Layer that will work as a Plugin) to store modules states
  across Request-Responses via ajax or classic request-response strategies | Low Priority
* Poly package development (Must have) | Low Priority
* Lo-dash hook up (Performance Boost) | Low Priority

### Design Roadmap

* Official Website [3dimention/spinal](http://3dimention.github.io/spinal) (Low Priority)
* Logo need more work (Low Priority)

### Documentation Roadmap

* High Level documentation (TBD) (Low Priority)
* Usage Examples, simple applications (Low Priority)
