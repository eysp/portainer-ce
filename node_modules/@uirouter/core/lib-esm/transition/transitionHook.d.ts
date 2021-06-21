/**
 * @coreapi
 * @module transition
 */
/** for typedoc */
import { TransitionHookOptions, HookResult } from './interface';
import { Transition } from './transition';
import { TransitionEventType } from './transitionEventType';
import { RegisteredHook } from './hookRegistry';
import { StateDeclaration } from '../state/interface';
export declare type GetResultHandler = (hook: TransitionHook) => ResultHandler;
export declare type GetErrorHandler = (hook: TransitionHook) => ErrorHandler;
export declare type ResultHandler = (result: HookResult) => Promise<HookResult>;
export declare type ErrorHandler = (error: any) => Promise<any>;
/** @hidden */
export declare class TransitionHook {
    private transition;
    private stateContext;
    private registeredHook;
    private options;
    type: TransitionEventType;
    constructor(transition: Transition, stateContext: StateDeclaration, registeredHook: RegisteredHook, options: TransitionHookOptions);
    /**
     * These GetResultHandler(s) are used by [[invokeHook]] below
     * Each HookType chooses a GetResultHandler (See: [[TransitionService._defineCoreEvents]])
     */
    static HANDLE_RESULT: GetResultHandler;
    /**
     * If the result is a promise rejection, log it.
     * Otherwise, ignore the result.
     */
    static LOG_REJECTED_RESULT: GetResultHandler;
    /**
     * These GetErrorHandler(s) are used by [[invokeHook]] below
     * Each HookType chooses a GetErrorHandler (See: [[TransitionService._defineCoreEvents]])
     */
    static LOG_ERROR: GetErrorHandler;
    static REJECT_ERROR: GetErrorHandler;
    static THROW_ERROR: GetErrorHandler;
    private isSuperseded;
    logError(err: any): any;
    invokeHook(): Promise<HookResult> | void;
    /**
     * This method handles the return value of a Transition Hook.
     *
     * A hook can return false (cancel), a TargetState (redirect),
     * or a promise (which may later resolve to false or a redirect)
     *
     * This also handles "transition superseded" -- when a new transition
     * was started while the hook was still running
     */
    handleHookResult(result: HookResult): Promise<HookResult>;
    /**
     * Return a Rejection promise if the transition is no longer current due
     * to a stopped router (disposed), or a new transition has started and superseded this one.
     */
    private getNotCurrentRejection();
    toString(): string;
    /**
     * Chains together an array of TransitionHooks.
     *
     * Given a list of [[TransitionHook]] objects, chains them together.
     * Each hook is invoked after the previous one completes.
     *
     * #### Example:
     * ```js
     * var hooks: TransitionHook[] = getHooks();
     * let promise: Promise<any> = TransitionHook.chain(hooks);
     *
     * promise.then(handleSuccess, handleError);
     * ```
     *
     * @param hooks the list of hooks to chain together
     * @param waitFor if provided, the chain is `.then()`'ed off this promise
     * @returns a `Promise` for sequentially invoking the hooks (in order)
     */
    static chain(hooks: TransitionHook[], waitFor?: Promise<any>): Promise<any>;
    /**
     * Invokes all the provided TransitionHooks, in order.
     * Each hook's return value is checked.
     * If any hook returns a promise, then the rest of the hooks are chained off that promise, and the promise is returned.
     * If no hook returns a promise, then all hooks are processed synchronously.
     *
     * @param hooks the list of TransitionHooks to invoke
     * @param doneCallback a callback that is invoked after all the hooks have successfully completed
     *
     * @returns a promise for the async result, or the result of the callback
     */
    static invokeHooks<T>(hooks: TransitionHook[], doneCallback: (result?: HookResult) => T): Promise<any> | T;
    /**
     * Run all TransitionHooks, ignoring their return value.
     */
    static runAllHooks(hooks: TransitionHook[]): void;
}
