/**
 * @internalapi
 * @module vanilla
 */
/** */
import { BaseLocationServices } from './baseLocationService';
import { UIRouter } from '../router';
/** A `LocationServices` that gets/sets the current location from an in-memory object */
export declare class MemoryLocationService extends BaseLocationServices {
    _url: string;
    constructor(router: UIRouter);
    _get(): string;
    _set(state: any, title: string, url: string, replace: boolean): void;
}
