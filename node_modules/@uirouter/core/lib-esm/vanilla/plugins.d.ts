import { LocationPlugin, ServicesPlugin } from "./interface";
import { UIRouter } from "../router";
export declare function servicesPlugin(router: UIRouter): ServicesPlugin;
/** A `UIRouterPlugin` uses the browser hash to get/set the current location */
export declare const hashLocationPlugin: (router: UIRouter) => LocationPlugin;
/** A `UIRouterPlugin` that gets/sets the current location using the browser's `location` and `history` apis */
export declare const pushStateLocationPlugin: (router: UIRouter) => LocationPlugin;
/** A `UIRouterPlugin` that gets/sets the current location from an in-memory object */
export declare const memoryLocationPlugin: (router: UIRouter) => LocationPlugin;
