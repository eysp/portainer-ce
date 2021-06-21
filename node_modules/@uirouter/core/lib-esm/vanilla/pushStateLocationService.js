var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { BaseLocationServices } from './baseLocationService';
import { root, splitHash, splitQuery, stripFile } from '../common';
/**
 * A `LocationServices` that gets/sets the current location using the browser's `location` and `history` apis
 *
 * Uses `history.pushState` and `history.replaceState`
 */
var PushStateLocationService = /** @class */ (function (_super) {
    __extends(PushStateLocationService, _super);
    function PushStateLocationService(router) {
        var _this = _super.call(this, router, true) || this;
        _this._config = router.urlService.config;
        root.addEventListener('popstate', _this._listener, false);
        return _this;
    }
    ;
    /**
     * Gets the base prefix without:
     * - trailing slash
     * - trailing filename
     * - protocol and hostname
     *
     * If <base href='/base/index.html'>, this returns '/base'.
     * If <base href='http://localhost:8080/base/index.html'>, this returns '/base'.
     *
     * See: https://html.spec.whatwg.org/dev/semantics.html#the-base-element
     */
    PushStateLocationService.prototype._getBasePrefix = function () {
        return stripFile(this._config.baseHref());
    };
    PushStateLocationService.prototype._get = function () {
        var _a = this._location, pathname = _a.pathname, hash = _a.hash, search = _a.search;
        search = splitQuery(search)[1]; // strip ? if found
        hash = splitHash(hash)[1]; // strip # if found
        var basePrefix = this._getBasePrefix();
        var exactMatch = pathname === this._config.baseHref();
        var startsWith = pathname.startsWith(basePrefix);
        pathname = exactMatch ? '/' : startsWith ? pathname.substring(basePrefix.length) : pathname;
        return pathname + (search ? '?' + search : '') + (hash ? '#' + hash : '');
    };
    PushStateLocationService.prototype._set = function (state, title, url, replace) {
        var fullUrl = this._getBasePrefix() + url;
        if (replace) {
            this._history.replaceState(state, title, fullUrl);
        }
        else {
            this._history.pushState(state, title, fullUrl);
        }
    };
    PushStateLocationService.prototype.dispose = function (router) {
        _super.prototype.dispose.call(this, router);
        root.removeEventListener('popstate', this._listener);
    };
    return PushStateLocationService;
}(BaseLocationServices));
export { PushStateLocationService };
//# sourceMappingURL=pushStateLocationService.js.map