import { UIRouter } from '../router';
import { BaseLocationServices } from './baseLocationService';
/** A `LocationServices` that uses the browser hash "#" to get/set the current location */
export declare class HashLocationService extends BaseLocationServices {
    constructor(router: UIRouter);
    _get(): string;
    _set(state: any, title: string, url: string, replace: boolean): void;
    dispose(router: UIRouter): void;
}
