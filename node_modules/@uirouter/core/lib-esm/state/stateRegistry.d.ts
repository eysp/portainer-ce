/**
 * @coreapi
 * @module state
 */ /** for typedoc */
import { StateObject } from "./stateObject";
import { StateMatcher } from "./stateMatcher";
import { StateQueueManager } from "./stateQueueManager";
import { StateDeclaration, _StateDeclaration } from "./interface";
import { BuilderFunction } from "./stateBuilder";
import { StateOrName } from "./interface";
import { UIRouter } from "../router";
/**
 * The signature for the callback function provided to [[StateRegistry.onStatesChanged]].
 *
 * This callback receives two parameters:
 *
 * @param event a string; either "registered" or "deregistered"
 * @param states the list of [[StateDeclaration]]s that were registered (or deregistered).
 */
export declare type StateRegistryListener = (event: "registered" | "deregistered", states: StateDeclaration[]) => void;
export declare class StateRegistry {
    private _router;
    private _root;
    private states;
    matcher: StateMatcher;
    private builder;
    stateQueue: StateQueueManager;
    listeners: StateRegistryListener[];
    /** @internalapi */
    constructor(_router: UIRouter);
    /** @internalapi */
    private _registerRoot();
    /** @internalapi */
    dispose(): void;
    /**
     * Listen for a State Registry events
     *
     * Adds a callback that is invoked when states are registered or deregistered with the StateRegistry.
     *
     * #### Example:
     * ```js
     * let allStates = registry.get();
     *
     * // Later, invoke deregisterFn() to remove the listener
     * let deregisterFn = registry.onStatesChanged((event, states) => {
     *   switch(event) {
     *     case: 'registered':
     *       states.forEach(state => allStates.push(state));
     *       break;
     *     case: 'deregistered':
     *       states.forEach(state => {
     *         let idx = allStates.indexOf(state);
     *         if (idx !== -1) allStates.splice(idx, 1);
     *       });
     *       break;
     *   }
     * });
     * ```
     *
     * @param listener a callback function invoked when the registered states changes.
     *        The function receives two parameters, `event` and `state`.
     *        See [[StateRegistryListener]]
     * @return a function that deregisters the listener
     */
    onStatesChanged(listener: StateRegistryListener): () => void;
    /**
     * Gets the implicit root state
     *
     * Gets the root of the state tree.
     * The root state is implicitly created by UI-Router.
     * Note: this returns the internal [[StateObject]] representation, not a [[StateDeclaration]]
     *
     * @return the root [[StateObject]]
     */
    root(): StateObject;
    /**
     * Adds a state to the registry
     *
     * Registers a [[StateDeclaration]] or queues it for registration.
     *
     * Note: a state will be queued if the state's parent isn't yet registered.
     *
     * @param stateDefinition the definition of the state to register.
     * @returns the internal [[StateObject]] object.
     *          If the state was successfully registered, then the object is fully built (See: [[StateBuilder]]).
     *          If the state was only queued, then the object is not fully built.
     */
    register(stateDefinition: _StateDeclaration): StateObject;
    /** @hidden */
    private _deregisterTree(state);
    /**
     * Removes a state from the registry
     *
     * This removes a state from the registry.
     * If the state has children, they are are also removed from the registry.
     *
     * @param stateOrName the state's name or object representation
     * @returns {StateObject[]} a list of removed states
     */
    deregister(stateOrName: StateOrName): StateObject[];
    /**
     * Gets all registered states
     *
     * Calling this method with no arguments will return a list of all the states that are currently registered.
     * Note: this does not return states that are *queued* but not yet registered.
     *
     * @return a list of [[StateDeclaration]]s
     */
    get(): StateDeclaration[];
    /**
     * Gets a registered state
     *
     * Given a state or a name, finds and returns the [[StateDeclaration]] from the registry.
     * Note: this does not return states that are *queued* but not yet registered.
     *
     * @param stateOrName either the name of a state, or a state object.
     * @param base the base state to use when stateOrName is relative.
     * @return a registered [[StateDeclaration]] that matched the `stateOrName`, or null if the state isn't registered.
     */
    get(stateOrName: StateOrName, base?: StateOrName): StateDeclaration;
    decorator(name: string, func: BuilderFunction): Function | BuilderFunction | BuilderFunction[];
}
