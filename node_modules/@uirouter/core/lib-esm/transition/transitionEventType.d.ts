/** @module transition */ /** */
import { TransitionHookPhase, PathType } from "./interface";
import { GetErrorHandler, GetResultHandler } from "./transitionHook";
/**
 * This class defines a type of hook, such as `onBefore` or `onEnter`.
 * Plugins can define custom hook types, such as sticky states does for `onInactive`.
 *
 * @interalapi
 */
export declare class TransitionEventType {
    name: string;
    hookPhase: TransitionHookPhase;
    hookOrder: number;
    criteriaMatchPath: PathType;
    reverseSort: boolean;
    getResultHandler: GetResultHandler;
    getErrorHandler: GetErrorHandler;
    synchronous: boolean;
    constructor(name: string, hookPhase: TransitionHookPhase, hookOrder: number, criteriaMatchPath: PathType, reverseSort?: boolean, getResultHandler?: GetResultHandler, getErrorHandler?: GetErrorHandler, synchronous?: boolean);
}
