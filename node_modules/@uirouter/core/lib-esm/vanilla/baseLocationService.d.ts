/**
 * @internalapi
 * @module vanilla
 */ /** */
import { LocationServices } from '../common';
import { Disposable } from '../interface';
import { UIRouter } from '../router';
import { HistoryLike, LocationLike } from './interface';
/** A base `LocationServices` */
export declare abstract class BaseLocationServices implements LocationServices, Disposable {
    fireAfterUpdate: boolean;
    constructor(router: UIRouter, fireAfterUpdate: boolean);
    _listener: (evt: any) => void;
    private _listeners;
    _location: LocationLike;
    _history: HistoryLike;
    /**
     * This should return the current internal URL representation.
     *
     * The internal URL includes only the portion that UI-Router matches.
     * It does not include:
     * - protocol
     * - server
     * - port
     * - base href or hash
     */
    abstract _get(): string;
    /**
     * This should set the current URL.
     *
     * The `url` param should include only the portion that UI-Router matches on.
     * It should not include:
     * - protocol
     * - server
     * - port
     * - base href or hash
     *
     * However, after this function completes, the browser URL should reflect the entire (fully qualified)
     * HREF including those data.
     */
    abstract _set(state: any, title: string, url: string, replace: boolean): any;
    hash: () => any;
    path: () => any;
    search: () => any;
    url(url?: string, replace?: boolean): string;
    onChange(cb: EventListener): () => Function[];
    dispose(router: UIRouter): void;
}
