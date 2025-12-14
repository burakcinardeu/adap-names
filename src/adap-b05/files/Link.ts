import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException"; 
import { InvalidStateException } from "../common/InvalidStateException"; 
// Assuming all necessary exceptions are available

export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        // Calls Node constructor, which handles basic baseName and parentNode checks.
        super(bn, pn);

        // PRECONDITION: A link must not target itself (Self-Targeting Check)
        if (tn === this) {
            throw new IllegalArgumentException("A Link cannot target itself.");
        }

        if (tn != undefined) {
            this.targetNode = tn;
        }
    }

    public getTargetNode(): Node | null {
        return this.targetNode;
    }

    /**
     * Sets the target node. 
     * PRECONDITION: The target must not be the link itself.
     */
    public setTargetNode(target: Node): void {
        // PRECONDITION: Target must not be the link itself
        if (target === this) {
            throw new IllegalArgumentException("A Link cannot target itself.");
        }
        
        this.targetNode = target;
    }

    // --- Delegated Methods (Rely on ensureTargetNode contract) ---

    public getBaseName(): string {
        // Enforce the contract: The target must exist.
        const target = this.ensureTargetNode(); 
        return target.getBaseName();
    }

    public rename(bn: string): void {
        // Enforce the contract: The target must exist.
        const target = this.ensureTargetNode(); 
        target.rename(bn);
    }

    // NOTE: move(), getFullName(), findNodes() must also be implemented 
    // to call ensureTargetNode() before delegating to the target's method.

    /**
     * Ensures that targetNode is not null and throws an InvalidStateException if the link is broken.
     * This ensures the integrity of the object's state (Class Invariant).
     */
    protected ensureTargetNode(): Node {
        if (this.targetNode === null) {
            // CONTRACT VIOLATION (B05): Target is NULL (Broken State)
            throw new InvalidStateException("The Link does not point to a valid target node (link is broken)."); 
        }
        
        // Target is guaranteed not to be null here.
        return this.targetNode;
    }
}