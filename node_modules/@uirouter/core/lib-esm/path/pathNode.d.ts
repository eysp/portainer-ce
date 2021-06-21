import { StateObject } from "../state/stateObject";
import { RawParams } from "../params/interface";
import { Param } from "../params/param";
import { Resolvable } from "../resolve/resolvable";
import { ViewConfig } from "../view/interface";
/**
 * @internalapi
 *
 * A node in a [[TreeChanges]] path
 *
 * For a [[TreeChanges]] path, this class holds the stateful information for a single node in the path.
 * Each PathNode corresponds to a state being entered, exited, or retained.
 * The stateful information includes parameter values and resolve data.
 */
export declare class PathNode {
    /** The state being entered, exited, or retained */
    state: StateObject;
    /** The parameters declared on the state */
    paramSchema: Param[];
    /** The parameter values that belong to the state */
    paramValues: {
        [key: string]: any;
    };
    /** The individual (stateful) resolvable objects that belong to the state */
    resolvables: Resolvable[];
    /** The state's declared view configuration objects */
    views: ViewConfig[];
    /** Creates a copy of a PathNode */
    constructor(node: PathNode);
    /** Creates a new (empty) PathNode for a State */
    constructor(state: StateObject);
    /** Sets [[paramValues]] for the node, from the values of an object hash */
    applyRawParams(params: RawParams): PathNode;
    /** Gets a specific [[Param]] metadata that belongs to the node */
    parameter(name: string): Param;
    /**
     * @returns true if the state and parameter values for another PathNode are
     * equal to the state and param values for this PathNode
     */
    equals(node: PathNode, paramsFn?: GetParamsFn): boolean;
    /**
     * Finds Params with different parameter values on another PathNode.
     *
     * Given another node (of the same state), finds the parameter values which differ.
     * Returns the [[Param]] (schema objects) whose parameter values differ.
     *
     * Given another node for a different state, returns `false`
     *
     * @param node The node to compare to
     * @param paramsFn A function that returns which parameters should be compared.
     * @returns The [[Param]]s which differ, or null if the two nodes are for different states
     */
    diff(node: PathNode, paramsFn?: GetParamsFn): Param[] | false;
    /** Returns a clone of the PathNode */
    static clone(node: PathNode): PathNode;
}
/** @hidden */
export declare type GetParamsFn = (pathNode: PathNode) => Param[];
