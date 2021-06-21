/**
 * @coreapi
 * @module params
 */ /** for typedoc */
import { ParamType } from "./paramType";
/**
 * Parameter values
 *
 * An object containing state parameter key/value pairs
 *
 * #### Example:
 * ```js
 * {
 *   userId: 353474,
 *   folderId: 'inbox'
 * }
 * ```
 *
 * @coreapi
 */
export interface RawParams {
    [key: string]: any;
}
/**
 * Configuration for a single Parameter
 *
 * In a [[StateDeclaration.params]], each `ParamDeclaration`
 * defines how a single State Parameter should work.
 *
 * #### Example:
 * ```js
 * var mystate = {
 *   template: '<div ui-view/>',
 *   controller: function() {}
 *   url: '/mystate/:start?{count:int}',
 *   params: {
 *     start: { // <-- ParamDeclaration for `start`
 *       type: 'date',
 *       value: new Date(), // <-- Default value
 *       squash: true,
 *     },
 *
 *     nonUrlParam: { // <-- ParamDeclaration for 'nonUrlParam'
 *      type: "int",
 *      array: true,
 *      value: []
 *     },
 *
 *     count: 0, // <-- Default value for 'param1'
 *               // (shorthand ParamDeclaration.value)
 *   }
 * }
 * ```
 * @coreapi
 */
