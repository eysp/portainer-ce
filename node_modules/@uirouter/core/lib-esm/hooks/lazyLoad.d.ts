/** @module hooks */ /** */
import { Transition } from "../transition/transition";
import { TransitionService } from "../transition/transitionService";
import { StateDeclaration, LazyLoadResult } from "../state/interface";
export declare const registerLazyLoadHook: (transitionService: TransitionService) => Function;
/**
 * Invokes a state's lazy load function
 *
 * @param transition a Transition context
 * @param state the state to lazy load
 * @returns A promise for the lazy load result
 */
export declare function lazyLoadState(transition: Transition, state: StateDeclaration): Promise<LazyLoadResult>;
