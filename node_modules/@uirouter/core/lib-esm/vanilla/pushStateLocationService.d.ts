/**
 * @internalapi
 * @module vanilla
 */
/** */
import { UIRouter } from '../router';
import { BaseLocationServices } from './baseLocationService';
import { LocationConfig } from '../common';
/**
 * A `LocationServices` that gets/sets the current location using the browser's `location` and `history` apis
 *
 * Uses `history.pushState` and `history.replaceState`
 */
export declare class PushStateLocationService extends BaseLocationServices {
    _config: LocationConfig;
    constructor(router: UIRouter);
    /**
     * Gets the base prefix without:
     * - trailing slash
     * - trailing filename
     * - protocol and hostname
     *
     * If <base href='/base/index.html'>, this returns '/base'.
     * If <base href='http://localhost:8080/base/index.html'>, this returns '/base'.
     *
     * See: https://html.spec.whatwg.org/dev/semantics.html#the-base-element
     */
    _getBasePrefix(): string;
    _get(): string;
    _set(state: any, title: string, url: string, replace: boolean): void;
    dispose(router: UIRouter): void;
}
