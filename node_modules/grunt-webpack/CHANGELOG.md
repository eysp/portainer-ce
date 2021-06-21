# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="3.1.3"></a>
## [3.1.3](https://github.com/webpack-contrib/grunt-webpack/compare/v3.1.2...v3.1.3) (2018-09-02)


### Bug Fixes

* **dev-server:** compatibility with webpack-dev-server 3.1.7+ ([#166](https://github.com/webpack-contrib/grunt-webpack/issues/166)) ([218f46b](https://github.com/webpack-contrib/grunt-webpack/commit/218f46b))
* Correctly create a function wrapper for plugins to be able to replace grunt templates ([a1ee19e](https://github.com/webpack-contrib/grunt-webpack/commit/a1ee19e)), closes [#163](https://github.com/webpack-contrib/grunt-webpack/issues/163)
* Display proper error when no config was found. ([6326a10](https://github.com/webpack-contrib/grunt-webpack/commit/6326a10)), closes [#164](https://github.com/webpack-contrib/grunt-webpack/issues/164)



<a name="3.1.2"></a>
## [3.1.2](https://github.com/webpack-contrib/grunt-webpack/compare/v3.1.1...v3.1.2) (2018-05-14)


### Bug Fixes

* Fix "Tapable.apply is deprecated" warning (fixes [#161](https://github.com/webpack-contrib/grunt-webpack/issues/161)) ([#162](https://github.com/webpack-contrib/grunt-webpack/issues/162)) ([a0c2e6c](https://github.com/webpack-contrib/grunt-webpack/commit/a0c2e6c))



<a name="3.1.1"></a>
## [3.1.1](https://github.com/webpack-contrib/grunt-webpack/compare/v3.1.0...v3.1.1) (2018-03-14)


### Bug Fixes

* **dev-server:** Fix reporting of port to console ([0f0d3b5](https://github.com/webpack-contrib/grunt-webpack/commit/0f0d3b5))



<a name="3.1.0"></a>
# [3.1.0](https://github.com/webpack-contrib/grunt-webpack/compare/v3.0.2...v3.1.0) (2018-03-14)


### Features

* **webpack:** Support webpack 4 ([#160](https://github.com/webpack-contrib/grunt-webpack/issues/160)) ([c72ab54](https://github.com/webpack-contrib/grunt-webpack/commit/c72ab54))



<a name="3.0.2"></a>
## [3.0.2](https://github.com/webpack-contrib/grunt-webpack/compare/v3.0.1...v3.0.2) (2017-07-11)


### Bug Fixes

* Ensure that the cache default functions gets correctly executed ([#150](https://github.com/webpack-contrib/grunt-webpack/issues/150)) ([d01aba9](https://github.com/webpack-contrib/grunt-webpack/commit/d01aba9))
* Fix hanging when using options ([#149](https://github.com/webpack-contrib/grunt-webpack/issues/149)) ([96fa0ef](https://github.com/webpack-contrib/grunt-webpack/commit/96fa0ef))



<a name="3.0.1"></a>
## [3.0.1](https://github.com/webpack-contrib/grunt-webpack/compare/v3.0.0...v3.0.1) (2017-07-10)


### Bug Fixes

* only process plugins directly related to webpack, not loader plugins ([#145](https://github.com/webpack-contrib/grunt-webpack/issues/145)) ([f89b241](https://github.com/webpack-contrib/grunt-webpack/commit/f89b241))
* Allow webpack 3 as peer, use webpack 3 as devDep ([#144](https://github.com/webpack-contrib/grunt-webpack/issues/144)) ([a6f42a2](https://github.com/webpack-contrib/grunt-webpack/commit/a6f42a2))
* **dev-server:** fix multi target for webpack-dev-server task ([#143](https://github.com/webpack-contrib/grunt-webpack/issues/143)) ([d224f69](https://github.com/webpack-contrib/grunt-webpack/commit/d224f69))
* **webpack:** fix multi target in webpack task ([#140](https://github.com/webpack-contrib/grunt-webpack/issues/140)) ([ddafd49](https://github.com/webpack-contrib/grunt-webpack/commit/ddafd49))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/webpack-contrib/grunt-webpack/compare/v3.0.0-beta.2...v3.0.0) (2017-05-05)



<a name="3.0.0-beta.2"></a>
# [3.0.0-beta.2](https://github.com/webpack-contrib/grunt-webpack/compare/v3.0.0-beta.1...v3.0.0-beta.2) (2017-04-09)


### Bug Fixes

* Correctly load config without grunt multitask ([#133](https://github.com/webpack-contrib/grunt-webpack/issues/133)) ([0426a2d](https://github.com/webpack-contrib/grunt-webpack/commit/0426a2d))


<a name="3.0.0-beta.1"></a>
# [3.0.0-beta.1](https://github.com/webpack-contrib/grunt-webpack/compare/v2.0.1...v3.0.0-beta.1) (2017-03-28)


### Bug Fixes

* Improve performance by using deep-for-each ([#131](https://github.com/webpack-contrib/grunt-webpack/issues/131)) ([becee4c](https://github.com/webpack-contrib/grunt-webpack/commit/becee4c))
* Refactor option loading ([#130](https://github.com/webpack-contrib/grunt-webpack/issues/130)) ([f0b4e36](https://github.com/webpack-contrib/grunt-webpack/commit/f0b4e36))
* Fix progress to output the same numbers as webpack cli does ([#128](https://github.com/webpack-contrib/grunt-webpack/issues/128)) ([0d81d9f](https://github.com/webpack-contrib/grunt-webpack/commit/0d81d9f))
* Correct options ([#127](https://github.com/webpack-contrib/grunt-webpack/issues/127)) ([ac37b95](https://github.com/webpack-contrib/grunt-webpack/commit/ac37b95))
* **hot:** preload HMR plugin into compiler options. ([#126](https://github.com/webpack-contrib/grunt-webpack/issues/126)) ([bbe4d01](https://github.com/webpack-contrib/grunt-webpack/commit/bbe4d01))
* **plugins:** fix plugins for every plugin configuration. ([#129](https://github.com/webpack-contrib/grunt-webpack/issues/129)) ([5fa3c4b](https://github.com/webpack-contrib/grunt-webpack/commit/5fa3c4b))

### Features

* Allow callbacks to be supplied as options

* **webpack-dev-server:** Added support for option `public`
* **webpack-dev-server:** Added support for option `hotOnly`

### BREAKING CHANGES

* **webpack-dev-server:** The option `inline` now defaults to `true`
* **webpack:** The option `cache` now defaults to `true` if `watch` is set to `true`
* **webpack:** The option `failOnError` now defaults to `false` if `watch` is set to `true`


<a name="2.0.1"></a>
## [2.0.1](https://github.com/webpack-contrib/grunt-webpack/compare/v2.0.0...v2.0.1) (2017-01-27)



<a name="2.0.0"></a>
# [2.0.0](https://github.com/webpack-contrib/grunt-webpack/compare/v2.0.0-beta.6...v2.0.0) (2017-01-27)



<a name="2.0.0-beta.6"></a>
# [2.0.0-beta.6](https://github.com/webpack-contrib/grunt-webpack/compare/v2.0.0-beta.5...v2.0.0-beta.6) (2017-01-06)



<a name="2.0.0-beta.5"></a>
# [2.0.0-beta.5](https://github.com/webpack-contrib/grunt-webpack/compare/v2.0.0-beta.4...v2.0.0-beta.5) (2016-12-15)



<a name="2.0.0-beta.4"></a>
# [2.0.0-beta.4](https://github.com/webpack-contrib/grunt-webpack/compare/v2.0.0-beta.3...v2.0.0-beta.4) (2016-12-15)



<a name="2.0.0-beta.3"></a>
# [2.0.0-beta.3](https://github.com/webpack-contrib/grunt-webpack/compare/v2.0.0-beta.2...v2.0.0-beta.3) (2016-12-12)



<a name="2.0.0-beta.2"></a>
# [2.0.0-beta.2](https://github.com/webpack-contrib/grunt-webpack/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2016-11-09)



<a name="2.0.0-beta.1"></a>
# [2.0.0-beta.1](https://github.com/webpack-contrib/grunt-webpack/compare/v1.0.18...v2.0.0-beta.1) (2016-10-23)



<a name="1.0.18"></a>
## [1.0.18](https://github.com/webpack-contrib/grunt-webpack/compare/v1.0.17...v1.0.18) (2016-10-10)



<a name="1.0.17"></a>
## [1.0.17](https://github.com/webpack-contrib/grunt-webpack/compare/v1.0.16...v1.0.17) (2016-10-10)



<a name="1.0.16"></a>
## [1.0.16](https://github.com/webpack-contrib/grunt-webpack/compare/v1.0.15...v1.0.16) (2016-10-01)



<a name="1.0.15"></a>
## [1.0.15](https://github.com/webpack-contrib/grunt-webpack/compare/v1.0.14...v1.0.15) (2016-09-30)



<a name="1.0.14"></a>
## [1.0.14](https://github.com/webpack-contrib/grunt-webpack/compare/v1.0.13...v1.0.14) (2016-07-29)



<a name="1.0.13"></a>
## [1.0.13](https://github.com/webpack-contrib/grunt-webpack/compare/v1.0.12...v1.0.13) (2016-07-29)



<a name="1.0.12"></a>
## [1.0.12](https://github.com/webpack-contrib/grunt-webpack/compare/v1.0.11...v1.0.12) (2016-07-29)


### Bug Fixes

* build fails with an `resolve.alias` called `plugins` fix [#48](https://github.com/webpack-contrib/grunt-webpack/issues/48) ([8c85870](https://github.com/webpack-contrib/grunt-webpack/commit/8c85870))



<a name="1.0.11"></a>
## [1.0.11](https://github.com/webpack-contrib/grunt-webpack/compare/v1.0.10...v1.0.11) (2015-07-02)



<a name="1.0.10"></a>
## 1.0.10 (2015-06-27)
