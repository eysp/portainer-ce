/**
 * @internalapi
 * @module vanilla
 */ /** */
import { deregAll, isDefined, removeFrom, root } from '../common';
import { buildUrl, getParams, parseUrl } from './utils';
/** A base `LocationServices` */
var BaseLocationServices = /** @class */ (function () {
    function BaseLocationServices(router, fireAfterUpdate) {
        var _this = this;
        this.fireAfterUpdate = fireAfterUpdate;
        this._listener = function (evt) { return _this._listeners.forEach(function (cb) { return cb(evt); }); };
        this._listeners = [];
        this.hash = function () { return parseUrl(_this._get()).hash; };
        this.path = function () { return parseUrl(_this._get()).path; };
        this.search = function () { return getParams(parseUrl(_this._get()).search); };
        this._location = root.location;
        this._history = root.history;
    }
    BaseLocationServices.prototype.url = function (url, replace) {
        if (replace === void 0) { replace = true; }
        if (isDefined(url) && url !== this._get()) {
            this._set(null, null, url, replace);
            if (this.fireAfterUpdate) {
                this._listeners.forEach(function (cb) { return cb({ url: url }); });
            }
        }
        return buildUrl(this);
    };
    BaseLocationServices.prototype.onChange = function (cb) {
        var _this = this;
        this._listeners.push(cb);
        return function () { return removeFrom(_this._listeners, cb); };
    };
    BaseLocationServices.prototype.dispose = function (router) {
        deregAll(this._listeners);
    };
    return BaseLocationServices;
}());
export { BaseLocationServices };
//# sourceMappingURL=baseLocationService.js.map