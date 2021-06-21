"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Plugin;

var _includes2 = _interopRequireDefault(require("lodash/includes"));

var _isMatch2 = _interopRequireDefault(require("lodash/isMatch"));

var _memoize2 = _interopRequireDefault(require("lodash/memoize"));

var _forOwn2 = _interopRequireDefault(require("lodash/forOwn"));

var _escapeRegExp2 = _interopRequireDefault(require("lodash/escapeRegExp"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _listing = require("./listing");

var _mapping = require("./mapping");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var lodashRoot = _path.default.dirname(require.resolve('lodash'));

var normalize = function normalize(string) {
  return string.replace(reFwdSep, rsSysSep);
};

var reFwdSep = /\//g;
var rsSysSep = (0, _escapeRegExp2.default)(_path.default.sep);
var reLodashRes = RegExp(normalize('lodash(?:/(?!fp/)|-amd/|-es/|\\.\\w+/)'));
var reExplicitReq = RegExp('^lodash(?:/|-amd/|-es/|\\.\\w+/)\\w+$');

function getPatterns(options) {
  var result = [];
  (0, _forOwn2.default)(_mapping.features, function (pairs, key) {
    if (!options[key]) {
      result.push.apply(result, _toConsumableArray(pairs));
    }
  });
  return result;
}
/*----------------------------------------------------------------------------*/


var LodashModuleReplacementPlugin =
/*#__PURE__*/
function () {
  function LodashModuleReplacementPlugin(options) {
    _classCallCheck(this, LodashModuleReplacementPlugin);

    this.matches = [];
    this.options = Object.assign({}, options);
    this.patterns = getPatterns(this.options);
    this.resolve = this.resolve.bind(this);
  }

  _createClass(LodashModuleReplacementPlugin, [{
    key: "apply",
    value: function apply(compiler) {
      var resolve = (0, _memoize2.default)(this.resolve, function (_ref) {
        var resource = _ref.resource;
        return resource;
      });
      /* Webpack >= 4 */

      if (compiler.hooks) {
        compiler.hooks.normalModuleFactory.tap('LodashModuleReplacementPlugin', function (nmf) {
          nmf.hooks.afterResolve.tap('LodashModuleReplacementPlugin', function (data) {
            if (data) {
              data.resource = resolve(data);
            }

            return data;
          });
        });
      } else {
        compiler.plugin('normal-module-factory', function (nmf) {
          nmf.plugin('after-resolve', function (data, callback) {
            if (data) {
              data.resource = resolve(data);
              return callback(null, data);
            }

            return callback();
          });
        });
      }
    }
  }, {
    key: "resolve",
    value: function resolve(_ref2) {
      var _this = this;

      var rawRequest = _ref2.rawRequest,
          resource = _ref2.resource;
      var result = resource;

      if (!reLodashRes.test(resource)) {
        return result;
      }

      var isExplicit = reExplicitReq.test(rawRequest);

      var resName = _path.default.basename(resource, '.js');

      var resRoot = _path.default.dirname(resource);

      if (isExplicit) {
        // Apply any feature set overrides for explicitly requested modules.
        var override = _mapping.overrides[_path.default.basename(rawRequest, '.js')];

        if (!(0, _isMatch2.default)(this.options, override)) {
          this.patterns = getPatterns(Object.assign(this.options, override));
        }
      }

      this.patterns.forEach(function (pair) {
        // Replace matches as long as they aren't explicit requests for stubbed modules.
        var isStubbed = (0, _includes2.default)(_listing.stubs, pair[1]);

        if (resName != pair[0] || isExplicit && isStubbed) {
          return;
        }

        var moduleFilename = `${pair[1]}.js`;

        var modulePath = _path.default.join(resRoot, moduleFilename);

        var exists = _fs.default.existsSync(modulePath);

        if (isStubbed && !exists) {
          exists = true;
          modulePath = _path.default.join(lodashRoot, moduleFilename);
        }

        if (exists) {
          result = modulePath;

          _this.matches.push([resource, result]);

          return false;
        }
      });
      return result;
    }
  }]);

  return LodashModuleReplacementPlugin;
}();

;
/*----------------------------------------------------------------------------*/

function Plugin(nodeResolve, options) {
  // For Webpack.
  if (this instanceof Plugin) {
    return new LodashModuleReplacementPlugin(nodeResolve);
  } // For Rollup.


  var _resolveId = nodeResolve.resolveId;
  var resolver = new LodashModuleReplacementPlugin(options);
  var resolve = (0, _memoize2.default)(resolver.resolve, function (_ref3) {
    var resource = _ref3.resource;
    return resource;
  });
  return Object.assign({}, nodeResolve, {
    resolveId(importee, importer) {
      return _resolveId(importee, importer).then(function (id) {
        return resolve({
          'rawRequest': importee,
          'resource': id
        });
      });
    }

  });
}

;
module.exports = exports["default"];