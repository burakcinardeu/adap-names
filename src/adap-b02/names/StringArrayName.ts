import { DEFAULT_DELIMITER } from "../common/Printable";
import { Name } from "./Name";

/**
 * StringArrayName implements the Name interface and constructs a name
 * directly from an array of strings (components), without requiring complex parsing.
 * The internal logic for manipulation is very similar to StringName.
 */
export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected noComponents: number = 0;
    protected components: string[] = []; 

    /**
     * Constructor takes an array of strings (components) directly.
     * It only needs to copy the array and set the internal state.
     */
    constructor(source: string[], delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
        
        // Copy the source array to the internal components array
        this.components = [...source]; 

        this.noComponents = this.components.length;
    }

    // --- Read (Get) Methods ---

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(x: number): string {
        if (x < 0 || x >= this.noComponents) {
            throw new Error(`Index ${x} is out of bounds.`);
        }
        return this.components[x];
    }

    // --- Manipulation Methods (Same logic as StringName, but simpler as no escaping is needed) ---

    public setComponent(n: number, c: string): void {
        if (n < 0 || n >= this.noComponents) {
            throw new Error(`Index ${n} is out of bounds for setting component.`);
        }
        this.components[n] = c;
    }

    public insert(n: number, c: string): void {
        this.components.splice(n, 0, c);
        this.noComponents = this.components.length;
    }

    public append(c: string): void {
        this.components.push(c);
        this.noComponents = this.components.length;
    }

    public remove(n: number): void {
        if (n < 0 || n >= this.noComponents) {
            throw new Error(`Index ${n} is out of bounds for removal.`);
        }
        this.components.splice(n, 1);
        this.noComponents = this.components.length;
    }

    // --- String Conversion Methods ---

    public asString(delimiter: string = this.delimiter): string {
        // Simple join of components
        return this.components.join(delimiter);
    }

    public asDataString(): string {
        // StringArrayName does not deal with internal escaping for its components, 
        // as it is constructed from already-separated strings.
        return this.components.join(this.delimiter); 
    }

    // --- Concatenation Method ---

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.components.push(other.getComponent(i));
        }
        this.noComponents = this.components.length;
    }
}