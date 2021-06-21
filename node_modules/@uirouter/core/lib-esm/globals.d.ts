/**
 * @coreapi
 * @module core
 */ /** */
import { StateParams } from "./params/stateParams";
import { StateDeclaration } from "./state/interface";
import { StateObject } from "./state/stateObject";
import { Transition } from "./transition/transition";
import { Queue } from "./common/queue";
import { Disposable } from './interface';
/**
 * Global router state
 *
 * This is where we hold the global mutable state such as current state, current
 * params, current transition, etc.
 */
export declare class UIRouterGlobals implements Disposable {
    /**
     * Current parameter values
     *
     * The parameter values from the latest successful transition
     */
    params: StateParams;
    /**
     * Current state
     *
     * The to-state from the latest successful transition
     */
    current: StateDeclaration;
    /**
     * Current state (internal object)
     *
     * The to-state from the latest successful transition
     * @internalapi
     */
    $current: StateObject;
    /**
     * The current started/running transition.
     * This transition has reached at least the onStart phase, but is not yet complete
     */
    transition: Transition;
    /** @internalapi */
    lastStartedTransitionId: number;
    /** @internalapi */
    transitionHistory: Queue<Transition>;
    /** @internalapi */
    successfulTransitions: Queue<Transition>;
    dispose(): void;
}
