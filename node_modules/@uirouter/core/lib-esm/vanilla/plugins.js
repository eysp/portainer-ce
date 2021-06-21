/**
 * @internalapi
 * @module vanilla
 */
/** */
import { BrowserLocationConfig } from "./browserLocationConfig";
import { HashLocationService } from "./hashLocationService";
import { locationPluginFactory } from "./utils";
import { PushStateLocationService } from "./pushStateLocationService";
import { MemoryLocationService } from "./memoryLocationService";
import { MemoryLocationConfig } from "./memoryLocationConfig";
import { $injector } from "./injector";
import { $q } from "./q";
import { services } from "../common/coreservices";
export function servicesPlugin(router) {
    services.$injector = $injector;
    services.$q = $q;
    return { name: "vanilla.services", $q: $q, $injector: $injector, dispose: function () { return null; } };
}
/** A `UIRouterPlugin` uses the browser hash to get/set the current location */
export var hashLocationPlugin = locationPluginFactory('vanilla.hashBangLocation', false, HashLocationService, BrowserLocationConfig);
/** A `UIRouterPlugin` that gets/sets the current location using the browser's `location` and `history` apis */
export var pushStateLocationPlugin = locationPluginFactory("vanilla.pushStateLocation", true, PushStateLocationService, BrowserLocationConfig);
/** A `UIRouterPlugin` that gets/sets the current location from an in-memory object */
export var memoryLocationPlugin = locationPluginFactory("vanilla.memoryLocation", false, MemoryLocationService, MemoryLocationConfig);
//# sourceMappingURL=plugins.js.map