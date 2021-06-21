/** @module hooks */ /** */
import { Transition } from "../transition/transition";
import { UIRouter } from "../router";
function addCoreResolvables(trans) {
    trans.addResolvable({ token: UIRouter, deps: [], resolveFn: function () { return trans.router; }, data: trans.router }, "");
    trans.addResolvable({ token: Transition, deps: [], resolveFn: function () { return trans; }, data: trans }, "");
    trans.addResolvable({ token: '$transition$', deps: [], resolveFn: function () { return trans; }, data: trans }, "");
    trans.addResolvable({ token: '$stateParams', deps: [], resolveFn: function () { return trans.params(); }, data: trans.params() }, "");
    trans.entering().forEach(function (state) {
        trans.addResolvable({ token: '$state$', deps: [], resolveFn: function () { return state; }, data: state }, state);
    });
}
export var registerAddCoreResolvables = function (transitionService) {
    return transitionService.onCreate({}, addCoreResolvables);
};
//# sourceMappingURL=coreResolvables.js.map