import { RawParams, ParamDeclaration } from "../params/interface";
import { ParamType } from "./paramType";
import { UrlMatcherFactory } from "../url/urlMatcherFactory";
/** @internalapi */
export declare enum DefType {
    PATH = 0,
    SEARCH = 1,
    CONFIG = 2,
}
/** @internalapi */
export declare class Param {
    id: string;
    type: ParamType;
    location: DefType;
    isOptional: boolean;
    dynamic: boolean;
    raw: boolean;
    squash: (boolean | string);
    replace: [{
        to: any;
        from: any;
    }];
    inherit: boolean;
    array: boolean;
    config: any;
    /** Cache the default value if it is a static value */
    _defaultValueCache: {
        defaultValue: any;
    };
    constructor(id: string, type: ParamType, config: ParamDeclaration, location: DefType, urlMatcherFactory: UrlMatcherFactory);
    isDefaultValue(value: any): boolean;
    /**
     * [Internal] Gets the decoded representation of a value if the value is defined, otherwise, returns the
     * default value, which may be the result of an injectable function.
     */
    value(value?: any): any;
    isSearch(): boolean;
    validates(value: any): boolean;
    toString(): string;
    static values(params: Param[], values?: RawParams): RawParams;
    /**
     * Finds [[Param]] objects which have different param values
     *
     * Filters a list of [[Param]] objects to only those whose parameter values differ in two param value objects
     *
     * @param params: The list of Param objects to filter
     * @param values1: The first set of parameter values
     * @param values2: the second set of parameter values
     *
     * @returns any Param objects whose values were different between values1 and values2
     */
    static changed(params: Param[], values1?: RawParams, values2?: RawParams): Param[];
    /**
     * Checks if two param value objects are equal (for a set of [[Param]] objects)
     *
     * @param params The list of [[Param]] objects to check
     * @param values1 The first set of param values
     * @param values2 The second set of param values
     *
     * @returns true if the param values in values1 and values2 are equal
     */
    static equals(params: Param[], values1?: {}, values2?: {}): boolean;
    /** Returns true if a the parameter values are valid, according to the Param definitions */
    static validates(params: Param[], values?: RawParams): boolean;
}
