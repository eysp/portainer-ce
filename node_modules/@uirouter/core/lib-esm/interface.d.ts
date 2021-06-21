import { UIRouter } from "./router";
/**
 * An interface for getting values from dependency injection.
 *
 * This is primarily used to get resolve values for a given token.
 * An instance of the `UIInjector` can be retrieved from the current transition using [[Transition.injector]].
 *
 * ---
 *
 * If no resolve is found for a token, then it will delegate to the native injector.
 * The native injector may be Angular 1 `$injector`, Angular 2 `Injector`, or a simple polyfill.
 *
 * In Angular 2, the native injector might be the root Injector,
 * or it might be a lazy loaded `NgModule` injector scoped to a lazy load state tree.
 */
export interface UIInjector {
    /**
     * Gets a value from the injector.
     *
     * For a given token, returns the value from the injector that matches the token.
     * If the token is for a resolve that has not yet been fetched, this throws an error.
     *
     * #### Example:
     * ```js
     * var myResolve = injector.get('myResolve');
     * ```
     *
     * #### ng1 Example:
     * ```js
     * // Fetch StateService
     * injector.get('$state').go('home');
     * ```
     *
     * #### ng2 Example:
     * ```js
     * import {StateService} from "ui-router-ng2";
     * // Fetch StateService
     * injector.get(StateService).go('home');
     * ```
     *
     * #### Typescript Example:
     * ```js
     * var stringArray = injector.get<string[]>('myStringArray');
     * ```
     *
     * ### `NOWAIT` policy
     *
     * When using [[ResolvePolicy.async]] === `NOWAIT`, the value returned from `get()` is a promise for the result.
     * The promise is not automatically unwrapped.
     *
     * @param token the key for the value to get.  May be a string, a class, or any arbitrary object.
     * @return the Dependency Injection value that matches the token
     */
    get(token: any): any;
    /** Gets a value as type `T` (generics parameter) */
    get<T>(token: any): T;
    /**
     * Asynchronously gets a value from the injector
     *
     * For a given token, returns a promise for the value from the injector that matches the token.
     * If the token is for a resolve that has not yet been fetched, this triggers the resolve to load.
     *
     * #### Example:
     * ```js
     * return injector.getAsync('myResolve').then(value => {
     *   if (value === 'declined') return false;
     * });
     * ```
     *
     * @param token the key for the value to get.  May be a string or arbitrary object.
     * @return a Promise for the Dependency Injection value that matches the token
     */
    getAsync(token: any): Promise<any>;
    /** Asynchronously gets a value as type `T` (generics parameter) */
    getAsync<T>(token: any): Promise<T>;
    /**
     * Gets a value from the native injector
     *
     * Returns a value from the native injector, bypassing anything in the [[ResolveContext]].
     *
     * Example:
     * ```js
     * let someThing = injector.getNative(SomeToken);
     * ```
     *
     * @param token the key for the value to get.  May be a string or arbitrary object.
     * @return the Dependency Injection value that matches the token
     */
    getNative(token: any): any;
    getNative<T>(token: any): T;
}
/** @internalapi */
export interface UIRouterPlugin extends Disposable {
    name: string;
}
/** @internalapi */
export declare abstract class UIRouterPluginBase implements UIRouterPlugin, Disposable {
    name: string;
    dispose(router: UIRouter): void;
}
/** @internalapi */
export interface Disposable {
    /** Instructs the Disposable to clean up any resources */
    dispose(router?: UIRouter): any;
}
