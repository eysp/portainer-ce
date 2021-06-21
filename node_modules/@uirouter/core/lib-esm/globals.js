/**
 * @coreapi
 * @module core
 */ /** */
import { StateParams } from "./params/stateParams";
import { Queue } from "./common/queue";
/**
 * Global router state
 *
 * This is where we hold the global mutable state such as current state, current
 * params, current transition, etc.
 */
var UIRouterGlobals = /** @class */ (function () {
    function UIRouterGlobals() {
        /**
         * Current parameter values
         *
         * The parameter values from the latest successful transition
         */
        this.params = new StateParams();
        /** @internalapi */
        this.lastStartedTransitionId = -1;
        /** @internalapi */
        this.transitionHistory = new Queue([], 1);
        /** @internalapi */
        this.successfulTransitions = new Queue([], 1);
    }
    UIRouterGlobals.prototype.dispose = function () {
        this.transitionHistory.clear();
        this.successfulTransitions.clear();
        this.transition = null;
    };
    return UIRouterGlobals;
}());
export { UIRouterGlobals };
//# sourceMappingURL=globals.js.map