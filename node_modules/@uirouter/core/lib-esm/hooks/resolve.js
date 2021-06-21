/** @module hooks */
/** for typedoc */
import { noop } from '../common/common';
import { ResolveContext } from '../resolve/resolveContext';
import { val } from '../common/hof';
/**
 * A [[TransitionHookFn]] which resolves all EAGER Resolvables in the To Path
 *
 * Registered using `transitionService.onStart({}, eagerResolvePath);`
 *
 * When a Transition starts, this hook resolves all the EAGER Resolvables, which the transition then waits for.
 *
 * See [[StateDeclaration.resolve]]
 */
var eagerResolvePath = function (trans) {
    return new ResolveContext(trans.treeChanges().to)
        .resolvePath("EAGER", trans)
        .then(noop);
};
export var registerEagerResolvePath = function (transitionService) {
    return transitionService.onStart({}, eagerResolvePath, { priority: 1000 });
};
/**
 * A [[TransitionHookFn]] which resolves all LAZY Resolvables for the state (and all its ancestors) in the To Path
 *
 * Registered using `transitionService.onEnter({ entering: () => true }, lazyResolveState);`
 *
 * When a State is being entered, this hook resolves all the Resolvables for this state, which the transition then waits for.
 *
 * See [[StateDeclaration.resolve]]
 */
var lazyResolveState = function (trans, state) {
    return new ResolveContext(trans.treeChanges().to)
        .subContext(state.$$state())
        .resolvePath("LAZY", trans)
        .then(noop);
};
export var registerLazyResolveState = function (transitionService) {
    return transitionService.onEnter({ entering: val(true) }, lazyResolveState, { priority: 1000 });
};
//# sourceMappingURL=resolve.js.map