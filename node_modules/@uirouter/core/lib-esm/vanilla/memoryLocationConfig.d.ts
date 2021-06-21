/**
 * @internalapi
 * @module vanilla
 */
/** */
import { LocationConfig } from "../common/coreservices";
import { noop } from "../common/common";
/** A `LocationConfig` mock that gets/sets all config from an in-memory object */
export declare class MemoryLocationConfig implements LocationConfig {
    _baseHref: string;
    _port: number;
    _protocol: string;
    _host: string;
    _hashPrefix: string;
    port: () => number;
    protocol: () => string;
    host: () => string;
    baseHref: () => string;
    html5Mode: () => boolean;
    hashPrefix: (newval?: any) => any;
    dispose: typeof noop;
}
