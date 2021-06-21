/**
 * @coreapi
 * @module params
 */
/** */
import { fromJson, toJson, identity, equals, inherit, map, extend, pick } from "../common/common";
import { isDefined, isNullOrUndefined } from "../common/predicates";
import { is } from "../common/hof";
import { services } from "../common/coreservices";
import { ParamType } from "./paramType";
/**
 * A registry for parameter types.
 *
 * This registry manages the built-in (and custom) parameter types.
 *
 * The built-in parameter types are:
 *
 * - [[string]]
 * - [[path]]
 * - [[query]]
 * - [[hash]]
 * - [[int]]
 * - [[bool]]
 * - [[date]]
 * - [[json]]
 * - [[any]]
 */
var ParamTypes = /** @class */ (function () {
    /** @internalapi */
    function ParamTypes() {
        /** @hidden */
        this.enqueue = true;
        /** @hidden */
        this.typeQueue = [];
        /** @internalapi */
        this.defaultTypes = pick(ParamTypes.prototype, ["hash", "string", "query", "path", "int", "bool", "date", "json", "any"]);
        // Register default types. Store them in the prototype of this.types.
        var makeType = function (definition, name) {
            return new ParamType(extend({ name: name }, definition));
        };
        this.types = inherit(map(this.defaultTypes, makeType), {});
    }
    /** @internalapi */
    ParamTypes.prototype.dispose = function () {
        this.types = {};
    };
    /**
     * Registers a parameter type
     *
     * End users should call [[UrlMatcherFactory.type]], which delegates to this method.
     */
    ParamTypes.prototype.type = function (name, definition, definitionFn) {
        if (!isDefined(definition))
            return this.types[name];
        if (this.types.hasOwnProperty(name))
            throw new Error("A type named '" + name + "' has already been defined.");
        this.types[name] = new ParamType(extend({ name: name }, definition));
        if (definitionFn) {
            this.typeQueue.push({ name: name, def: definitionFn });
            if (!this.enqueue)
                this._flushTypeQueue();
        }
        return this;
    };
    /** @internalapi */
    ParamTypes.prototype._flushTypeQueue = function () {
        while (this.typeQueue.length) {
            var type = this.typeQueue.shift();
            if (type.pattern)
                throw new Error("You cannot override a type's .pattern at runtime.");
            extend(this.types[type.name], services.$injector.invoke(type.def));
        }
    };
    return ParamTypes;
}());
export { ParamTypes };
/** @hidden */
function initDefaultTypes() {
    var makeDefaultType = function (def) {
        var valToString = function (val) {
            return val != null ? val.toString() : val;
        };
        var defaultTypeBase = {
            encode: valToString,
            decode: valToString,
            is: is(String),
            pattern: /.*/,
            equals: function (a, b) { return a == b; },
        };
        return extend({}, defaultTypeBase, def);
    };
    // Default Parameter Type Definitions
    extend(ParamTypes.prototype, {
        string: makeDefaultType({}),
        path: makeDefaultType({
            pattern: /[^/]*/,
        }),
        query: makeDefaultType({}),
        hash: makeDefaultType({
            inherit: false,
        }),
        int: makeDefaultType({
            decode: function (val) { return parseInt(val, 10); },
            is: function (val) {
                return !isNullOrUndefined(val) && this.decode(val.toString()) === val;
            },
            pattern: /-?\d+/,
        }),
        bool: makeDefaultType({
            encode: function (val) { return val && 1 || 0; },
            decode: function (val) { return parseInt(val, 10) !== 0; },
            is: is(Boolean),
            pattern: /0|1/,
        }),
        date: makeDefaultType({
            encode: function (val) {
                return !this.is(val) ? undefined : [
                    val.getFullYear(),
                    ('0' + (val.getMonth() + 1)).slice(-2),
                    ('0' + val.getDate()).slice(-2),
                ].join("-");
            },
            decode: function (val) {
                if (this.is(val))
                    return val;
                var match = this.capture.exec(val);
                return match ? new Date(match[1], match[2] - 1, match[3]) : undefined;
            },
            is: function (val) { return val instanceof Date && !isNaN(val.valueOf()); },
            equals: function (l, r) {
                return ['getFullYear', 'getMonth', 'getDate']
                    .reduce(function (acc, fn) { return acc && l[fn]() === r[fn](); }, true);
            },
            pattern: /[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])/,
            capture: /([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/,
        }),
        json: makeDefaultType({
            encode: toJson,
            decode: fromJson,
            is: is(Object),
            equals: equals,
            pattern: /[^/]*/,
        }),
        // does not encode/decode
        any: makeDefaultType({
            encode: identity,
            decode: identity,
            is: function () { return true; },
            equals: equals,
        }),
    });
}
initDefaultTypes();
//# sourceMappingURL=paramTypes.js.map