export interface ParamDeclaration {
    /**
     * The default value for this parameter.
     *
     * Specifies the default value for this parameter.
     * This implicitly sets this parameter as optional.
     *
     * When UI-Router routes to a state and no value is specified for this parameter in the URL or transition,
     * the default value will be used instead.
     * If value is a function, it will be injected and invoked, and the return value used.
     *
     * Note:  `value: undefined` is treated as though **no default value was specified**, while `value: null` is treated
     * as **"the default value is null"**.
     *
     * ```
     * // define default values for param1 and param2
     * params: {
     *   param1: {
     *     value: "defaultValue"
     *   },
     *   param2: {
     *     value: "param2Default;
     *   }
     * }
     * ```
     *
     * ### Shorthand Declaration
     *
     * If you only want to set the default value of the parameter, you may use a shorthand syntax.
     * In the params map, instead mapping the param name to a full parameter configuration object, simply set map it
     * to the default parameter value, e.g.:
     * ```
     * // Normal (non-shorthand) default value syntax
     * params: {
     *   param1: {
     *     value: "defaultValue"
     *   },
     *   param2: {
     *     value: "param2Default"
     *   }
     * }
     *
     * // Shorthand default value syntax
     * params: {
     *   param1: "defaultValue",
     *   param2: "param2Default"
     * }
     * ```
     *
     * This defines a default value for the parameter.
     * If a parameter value is `undefined`, this default value will be used instead
     *
     * ---
     *
     * Default: `undefined`
     */
    value?: any;
    /**
     * The parameter's type
     *
     * Specifies the [[ParamType]] of the parameter.
     * Parameter types can be used to customize the encoding/decoding of parameter values.
     *
     * Set this property to the name of parameter's type.
     * The type may be either one of the built in types, or a custom type that has been registered with the [[UrlMatcherFactory]].
     *
     * See [[ParamTypes]] for the list of built in types.
     *
     * ---
     *
     * Default:
     * - Path parameters (`/:fooParam`): `path`
     * - Query parameters (`?queryParam`): `query`
     * - Non-url parameters (`param: { foo: null }`): `any`
     *
     */
    type: (string | ParamType);
    /**
     * The parameter's `array` mode
     *
     * Explicitly specifies the array mode of a URL parameter
     *
     * - If `false`, the parameter value will be treated (encoded/decoded) as a single value
     * - If `true`, the parameter value will be treated (encoded/decoded) as an array of values.
     * - If `auto` (for query parameters only), if multiple values for a single parameter are present
     * in the URL (e.g.: /foo?bar=1&bar=2&bar=3) then the values are mapped to an array (e.g.:
     * `{ foo: [ '1', '2', '3' ] }`). However, if only one value is present (e.g.: /foo?bar=1)
     * then the value is treated as single value (e.g.: { foo: '1' }).
     *
     * If you specified a [[type]] for the parameter, the value will be treated as an array
     * of the specified [[ParamType]].
     *
     * #### Example:
     * ```js
     * {
     *   name: 'foo',
     *   url: '/foo/{arrayParam:int}`,
     *   params: {
     *     arrayParam: { array: true }
     *   }
     * }
     *
     * // After the transition, URL should be '/foo/1-2-3'
     * $state.go("foo", { arrayParam: [ 1, 2, 3 ] });
     * ```
     *
     * @default `false` for path parameters, such as `url: '/foo/:pathParam'`
     * @default `auto` for query parameters, such as `url: '/foo?queryParam'`
     * @default `true` if the parameter name ends in `[]`, such as `url: '/foo/{implicitArrayParam:int[]}'`
     */
    array: boolean;
    /**
     * Squash mode: omit default parameter values in URL
     *
     * Configures how a default parameter value is represented in the URL when the current parameter value
     * is the same as the default value.
     *
     * There are three squash settings:
     *
     * - `false`: The parameter's default value is not squashed. It is encoded and included in the URL
     * - `true`: The parameter's default value is omitted from the URL.
     *    If the parameter is preceeded and followed by slashes in the state's url declaration, then one of those slashes are omitted.
     *    This can allow for cleaner looking URLs.
     * - `"&lt;arbitrary string&gt;"`: The parameter's default value is replaced with an arbitrary
     *    placeholder of your choice.
     *
     * #### Example:
     * ```js
     * {
     *   name: 'mystate',
     *   url: '/mystate/:myparam',
     *   params: {
     *     myparam: 'defaultParamValue'
     *     squash: true
     *   }
     * }
     *
     * // URL will be `/mystate/`
     * $state.go('mystate', { myparam: 'defaultParamValue' });
     *
     * // URL will be `/mystate/someOtherValue`
     * $state.go('mystate', { myparam: 'someOtherValue' });
     * ```
     *
     * #### Example:
     * ```js
     * {
     *   name: 'mystate2',
     *   url: '/mystate2/:myparam2',
     *   params: {
     *     myparam2: 'defaultParamValue'
     *     squash: "~"
     *   }
     * }
     *
     * // URL will be `/mystate/~`
     * $state.go('mystate', { myparam2: 'defaultParamValue' });
     *
     * // URL will be `/mystate/someOtherValue`
     * $state.go('mystate', { myparam2: 'someOtherValue' });
     * ```
     *
     * Default: If squash is not set, it uses the configured default squash policy. (See [[defaultSquashPolicy]]())
     */
    squash: (boolean | string);
    /**
     * @internalapi
     *
     * An array of [[Replace]] objects.
     *
     * When creating a Transition, defines how to handle certain special values, such as `undefined`, `null`,
     * or empty string `""`.  If the transition is started, and the parameter value is equal to one of the "to"
     * values, then the parameter value is replaced with the "from" value.
     *
     * #### Example:
     * ```js
     * replace: [
     *   { from: undefined, to: null },
     *   { from: "", to: null }
     * ]
     * ```
     */
    replace: Replace[];
    /**
     * @hidden
     * @internalapi
     *
     * This is not part of the declaration; it is a calculated value depending on if a default value was specified or not.
     */
    isOptional: boolean;
    /**
     * Dynamic flag
     *
     * When `dynamic` is `true`, changes to the parameter value will not cause the state to be entered/exited.
     * The resolves will not be re-fetched, nor will views be reloaded.
     *
     * Normally, if a parameter value changes, the state which declared that the parameter will be reloaded (entered/exited).
     * When a parameter is `dynamic`, a transition still occurs, but it does not cause the state to exit/enter.
     *
     * This can be useful to build UI where the component updates itself when the param values change.
     * A common scenario where this is useful is searching/paging/sorting.
     *
     * ---
     *
     * Note: this value overrides the `dynamic` value on a custom parameter type ([[ParamTypeDefinition.dynamic]]).
     *
     * ---
     *
     * Default: `false`
     */
    dynamic: boolean;
    /**
     * Disables url-encoding of parameter values
     *
     * When `true`, parameter values are not url-encoded.
     * This is commonly used to allow "slug" urls, with a parameter value including non-semantic slashes.
     *
     * #### Example:
     * ```js
     * url: '/product/:slug',
     * params: {
     *   slug: { type: 'string', raw: true }
     * }
     * ```
     *
     * This allows a URL parameter of `{ slug: 'camping/tents/awesome_tent' }`
     * to serialize to `/product/camping/tents/awesome_tent`
     * instead of `/product/camping%2Ftents%2Fawesome_tent`.
     *
     * ---
     *
     * Note: this value overrides the `raw` value on a custom parameter type ([[ParamTypeDefinition.raw]]).
     *
     * ### Decoding warning
     *
     * The decoding behavior of raw parameters is not defined.
     * For example, given a url template such as `/:raw1/:raw2`
     * the url `/foo/bar/baz/qux/`, there is no way to determine which slashes belong to which params.
     *
     * It's generally safe to use a raw parameter at the end of a path, like '/product/:slug'.
     * However, beware of the characters you allow in your raw parameter values.
     * Avoid unencoded characters that could disrupt normal URL parsing, such as `?` and `#`.
     *
     * ---
     *
     * Default: `false`
     */
    raw: boolean;
    /**
     * Enables/disables inheriting of this parameter's value
     *
     * When a transition is run with [[TransitionOptions.inherit]] set to
     * `true`, the current param values are inherited in the new transition.
     * However, parameters values which have `inherit: false` set  will *not be inherited*.
     *
     * #### Example state :
     * ```js
     * var fooState = {
     *   name: 'foo',
     *   url: '/:fooId?mode&refresh',
     *   params: {
     *     refresh: { inherit: false }
     *   }
     * }
     *
     * // Set fooId to 123
     * $state.go('fooState', { fooId: 1234, mode: 'list', refresh: true });
     * ```
     *
     * In the component:
     * `mode: 'list' is inherited, but refresh: true is not inherited.
     * // The param values are thus: `{ fooId: 4567, mode: 'list' }`
     * ```
     * <ui-sref="foo({ fooId: 4567 })">4567</ui-sref>
     * ```
     *
     * ---
     *
     * See also [[TransitionOptions.inherit]] and [[ParamTypeDefinition.inherit]]
     *
     * ---
     *
     * Default: `true`
     */
    inherit: boolean;
}
/** @internalapi */
export interface Replace {
    from: string;
    to: string;
}
/**
 * Describes a custom [[ParamType]]
 *
 * See: [[UrlMatcherFactory.type]]
 *
 * A developer can create a custom parameter type definition to customize the encoding and decoding of parameter values.
 * The definition should implement all the methods of this interface.
 *
 * Parameter values are parsed from the URL as strings.
 * However, it is often useful to parse the string into some other form, such as:
 *
 * - integer
 * - date
 * - array of <integer/date/string>
 * - custom object
 * - some internal string representation
 *
 * Typed parameter definitions control how parameter values are encoded (to the URL) and decoded (from the URL).
 * UI-Router always provides the decoded parameter values to the user (from methods such as [[Transition.params]])).
 *
 * For example, if a state has a url of `/foo/{fooId:int}` (the `fooId` parameter is of the `int` ParamType)
 * and if the browser is at `/foo/123`, then the 123 is parsed as an integer:
 *
 * ```js
 * var fooId = transition.params().fooId;
 * fooId === "123" // false
 * fooId === 123 // true
 * ```
 *
 *
 * #### Examples
 *
 * This example encodes an array of integers as a dash-delimited string to be used in the URL.
 *
 * If we call `$state.go('foo', { fooIds: [20, 30, 40] });`, the URL changes to `/foo/20-30-40`.
 * If we navigate to `/foo/1-2-3`, the `foo` state's onEnter logs `[1, 2, 3]`.
 *
 * @example
 * ```
 *
 * $urlMatcherFactoryProvider.type('intarray', {
 *   // Take an array of ints [1,2,3] and return a string "1-2-3"
 *   encode: (array) => array.join("-"),
 *
 *   // Take an string "1-2-3" and return an array of ints [1,2,3]
 *   decode: (str) => str.split("-").map(x => parseInt(x, 10)),
 *
 *   // Match the encoded string in the URL
 *   pattern: new RegExp("[0-9]+(?:-[0-9]+)*")
 *
 *   // Ensure that the (decoded) object is an array, and that all its elements are numbers
 *   is: (obj) => Array.isArray(obj) &&
 *       obj.reduce((acc, item) => acc && typeof item === 'number', true),
 *
 *   // Compare two arrays of integers
 *   equals: (array1, array2) => array1.length === array2.length &&
 *       array1.reduce((acc, item, idx) => acc && item === array2[idx], true);
 * });
 *
 * $stateProvider.state('foo', {
 *   url: "/foo/{fooIds:intarray}",
 *   onEnter: function($transition$) {
 *     console.log($transition$.fooIds); // Logs "[1, 2, 3]"
 *   }
 * });
 * ```
 *
 *
 * This example decodes an integer from the URL.
 * It uses the integer as an index to look up an item from a static list.
 * That item from the list is the decoded parameter value.
 *
 * @example
 * ```
 *
 * var list = ['John', 'Paul', 'George', 'Ringo'];
 *
 * $urlMatcherFactoryProvider.type('listItem', {
 *   encode: function(item) {
 *     // Represent the list item in the URL using its corresponding index
 *     return list.indexOf(item);
 *   },
 *   decode: function(item) {
 *     // Look up the list item by index
 *     return list[parseInt(item, 10)];
 *   },
 *   is: function(item) {
 *     // Ensure the item is valid by checking to see that it appears
 *     // in the list
 *     return list.indexOf(item) > -1;
 *   }
 * });
 *
 * $stateProvider.state('list', {
 *   url: "/list/{item:listItem}",
 *   controller: function($scope, $stateParams) {
 *     console.log($stateParams.item);
 *   }
 * });
 *
 * // ...
 *
 * // Changes URL to '/list/3', logs "Ringo" to the console
 * $state.go('list', { item: "Ringo" });
 * ```
 *
 * See: [[UrlConfigApi.type]]
 * @coreapi
 */
