import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";


export class StringArrayName extends AbstractName {

    protected readonly components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);

        // Precondition: Source must not be null and must be an array
        IllegalArgumentException.assert(source != null, "Source cannot be null");
        IllegalArgumentException.assert(Array.isArray(source), "Source must be an array");

        // Use slice() for a shallow copy, ensuring immutability
        this.components = source.slice(); 
    }

    // --- Protected Helpers for Immutability and DbC ---

    /** Creates a shallow copy of the components array. */
    protected getNewComponents(): string[] {
        return this.components.slice();
    }
    
    /** Asserts that the index i is a valid index for retrieval or setting. */
    protected assertIndexInBounds(i: number, allowEnd: boolean = false): void {
        const maxIndex = allowEnd ? this.components.length : this.components.length - 1;
        
        // If allowEnd is true, index can be equal to components.length (for insert/append)
        const errorMessage = allowEnd 
            ? "Index out of bounds (must be between 0 and length)"
            : "Index out of bounds (must be between 0 and length - 1)";
            
        IllegalArgumentException.assert(i >= 0 && i <= maxIndex, errorMessage);
    }
    
    // --- Name Interface Implementations ---

    public clone(): Name {
        const clone = new StringArrayName(this.components, this.delimiter);
        // Postcondition: Clone must be equal to original (checking deep equality via isEqual)
        MethodFailedException.assert(this.isEqual(clone), "Clone must be equal to original");
        return clone;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        // Precondition: Index must be within bounds (not allowing length)
        this.assertIndexInBounds(i, false); 

        const comp = this.components[i];

        // Postcondition: The result must not be undefined (Array.isArray ensures this, but kept for robustness)
        MethodFailedException.assert(comp != undefined, "Retrieved component is undefined");

        return comp;
    }

    public setComponent(i: number, c: string): Name {
        this.assertIndexInBounds(i, false); // Precondition: Index must be within bounds
        IllegalArgumentException.assert(c != null, "Component cannot be null"); // Precondition: Component must not be null

        const newComponents = this.getNewComponents(); // Get a fresh copy
        newComponents[i] = c;

        const result = new StringArrayName(newComponents, this.delimiter);
        // Postcondition: The component at the index must match the new value
        MethodFailedException.assert(result.getComponent(i) === c, "Set component failed: Value mismatch");
        return result;
    }

    public insert(i: number, c: string): Name {
        // Precondition: Index can be equal to length (inserting at the end)
        this.assertIndexInBounds(i, true); 
        IllegalArgumentException.assert(c != null, "Component cannot be null");

        const oldLength = this.components.length;
        const newComponents = this.getNewComponents();
        
        // Array.splice(start, deleteCount, item1, item2, ...)
        newComponents.splice(i, 0, c); 

        const result = new StringArrayName(newComponents, this.delimiter);
        // Postcondition: Length must increase by 1
        MethodFailedException.assert(result.getNoComponents() === oldLength + 1, "Insert failed to increase length");
        return result;
    }

    public append(c: string): Name {
        // Append is essentially inserting at the end of the current array.
        // Delegating to insert() reduces code duplication.
        
        // Preconditions for insert() cover index and component null check.
        const i = this.components.length;
        const result = this.insert(i, c); 
        
        // Postcondition is already checked in insert(), but we check length again for safety.
        MethodFailedException.assert(result.getNoComponents() === this.components.length + 1, "Append failed to increase length (postcondition error)");
        
        return result;
    }

    public remove(i: number): Name {
        // Precondition: Index must be within bounds (not allowing length)
        this.assertIndexInBounds(i, false); 

        const oldLength = this.components.length;
        const newComponents = this.getNewComponents();
        
        // Array.splice(start, deleteCount)
        newComponents.splice(i, 1); 

        const result = new StringArrayName(newComponents, this.delimiter);
        // Postcondition: Length must decrease by 1
        MethodFailedException.assert(result.getNoComponents() === oldLength - 1, "Remove failed to decrease length");
        return result;
    }
}