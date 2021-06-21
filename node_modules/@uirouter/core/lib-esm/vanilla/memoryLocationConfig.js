import { isDefined } from "../common/predicates";
import { noop } from "../common/common";
/** A `LocationConfig` mock that gets/sets all config from an in-memory object */
var MemoryLocationConfig = /** @class */ (function () {
    function MemoryLocationConfig() {
        var _this = this;
        this._baseHref = '';
        this._port = 80;
        this._protocol = "http";
        this._host = "localhost";
        this._hashPrefix = "";
        this.port = function () { return _this._port; };
        this.protocol = function () { return _this._protocol; };
        this.host = function () { return _this._host; };
        this.baseHref = function () { return _this._baseHref; };
        this.html5Mode = function () { return false; };
        this.hashPrefix = function (newval) { return isDefined(newval) ? _this._hashPrefix = newval : _this._hashPrefix; };
        this.dispose = noop;
    }
    return MemoryLocationConfig;
}());
export { MemoryLocationConfig };
//# sourceMappingURL=memoryLocationConfig.js.map