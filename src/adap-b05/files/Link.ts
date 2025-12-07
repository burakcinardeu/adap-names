import { Node } from "./Node";
import { Directory } from "./Directory";
// import { InvalidStateException } from "../common/InvalidStateException"; // Assumed import

export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        super(bn, pn);

        // Precondition check for targetNode: targetNode cannot be the Link itself (optional, but good practice)
        if (tn === this) {
            // throw new Error("IllegalArgumentException: A Link cannot target itself.");
        }

        if (tn != undefined) {
            this.targetNode = tn;
        }
    }

    public getTargetNode(): Node | null {
        return this.targetNode;
    }

    public setTargetNode(target: Node): void {
        this.targetNode = target;
    }

    // --- Delegated Methods ---

    public getBaseName(): string {
        // Enforce the contract that the link must be valid before delegation
        const target = this.ensureTargetNode(); 
        return target.getBaseName();
    }

    public rename(bn: string): void {
        // Enforce the contract that the link must be valid before delegation
        const target = this.ensureTargetNode(); 
        target.rename(bn);
    }

    /**
     * Ensures that targetNode is not null and throws an exception if the link is broken.
     * This acts as a Class Invariant check or a Precondition for delegated methods.
     */
    protected ensureTargetNode(): Node {
        if (this.targetNode === null) {
  
            // Using InvalidStateException is often appropriate for internal state failure.
            throw new Error("InvalidStateException: The Link does not point to a valid target node (link is broken)."); 
        }
        
        // Target is guaranteed not to be null here.
        return this.targetNode;
    }
}