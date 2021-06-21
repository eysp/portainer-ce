import { LocationConfig } from "../common/coreservices";
/** A `LocationConfig` that delegates to the browser's `location` object */
export declare class BrowserLocationConfig implements LocationConfig {
    private _isHtml5;
    private _baseHref;
    private _hashPrefix;
    constructor(router?: any, _isHtml5?: boolean);
    port(): number;
    protocol(): string;
    host(): string;
    html5Mode(): boolean;
    hashPrefix(): string;
    baseHref(href?: string): string;
    applyDocumentBaseHref(): string;
    dispose(): void;
}
