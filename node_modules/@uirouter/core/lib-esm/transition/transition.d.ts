import { StateDeclaration, StateOrName } from '../state/interface';
import { TransitionOptions, TreeChanges, IHookRegistry, RegisteredHooks, HookRegOptions, HookMatchCriteria, TransitionStateHookFn, TransitionHookFn } from './interface';
import { RegisteredHook } from './hookRegistry';
import { PathNode } from '../path/pathNode';
import { StateObject } from '../state/stateObject';
import { TargetState } from '../state/targetState';
import { Resolvable } from '../resolve/resolvable';
import { ViewConfig } from '../view/interface';
import { UIRouter } from '../router';
import { UIInjector } from '../interface';
import { ResolvableLiteral } from '../resolve/interface';
/**
 * Represents a transition between two states.
 *
 * When navigating to a state, we are transitioning **from** the current state **to** the new state.
 *
 * This object contains all contextual information about the to/from states, parameters, resolves.
 * It has information about all states being entered and exited as a result of the transition.
 */
export declare class Transition implements IHookRegistry {
    /** @hidden */
    static diToken: typeof Transition;
    /**
     * A unique identifier for the transition.
     *
     * This is an auto incrementing integer, starting from `0`.
     */
    $id: number;
    /**
     * A reference to the [[UIRouter]] instance
     *
     * This reference can be used to access the router services, such as the [[StateService]]
     */
    router: UIRouter;
    /** @hidden */
    private _deferred;
    /**
     * This promise is resolved or rejected based on the outcome of the Transition.
     *
     * When the transition is successful, the promise is resolved
     * When the transition is unsuccessful, the promise is rejected with the [[Rejection]] or javascript error
     */
    promise: Promise<any>;
    /**
     * A boolean which indicates if the transition was successful
     *
     * After a successful transition, this value is set to true.
     * After an unsuccessful transition, this value is set to false.
     *
     * The value will be undefined if the transition is not complete
     */
    success: boolean;
    /** @hidden */
    _aborted: boolean;
    /** @hidden */
    private _error;
    /** @hidden Holds the hook registration functions such as those passed to Transition.onStart() */
    _registeredHooks: RegisteredHooks;
    /** @hidden */
    private _options;
    /** @hidden */
    private _treeChanges;
    /** @hidden */
    private _targetState;
    /** @hidden */
    private _hookBuilder;
    /** @hidden */
    onBefore(criteria: HookMatchCriteria, callback: TransitionHookFn, options?: HookRegOptions): Function;
    /** @inheritdoc */
    onStart(criteria: HookMatchCriteria, callback: TransitionHookFn, options?: HookRegOptions): Function;
    /** @inheritdoc */
    onExit(criteria: HookMatchCriteria, callback: TransitionStateHookFn, options?: HookRegOptions): Function;
    /** @inheritdoc */
    onRetain(criteria: HookMatchCriteria, callback: TransitionStateHookFn, options?: HookRegOptions): Function;
    /** @inheritdoc */
    onEnter(criteria: HookMatchCriteria, callback: TransitionStateHookFn, options?: HookRegOptions): Function;
    /** @inheritdoc */
    onFinish(criteria: HookMatchCriteria, callback: TransitionHookFn, options?: HookRegOptions): Function;
    /** @inheritdoc */
    onSuccess(criteria: HookMatchCriteria, callback: TransitionHookFn, options?: HookRegOptions): Function;
    /** @inheritdoc */
    onError(criteria: HookMatchCriteria, callback: TransitionHookFn, options?: HookRegOptions): Function;
    /** @hidden
     * Creates the transition-level hook registration functions
     * (which can then be used to register hooks)
     */
    private createTransitionHookRegFns();
    /** @internalapi */
    getHooks(hookName: string): RegisteredHook[];
    /**
     * Creates a new Transition object.
     *
     * If the target state is not valid, an error is thrown.
     *
     * @internalapi
     *
     * @param fromPath The path of [[PathNode]]s from which the transition is leaving.  The last node in the `fromPath`
     *        encapsulates the "from state".
     * @param targetState The target state and parameters being transitioned to (also, the transition options)
     * @param router The [[UIRouter]] instance
     */
    constructor(fromPath: PathNode[], targetState: TargetState, router: UIRouter);
    private applyViewConfigs(router);
    /**
     * @internalapi
     *
     * @returns the internal from [State] object
     */
    $from(): StateObject;
    /**
     * @internalapi
     *
     * @returns the internal to [State] object
     */
    $to(): StateObject;
    /**
     * Returns the "from state"
     *
     * Returns the state that the transition is coming *from*.
     *
     * @returns The state declaration object for the Transition's ("from state").
     */
    from(): StateDeclaration;
    /**
     * Returns the "to state"
     *
     * Returns the state that the transition is going *to*.
     *
     * @returns The state declaration object for the Transition's target state ("to state").
     */
    to(): StateDeclaration;
    /**
     * Gets the Target State
     *
     * A transition's [[TargetState]] encapsulates the [[to]] state, the [[params]], and the [[options]] as a single object.
     *
     * @returns the [[TargetState]] of this Transition
     */
    targetState(): TargetState;
    /**
     * Determines whether two transitions are equivalent.
     * @deprecated
     */
    is(compare: (Transition | {
        to?: any;
        from?: any;
    })): boolean;
    /**
     * Gets transition parameter values
     *
     * Returns the parameter values for a transition as key/value pairs.
     * This object is immutable.
     *
     * By default, returns the new parameter values (for the "to state").
     *
     * #### Example:
     * ```js
     * var toParams = transition.params();
     * ```
     *
     * To return the previous parameter values,  supply `'from'` as the `pathname` argument.
     *
     * #### Example:
     * ```js
     * var fromParams = transition.params('from');
     * ```
     *
     * @param pathname the name of the treeChanges path to get parameter values for:
     *   (`'to'`, `'from'`, `'entering'`, `'exiting'`, `'retained'`)
     *
     * @returns transition parameter values for the desired path.
     */
    params(pathname?: string): any;
    params<T>(pathname?: string): T;
    /**
     * Creates a [[UIInjector]] Dependency Injector
     *
     * Returns a Dependency Injector for the Transition's target state (to state).
     * The injector provides resolve values which the target state has access to.
     *
     * The `UIInjector` can also provide values from the native root/global injector (ng1/ng2).
     *
     * #### Example:
     * ```js
     * .onEnter({ entering: 'myState' }, trans => {
     *   var myResolveValue = trans.injector().get('myResolve');
     *   // Inject a global service from the global/native injector (if it exists)
     *   var MyService = trans.injector().get('MyService');
     * })
     * ```
     *
     * In some cases (such as `onBefore`), you may need access to some resolve data but it has not yet been fetched.
     * You can use [[UIInjector.getAsync]] to get a promise for the data.
     * #### Example:
     * ```js
     * .onBefore({}, trans => {
     *   return trans.injector().getAsync('myResolve').then(myResolveValue =>
     *     return myResolveValue !== 'ABORT';
     *   });
     * });
     * ```
     *
     * If a `state` is provided, the injector that is returned will be limited to resolve values that the provided state has access to.
     * This can be useful if both a parent state `foo` and a child state `foo.bar` have both defined a resolve such as `data`.
     * #### Example:
     * ```js
     * .onEnter({ to: 'foo.bar' }, trans => {
     *   // returns result of `foo` state's `data` resolve
     *   // even though `foo.bar` also has a `data` resolve
     *   var fooData = trans.injector('foo').get('data');
     * });
     * ```
     *
     * If you need resolve data from the exiting states, pass `'from'` as `pathName`.
     * The resolve data from the `from` path will be returned.
     * #### Example:
     * ```js
     * .onExit({ exiting: 'foo.bar' }, trans => {
     *   // Gets the resolve value of `data` from the exiting state.
     *   var fooData = trans.injector(null, 'foo.bar').get('data');
     * });
     * ```
     *
     *
     * @param state Limits the resolves provided to only the resolves the provided state has access to.
     * @param pathName Default: `'to'`: Chooses the path for which to create the injector. Use this to access resolves for `exiting` states.
     *
     * @returns a [[UIInjector]]
     */
    injector(state?: StateOrName, pathName?: string): UIInjector;
    /**
     * Gets all available resolve tokens (keys)
     *
     * This method can be used in conjunction with [[injector]] to inspect the resolve values
     * available to the Transition.
     *
     * This returns all the tokens defined on [[StateDeclaration.resolve]] blocks, for the states
     * in the Transition's [[TreeChanges.to]] path.
     *
     * #### Example:
     * This example logs all resolve values
     * ```js
     * let tokens = trans.getResolveTokens();
     * tokens.forEach(token => console.log(token + " = " + trans.injector().get(token)));
     * ```
     *
     * #### Example:
     * This example creates promises for each resolve value.
     * This triggers fetches of resolves (if any have not yet been fetched).
     * When all promises have all settled, it logs the resolve values.
     * ```js
     * let tokens = trans.getResolveTokens();
     * let promise = tokens.map(token => trans.injector().getAsync(token));
     * Promise.all(promises).then(values => console.log("Resolved values: " + values));
     * ```
     *
     * Note: Angular 1 users whould use `$q.all()`
     *
     * @param pathname resolve context's path name (e.g., `to` or `from`)
     *
     * @returns an array of resolve tokens (keys)
     */
    getResolveTokens(pathname?: string): any[];
    /**
     * Dynamically adds a new [[Resolvable]] (i.e., [[StateDeclaration.resolve]]) to this transition.
     *
     * #### Example:
     * ```js
     * transitionService.onBefore({}, transition => {
     *   transition.addResolvable({
     *     token: 'myResolve',
     *     deps: ['MyService'],
     *     resolveFn: myService => myService.getData()
     *   });
     * });
     * ```
     *
     * @param resolvable a [[ResolvableLiteral]] object (or a [[Resolvable]])
     * @param state the state in the "to path" which should receive the new resolve (otherwise, the root state)
     */
    addResolvable(resolvable: Resolvable | ResolvableLiteral, state?: StateOrName): void;
    /**
     * Gets the transition from which this transition was redirected.
     *
     * If the current transition is a redirect, this method returns the transition that was redirected.
     *
     * #### Example:
     * ```js
     * let transitionA = $state.go('A').transition
     * transitionA.onStart({}, () => $state.target('B'));
     * $transitions.onSuccess({ to: 'B' }, (trans) => {
     *   trans.to().name === 'B'; // true
     *   trans.redirectedFrom() === transitionA; // true
     * });
     * ```
     *
     * @returns The previous Transition, or null if this Transition is not the result of a redirection
     */
    redirectedFrom(): Transition;
    /**
     * Gets the original transition in a redirect chain
     *
     * A transition might belong to a long chain of multiple redirects.
     * This method walks the [[redirectedFrom]] chain back to the original (first) transition in the chain.
     *
     * #### Example:
     * ```js
     * // states
     * registry.register({ name: 'A', redirectTo: 'B' });
     * registry.register({ name: 'B', redirectTo: 'C' });
     * registry.register({ name: 'C', redirectTo: 'D' });
     * registry.register({ name: 'D' });
     *
     * let transitionA = $state.go('A').transition
     *
     * $transitions.onSuccess({ to: 'D' }, (trans) => {
     *   trans.to().name === 'D'; // true
     *   trans.redirectedFrom().to().name === 'C'; // true
     *   trans.originalTransition() === transitionA; // true
     *   trans.originalTransition().to().name === 'A'; // true
     * });
     * ```
     *
     * @returns The original Transition that started a redirect chain
     */
    originalTransition(): Transition;
    /**
     * Get the transition options
     *
     * @returns the options for this Transition.
     */
    options(): TransitionOptions;
    /**
     * Gets the states being entered.
     *
     * @returns an array of states that will be entered during this transition.
     */
    entering(): StateDeclaration[];
    /**
     * Gets the states being exited.
     *
     * @returns an array of states that will be exited during this transition.
     */
    exiting(): StateDeclaration[];
    /**
     * Gets the states being retained.
     *
     * @returns an array of states that are already entered from a previous Transition, that will not be
     *    exited during this Transition
     */
    retained(): StateDeclaration[];
    /**
     * Get the [[ViewConfig]]s associated with this Transition
     *
     * Each state can define one or more views (template/controller), which are encapsulated as `ViewConfig` objects.
     * This method fetches the `ViewConfigs` for a given path in the Transition (e.g., "to" or "entering").
     *
     * @param pathname the name of the path to fetch views for:
     *   (`'to'`, `'from'`, `'entering'`, `'exiting'`, `'retained'`)
     * @param state If provided, only returns the `ViewConfig`s for a single state in the path
     *
     * @returns a list of ViewConfig objects for the given path.
     */
    views(pathname?: string, state?: StateObject): ViewConfig[];
    /**
     * Return the transition's tree changes
     *
     * A transition goes from one state/parameters to another state/parameters.
     * During a transition, states are entered and/or exited.
     *
     * This function returns various branches (paths) which represent the changes to the
     * active state tree that are caused by the transition.
     *
     * @param pathname The name of the tree changes path to get:
     *   (`'to'`, `'from'`, `'entering'`, `'exiting'`, `'retained'`)
     */
    treeChanges(pathname: string): PathNode[];
    treeChanges(): TreeChanges;
    /**
     * Creates a new transition that is a redirection of the current one.
     *
     * This transition can be returned from a [[TransitionService]] hook to
     * redirect a transition to a new state and/or set of parameters.
     *
     * @internalapi
     *
     * @returns Returns a new [[Transition]] instance.
     */
    redirect(targetState: TargetState): Transition;
    /** @hidden If a transition doesn't exit/enter any states, returns any [[Param]] whose value changed */
    private _changedParams();
    /**
     * Returns true if the transition is dynamic.
     *
     * A transition is dynamic if no states are entered nor exited, but at least one dynamic parameter has changed.
     *
     * @returns true if the Transition is dynamic
     */
    dynamic(): boolean;
    /**
     * Returns true if the transition is ignored.
     *
     * A transition is ignored if no states are entered nor exited, and no parameter values have changed.
     *
     * @returns true if the Transition is ignored.
     */
    ignored(): boolean;
    /** @hidden */
    _ignoredReason(): "SameAsCurrent" | "SameAsPending" | undefined;
    /**
     * Runs the transition
     *
     * This method is generally called from the [[StateService.transitionTo]]
     *
     * @internalapi
     *
     * @returns a promise for a successful transition.
     */
    run(): Promise<any>;
    /** Checks if this transition is currently active/running. */
    isActive: () => boolean;
    /**
     * Checks if the Transition is valid
     *
     * @returns true if the Transition is valid
     */
    valid(): boolean;
    /**
     * Aborts this transition
     *
     * Imperative API to abort a Transition.
     * This only applies to Transitions that are not yet complete.
     */
    abort(): void;
    /**
     * The Transition error reason.
     *
     * If the transition is invalid (and could not be run), returns the reason the transition is invalid.
     * If the transition was valid and ran, but was not successful, returns the reason the transition failed.
     *
     * @returns an error message explaining why the transition is invalid, or the reason the transition failed.
     */
    error(): any;
    /**
     * A string representation of the Transition
     *
     * @returns A string representation of the Transition
     */
    toString(): string;
}
