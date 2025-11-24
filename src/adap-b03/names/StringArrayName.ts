import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    /**
     * Constructor implementation: Calls super and initializes components.
     * Note: We use the spread operator for a clean shallow copy, which is equivalent to the original direct assignment.
     */
    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        // Using the spread operator for simple assignment (or just 'this.components = source;' for direct reference)
        this.components = [...source]; 
    }

    /**
     * Cloning method: Creates a deep clone of the components array and returns a new StringArrayName instance.
     * Logic is functionally identical to the original loop but uses the map method.
     */
    public clone(): Name {
        // Use map to create a new array (deep copy of string elements is automatic).
        const clonedComponents: string[] = this.components.map(component => component);
        
        return new StringArrayName(clonedComponents, this.delimiter);
    }

    /**
     * Machine-readable string representation for StringArrayName.
     * Logic: Simply joins the components with the DEFAULT_DELIMITER. No escaping is performed here, 
     * as components are assumed to be prepared by the constructor/mutators.
     */
    public asDataString(): string {
        // Use the join method for a cleaner, efficient concatenation.
        return this.components.join(DEFAULT_DELIMITER);
    }

    // --- Component Access Methods ---

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertValidIndex(i);
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        this.assertValidIndex(i);
        this.components[i] = c;
    }

    // --- Mutation Methods ---

    /**
     * Inserts a new component at a specific index.
     * Logic: Uses the native JavaScript/TypeScript splice method (efficient and concise).
     */
    public insert(i: number, c: string) {
        this.assertValidIndexLax(i);
        // Use splice(index, deleteCount, element) for direct manipulation.
        this.components.splice(i, 0, c);
    }

    public append(c: string) {
        this.components.push(c);
    }

    /**
     * Removes a component at a specific index.
     * Logic: Uses the native JavaScript/TypeScript splice method.
     */
    public remove(i: number) {
        this.assertValidIndex(i);
        // Use splice(index, deleteCount) to remove the element.
        this.components.splice(i, 1);
    }

    // --- Assertion Methods ---
    
    /**
     * Asserts that the index is within the valid range [0, count]. Allows inserting at the end.
     */
    private assertValidIndexLax(i: number): void {
        if (i > this.components.length || i < 0) {
            throw new Error("index out of range");
        }
    }
    
    /**
     * Asserts that the index is within the valid range [0, count - 1]. Does NOT allow inserting at the end.
     */
    private assertValidIndex(i: number): void {
        if (i >= this.components.length || i < 0) {
            throw new Error("index out of range");
        }
    }
}