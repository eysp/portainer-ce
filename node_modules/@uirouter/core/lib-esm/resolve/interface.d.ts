/**
 * An interface which is similar to an Angular 2 `Provider`
 */
export interface ProviderLike {
    provide: any;
    useClass?: any;
    useFactory?: Function;
    useValue?: any;
    useExisting?: any;
    deps?: any[];
}
/**
 * A plain object used to describe a [[Resolvable]]
 *
 * These objects may be used in the [[StateDeclaration.resolve]] array to declare
 * async data that the state or substates require.
 *
 * #### Example:
 * ```js
 *
 * var state = {
 *   name: 'main',
 *   resolve: [
 *     { token: 'myData', deps: [MyDataApi], resolveFn: (myDataApi) => myDataApi.getData() },
 *   ],
 * }
 * ```
 */
export interface ResolvableLiteral {
    /**
     * A Dependency Injection token
     *
     * This Resolvable's DI token.
     * The Resolvable will be injectable elsewhere using the token.
     */
    token: any;
    /**
     * A function which fetches the Resolvable's data
     *
     * A function which returns one of:
     *
     * - The resolved value (synchronously)
     * - A promise for the resolved value
     * - An Observable of the resolved value(s)
     *
     * This function will be provided the dependencies listed in [[deps]] as its arguments.
     * The resolve system will asynchronously fetch the dependencies before invoking this function.
     */
    resolveFn: Function;
    /**
     * Defines the Resolve Policy
     *
     * A policy that defines when to invoke the resolve,
     * and whether to wait for async and unwrap the data
     */
    policy?: ResolvePolicy;
    /**
     * The Dependency Injection tokens
     *
     * This is an array of Dependency Injection tokens for the dependencies of the [[resolveFn]].
     *
     * The DI tokens are references to other `Resolvables`, or to other
     * services from the native DI system.
     */
    deps?: any[];
    /** Pre-resolved data. */
    data?: any;
}
/**
 * Defines how a resolve is processed during a transition
 *
 * This object is the [[StateDeclaration.resolvePolicy]] property.
 *
 * #### Example:
 * ```js
 * // Fetched when the resolve's state is being entered.
 * // Wait for the promise to resolve.
 * var policy1 = { when: "LAZY", async: "WAIT" }
 *
 * // Fetched when the Transition is starting.
 * // Do not wait for the returned promise to resolve.
 * // Inject the raw promise/value
 * var policy2 = { when: "EAGER", async: "NOWAIT" }
 * ```
 *
 * The policy for a given Resolvable is merged from three sources (highest priority first):
 *
 * - 1) Individual resolve definition
 * - 2) State definition
 * - 3) Global default
 *
 * #### Example:
 * ```js
 * // Wait for an Observable to emit one item.
 * // Since `wait` is not specified, it uses the `wait`
 * // policy defined on the state, or the global default
 * // if no `wait` policy is defined on the state
 * var myResolvablePolicy = { async: "RXWAIT" }
 * ```
 */
export interface ResolvePolicy {
    /**
     * Defines when a Resolvable is resolved (fetched) during a transition
     *
     * - `LAZY` (default)
     *   - Resolved as the resolve's state is being entered
     * - `EAGER`
     *   - Resolved as the transition is starting
     *
     * #### Example:
     * Resolves for `main` and `main.home` are fetched when each state is entered.
     * All of `main` resolves are processed before fetching `main.home` resolves.
     * ```js
     * var state = {
     *   name: 'main',
     *   resolve: mainResolves, // defined elsewhere
     *   resolvePolicy: { when: 'LAZY' }, // default
     * }
     *
     * var state = {
     *   name: 'main.home',
     *   resolve: homeResolves, // defined elsewhere
     *   resolvePolicy: { when: 'LAZY' }, // default
     * }
     * ```
     *
     * #### Example:
     * Resolves for `main` and `main.home` are fetched at the same time when the transition starts.
     * This happens earlier in the lifecycle than when states are entered.
     * All of the `main` and `main.home` resolves are fetched as soon as possible.
     * ```js
     * var mainState = {
     *   name: 'main',
     *   resolve: mainResolves, // defined elsewhere
     *   resolvePolicy: { when: 'EAGER' },
     * }
     *
     * var homeState = {
     *   name: 'main.home',
     *   resolve: homeResolves, // defined elsewhere
     *   resolvePolicy: { when: 'EAGER' },
     * }
     * ```
     */
    when?: PolicyWhen;
    /**
     * Determines the unwrapping behavior of asynchronous resolve values.
     *
     * - `WAIT` (default)
     *   - If a promise is returned from the resolveFn, wait for the promise before proceeding
     *   - The unwrapped value from the promise
     * - `NOWAIT`
     *   - If a promise is returned from the resolve, do not wait for the promise.
     *   - Any other value returned is wrapped in a promise.
     *   - The promise will not be unwrapped.
     *   - The promise itself will be provided when the resolve is injected or bound elsewhere.
     * - `RXWAIT`
     *   - When an Observable is returned from the resolveFn, wait until the Observable emits at least one item.
     *   - The Observable item will not be unwrapped.
     *   - The Observable stream itself will be provided when the resolve is injected or bound elsewhere.
     *
     * #### Example:
     * The `Transition` will not wait for the resolve promise(s) from `main` to settle before continuing.
     * Resolves for `main` will be provided to components wrapped in a `Promise`.
     *
     * The `Transition` will wait for the `main.home` resolve promises.
     * Resolved values will be unwrapped before being provided to components.
     * ```js
     * var mainState = {
     *   name: 'main',
     *   resolve: mainResolves, // defined elsewhere
     *   resolvePolicy: { async: 'NOWAIT' },
     * }
     * var homeState = {
     *   name: 'main.home',
     *   resolve: homeResolves, // defined elsewhere
     *   resolvePolicy: { async: 'WAIT' }, // default
     * }
     * ```
     */
    async?: PolicyAsync;
}
export declare type PolicyWhen = "LAZY" | "EAGER";
export declare type PolicyAsync = "WAIT" | "NOWAIT" | "RXWAIT";
/** @internalapi */
export declare let resolvePolicies: {
    when: {
        LAZY: string;
        EAGER: string;
    };
    async: {
        WAIT: string;
        NOWAIT: string;
        RXWAIT: string;
    };
};
