/**
 * @internalapi
 * @module vanilla
 */
/** */
import { identity, unnestR, isArray, splitEqual, splitHash, splitQuery } from "../common";
export var keyValsToObjectR = function (accum, _a) {
    var key = _a[0], val = _a[1];
    if (!accum.hasOwnProperty(key)) {
        accum[key] = val;
    }
    else if (isArray(accum[key])) {
        accum[key].push(val);
    }
    else {
        accum[key] = [accum[key], val];
    }
    return accum;
};
export var getParams = function (queryString) {
    return queryString.split("&").filter(identity).map(splitEqual).reduce(keyValsToObjectR, {});
};
export function parseUrl(url) {
    var orEmptyString = function (x) { return x || ""; };
    var _a = splitHash(url).map(orEmptyString), beforehash = _a[0], hash = _a[1];
    var _b = splitQuery(beforehash).map(orEmptyString), path = _b[0], search = _b[1];
    return { path: path, search: search, hash: hash, url: url };
}
export var buildUrl = function (loc) {
    var path = loc.path();
    var searchObject = loc.search();
    var hash = loc.hash();
    var search = Object.keys(searchObject).map(function (key) {
        var param = searchObject[key];
        var vals = isArray(param) ? param : [param];
        return vals.map(function (val) { return key + "=" + val; });
    }).reduce(unnestR, []).join("&");
    return path + (search ? "?" + search : "") + (hash ? "#" + hash : "");
};
export function locationPluginFactory(name, isHtml5, serviceClass, configurationClass) {
    return function (router) {
        var service = router.locationService = new serviceClass(router);
        var configuration = router.locationConfig = new configurationClass(router, isHtml5);
        function dispose(router) {
            router.dispose(service);
            router.dispose(configuration);
        }
        return { name: name, service: service, configuration: configuration, dispose: dispose };
    };
}
//# sourceMappingURL=utils.js.map