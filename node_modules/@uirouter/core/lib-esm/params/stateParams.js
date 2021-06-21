/**
 * @coreapi
 * @module params
 */
/** */
import { extend, ancestors } from "../common/common";
/** @internalapi */
var StateParams = /** @class */ (function () {
    function StateParams(params) {
        if (params === void 0) { params = {}; }
        extend(this, params);
    }
    /**
     * Merges a set of parameters with all parameters inherited between the common parents of the
     * current state and a given destination state.
     *
     * @param {Object} newParams The set of parameters which will be composited with inherited params.
     * @param {Object} $current Internal definition of object representing the current state.
     * @param {Object} $to Internal definition of object representing state to transition to.
     */
    StateParams.prototype.$inherit = function (newParams, $current, $to) {
        var parents = ancestors($current, $to), parentParams, inherited = {}, inheritList = [];
        for (var i in parents) {
            if (!parents[i] || !parents[i].params)
                continue;
            parentParams = Object.keys(parents[i].params);
            if (!parentParams.length)
                continue;
            for (var j in parentParams) {
                if (inheritList.indexOf(parentParams[j]) >= 0)
                    continue;
                inheritList.push(parentParams[j]);
                inherited[parentParams[j]] = this[parentParams[j]];
            }
        }
        return extend({}, inherited, newParams);
    };
    ;
    return StateParams;
}());
export { StateParams };
//# sourceMappingURL=stateParams.js.map