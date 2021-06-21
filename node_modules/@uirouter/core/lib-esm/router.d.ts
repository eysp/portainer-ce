/**
 * @coreapi
 * @module core
 */ /** */
import { UrlMatcherFactory } from "./url/urlMatcherFactory";
import { UrlRouter } from "./url/urlRouter";
import { TransitionService } from "./transition/transitionService";
import { ViewService } from "./view/view";
import { StateRegistry } from "./state/stateRegistry";
import { StateService } from "./state/stateService";
import { UIRouterGlobals } from "./globals";
import { UIRouterPlugin, Disposable } from "./interface";
import { UrlService } from "./url/urlService";
import { LocationServices, LocationConfig } from "./common/coreservices";
import { Trace } from "./common/trace";
/**
 * The master class used to instantiate an instance of UI-Router.
 *
 * UI-Router (for each specific framework) will create an instance of this class during bootstrap.
 * This class instantiates and wires the UI-Router services together.
 *
 * After a new instance of the UIRouter class is created, it should be configured for your app.
 * For instance, app states should be registered with the [[UIRouter.stateRegistry]].
 *
 * ---
 *
 * Normally the framework code will bootstrap UI-Router.
 * If you are bootstrapping UIRouter manually, tell it to monitor the URL by calling
 * [[UrlService.listen]] then [[UrlService.sync]].
 */
export declare class UIRouter {
    locationService: LocationServices;
    locationConfig: LocationConfig;
    /** @hidden */ $id: number;
    /** @hidden */ _disposed: boolean;
    /** @hidden */ private _disposables;
    /** Provides trace information to the console */
    trace: Trace;
    /** Provides services related to ui-view synchronization */
    viewService: ViewService;
    /** Provides services related to Transitions */
    transitionService: TransitionService;
    /** Global router state */
    globals: UIRouterGlobals;
    /**
     * Deprecated for public use. Use [[urlService]] instead.
     * @deprecated Use [[urlService]] instead
     */
    urlMatcherFactory: UrlMatcherFactory;
    /**
     * Deprecated for public use. Use [[urlService]] instead.
     * @deprecated Use [[urlService]] instead
     */
    urlRouter: UrlRouter;
    /** Provides a registry for states, and related registration services */
    stateRegistry: StateRegistry;
    /** Provides services related to states */
    stateService: StateService;
    /** Provides services related to the URL */
    urlService: UrlService;
    /** Registers an object to be notified when the router is disposed */
    disposable(disposable: Disposable): void;
    /**
     * Disposes this router instance
     *
     * When called, clears resources retained by the router by calling `dispose(this)` on all
     * registered [[disposable]] objects.
     *
     * Or, if a `disposable` object is provided, calls `dispose(this)` on that object only.
     *
     * @param disposable (optional) the disposable to dispose
     */
    dispose(disposable?: any): void;
    /**
     * Creates a new `UIRouter` object
     *
     * @param locationService a [[LocationServices]] implementation
     * @param locationConfig a [[LocationConfig]] implementation
     * @internalapi
     */
    constructor(locationService?: LocationServices, locationConfig?: LocationConfig);
    /** @hidden */
    private _plugins;
    /** Add plugin (as ES6 class) */
    plugin<T extends UIRouterPlugin>(plugin: {
        new (router: UIRouter, options?: any): T;
    }, options?: any): T;
    /** Add plugin (as javascript constructor function) */
    plugin<T extends UIRouterPlugin>(plugin: {
        (router: UIRouter, options?: any): void;
    }, options?: any): T;
    /** Add plugin (as javascript factory function) */
    plugin<T extends UIRouterPlugin>(plugin: PluginFactory<T>, options?: any): T;
    /**
     * Returns registered plugins
     *
     * Returns the registered plugin of the given `pluginName`.
     * If no `pluginName` is given, returns all registered plugins
     *
     * @param pluginName (optional) the name of the plugin to get
     * @return the named plugin (undefined if not found), or all plugins (if `pluginName` is omitted)
     */
    getPlugin(pluginName: string): UIRouterPlugin;
    getPlugin(): UIRouterPlugin[];
}
/** @internalapi */
export declare type PluginFactory<T> = (router: UIRouter, options?: any) => T;
