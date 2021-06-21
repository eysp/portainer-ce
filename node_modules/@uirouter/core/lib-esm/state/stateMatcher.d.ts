import { StateOrName } from "./interface";
import { StateObject } from "./stateObject";
export declare class StateMatcher {
    private _states;
    constructor(_states: {
        [key: string]: StateObject;
    });
    isRelative(stateName: string): boolean;
    find(stateOrName: StateOrName, base?: StateOrName, matchGlob?: boolean): StateObject;
    resolvePath(name: string, base: StateOrName): string;
}