export interface ParamTypeDefinition {
    /**
     * Tests if some object type is compatible with this parameter type
     *
     * Detects whether some value is of this particular type.
     * Accepts a decoded value and determines whether it matches this `ParamType` object.
     *
     * If your custom type encodes the parameter to a specific type, check for that type here.
     * For example, if your custom type decodes the URL parameter value as an array of ints, return true if the
     * input is an array of ints:
     *
     * ```
     * is: (val) => Array.isArray(val) && array.reduce((acc, x) => acc && parseInt(val, 10) === val, true)
     * ```
     *
     * If your type decodes the URL parameter value to a custom string, check that the string matches
     * the pattern (don't use an arrow fn if you need `this`): `function (val) { return !!this.pattern.exec(val) }`
     *
     * Note: This method is _not used to check if the URL matches_.
     * It's used to check if a _decoded value *is* this type_.
     * Use [[pattern]] to check the encoded value in the URL.
     *
     * @param val The value to check.
     * @param key If the type check is happening in the context of a specific [[UrlMatcher]]  object,
     *        this is the name of the parameter in which `val` is stored. Can be used for
     *        meta-programming of `ParamType` objects.
     * @returns `true` if the value matches the type, otherwise `false`.
     */
    is(val: any, key?: string): boolean;
    /**
     * Encodes a custom/native type value to a string that can be embedded in a URL.
     *
     * Note that the return value does *not* need to be URL-safe (i.e. passed through `encodeURIComponent()`).
     * It only needs to be a representation of `val` that has been encoded as a string.
     *
     * For example, if your custom type decodes to an array of ints, then encode the array of ints to a string here:
     *
     * ```js
     * encode: (intarray) => intarray.join("-")
     * ```
     *
     * Note: in general, [[encode]] and [[decode]] should be symmetrical.  That is, `encode(decode(str)) === str`
     *
     * @param val The value to encode.
     * @param key The name of the parameter in which `val` is stored. Can be used for meta-programming of `ParamType` objects.
     * @returns a string representation of `val` that can be encoded in a URL.
     */
    encode(val: any, key?: string): (string | string[]);
    /**
     * Decodes a parameter value string (from URL string or transition param) to a custom/native value.
     *
     * For example, if your type decodes to an array of ints, then decode the string as an array of ints here:
     * ```js
     * decode: (str) => str.split("-").map(str => parseInt(str, 10))
     * ```
     *
     * Note: in general, [[encode]] and [[decode]] should be symmetrical.  That is, `encode(decode(str)) === str`
     *
     * @param val The URL parameter value to decode.
     * @param key The name of the parameter in which `val` is stored. Can be used for meta-programming of `ParamType` objects.
     * @returns a custom representation of the URL parameter value.
     */
    decode(val: string, key?: string): any;
    /**
     * Determines whether two decoded values are equivalent.
     *
     * For example, if your type decodes to an array of ints, then check if the arrays are equal:
     * ```js
     * equals: (a, b) => a.length === b.length && a.reduce((acc, x, idx) => acc && x === b[idx], true)
     * ```
     *
     * @param a A value to compare against.
     * @param b A value to compare against.
     * @returns `true` if the values are equivalent/equal, otherwise `false`.
     */
    equals(a: any, b: any): boolean;
    /**
     * A regular expression that matches the encoded parameter type
     *
     * This regular expression is used to match an encoded parameter value **in the URL**.
     *
     * For example, if your type encodes as a dash-separated numbers, match that here:
     * `new RegExp("[0-9]+(?:-[0-9]+)*")`.
     *
     * There are some limitations to these regexps:
     *
     * - No capturing groups are allowed (use non-capturing groups: `(?: )`)
     * - No pattern modifiers like case insensitive
     * - No start-of-string or end-of-string: `/^foo$/`
     */
    pattern?: RegExp;
    /**
     * Disables url-encoding of parameter values
     *
     * If a parameter type is declared `raw`, it will not be url-encoded.
     * Custom encoding can still be applied in the [[encode]] function.
     *
     * ### Decoding warning
     *
     * The decoding behavior of raw parameters is not defined.
     * See: [[ParamDeclaration.raw]] for details
     */
    raw?: boolean;
    /**
     * Enables/disables inheriting of parameter values (of this type)
     *
     * When a transition is run with [[TransitionOptions.inherit]] set to
     * `true`, the current param values are inherited in the new transition.
     * However, parameters whose type has `inherit: false` set  will *not be inherited*.
     *
     * The internal parameter type of `hash` has `inherit: false`.
     * This is used to disable inheriting of the hash value (`#`) on subsequent transitions.
     *
     * #### Example:
     * ```js
     * $state.go('home', { '#': 'inboxAnchor' });
     * ...
     * // "#" is not inherited.
     * // The value of the "#" parameter will be `null`
     * // The url's hash will be cleared.
     * $state.go('home.nest');
     * ```
     *
     * ---
     *
     * See also [[TransitionOptions.inherit]] and [[ParamDeclaration.inherit]]
     *
     */
    inherit?: boolean;
    /**
     * Dynamic flag
     *
     * When `dynamic` is `true`, changes to the parameter value will not cause the state to be entered/exited.
     *
     * Normally, if a parameter value changes, the state which declared that the parameter will be reloaded (entered/exited).
     * When a parameter is `dynamic`, a transition still occurs, but it does not cause the state to exit/enter.
     *
     * Default: `false`
     */
    dynamic?: boolean;
}
