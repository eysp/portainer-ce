import { _StateDeclaration } from "./interface";
import { StateObject } from "./stateObject";
import { StateBuilder } from "./stateBuilder";
import { StateRegistryListener, StateRegistry } from "./stateRegistry";
import { Disposable } from "../interface";
import { UrlRouter } from "../url/urlRouter";
import { StateMatcher } from "./stateMatcher";
/** @internalapi */
export declare class StateQueueManager implements Disposable {
    private $registry;
    private $urlRouter;
    states: {
        [key: string]: StateObject;
    };
    builder: StateBuilder;
    listeners: StateRegistryListener[];
    queue: StateObject[];
    matcher: StateMatcher;
    constructor($registry: StateRegistry, $urlRouter: UrlRouter, states: {
        [key: string]: StateObject;
    }, builder: StateBuilder, listeners: StateRegistryListener[]);
    /** @internalapi */
    dispose(): void;
    register(stateDecl: _StateDeclaration): StateObject;
    flush(): {
        [key: string]: StateObject;
    };
    attachRoute(state: StateObject): void;
}
