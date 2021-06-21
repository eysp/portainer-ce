export declare enum RejectType {
    SUPERSEDED = 2,
    ABORTED = 3,
    INVALID = 4,
    IGNORED = 5,
    ERROR = 6,
}
export declare class Rejection {
    $id: number;
    type: number;
    message: string;
    detail: any;
    redirected: boolean;
    constructor(type: number, message?: string, detail?: any);
    toString(): string;
    toPromise(): Promise<any>;
    /** Returns true if the obj is a rejected promise created from the `asPromise` factory */
    static isRejectionPromise(obj: any): boolean;
    /** Returns a Rejection due to transition superseded */
    static superseded(detail?: any, options?: any): Rejection;
    /** Returns a Rejection due to redirected transition */
    static redirected(detail?: any): Rejection;
    /** Returns a Rejection due to invalid transition */
    static invalid(detail?: any): Rejection;
    /** Returns a Rejection due to ignored transition */
    static ignored(detail?: any): Rejection;
    /** Returns a Rejection due to aborted transition */
    static aborted(detail?: any): Rejection;
    /** Returns a Rejection due to aborted transition */
    static errored(detail?: any): Rejection;
    /**
     * Returns a Rejection
     *
     * Normalizes a value as a Rejection.
     * If the value is already a Rejection, returns it.
     * Otherwise, wraps and returns the value as a Rejection (Rejection type: ERROR).
     *
     * @returns `detail` if it is already a `Rejection`, else returns an ERROR Rejection.
     */
    static normalize(detail?: Rejection | Error | any): Rejection;
}
