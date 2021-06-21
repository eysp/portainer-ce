/**
 * @internalapi
 * @module vanilla
 */
/** */
import { LocationConfig, LocationServices } from "../common";
import { UIRouter } from "../router";
export declare const keyValsToObjectR: (accum: any, [key, val]: [any, any]) => any;
export declare const getParams: (queryString: string) => any;
export declare function parseUrl(url: string): {
    path: any;
    search: any;
    hash: any;
    url: string;
};
export declare const buildUrl: (loc: LocationServices) => string;
export declare function locationPluginFactory(name: string, isHtml5: boolean, serviceClass: {
    new (router?: UIRouter): LocationServices;
}, configurationClass: {
    new (router?: UIRouter, isHtml5?: boolean): LocationConfig;
}): (router: UIRouter) => {
    name: string;
    service: LocationServices;
    configuration: LocationConfig;
    dispose: (router: UIRouter) => void;
};
