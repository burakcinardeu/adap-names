import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringName extends AbstractName {

    protected readonly name: string = "";
    protected readonly noComponents: number = 0;

    /**
     * @param source The string representation of the name (expected to be properly masked).
     * @param delimiter The delimiter character
     * @param noComponents Optional: Explicitly sets the number of components.
     * This is required for internal immutable operations (like remove),
     * to correctly handle the edge case where the name string is "" but the component count should be 0.
     */
    constructor(source: string, delimiter?: string, noComponents?: number) {
        super(delimiter);

        // Precondition for source
        IllegalArgumentException.assert(source != null, "Source cannot be null");

        this.name = source;

        if (noComponents !== undefined) {
            // Internal use: Trusted caller defines the component count.
            // This is essential for maintaining the difference between
            // 0 components (e.g., after remove) and 1 empty component (default "" parsing).
            this.noComponents = noComponents;
        } else {
            // Public use: Default parsing logic.
            // Based on forum rules, "" implies [""] (1 component).
            this.noComponents = this.splitStringInComponents(source).length;
        }
    }

    // --- Protected Helpers for DbC and Logic ---

    /** Asserts that the index i is a valid index for retrieval or setting. */
    protected assertIndexInBounds(i: number, allowEnd: boolean = false): void {
        const maxIndex = allowEnd ? this.noComponents : this.noComponents - 1;
        
        const errorMessage = allowEnd 
            ? "Index out of bounds (must be between 0 and length)"
            : "Index out of bounds (must be between 0 and length - 1)";
            
        IllegalArgumentException.assert(i >= 0 && i <= maxIndex, errorMessage);
    }
    
    /**
     * Splits the internal name string into component strings using the delimiter, respecting escape characters.
     * Edge case: According to the forum, "" must be parsed as [""] (1 component).
     * @param source The string to split (this.name).
     */
    private splitStringInComponents(source: string): string[] {
        // Based on forum rules: "" is 1 empty component. Do NOT return [] here!
        if (source === "") {
            return [""];
        }

        const components: string[] = [];
        let current = "";
        let isEscaped = false;

        for (const ch of source) {
            if (isEscaped) {
                // The character following the escape character is taken literally.
                current += ESCAPE_CHARACTER + ch; 
                isEscaped = false;
            } else if (ch === ESCAPE_CHARACTER) {
                isEscaped = true;
            } else if (ch === this.delimiter) {
                components.push(current);
                current = "";
            } else {
                current += ch;
            }
        }

        components.push(current); // Push the last component
        return components;
    }

    // --- Name Interface Implementations ---

    public clone(): Name {
        // The clone must use the explicit noComponents count to maintain the edge case state (0 components vs 1 empty component).
        const clone = new StringName(this.name, this.delimiter, this.noComponents);
        // Postcondition: Clone must be equal to original (checking deep equality via isEqual)
        MethodFailedException.assert(this.isEqual(clone), "Clone must be equal to original");
        return clone;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        // Precondition: Index must be within bounds (not allowing length)
        this.assertIndexInBounds(i, false);
        
        // Re-parsing the string is inefficient but required by the design of StringName.
        const result = this.splitStringInComponents(this.name)[i];

        // Postcondition
        MethodFailedException.assert(result !== undefined, "Component retrieval failed");

        return result;
    }

    public setComponent(i: number, c: string): Name {
        this.assertIndexInBounds(i, false); // Precondition: Index within bounds
        IllegalArgumentException.assert(c != null, "Component cannot be null"); // Precondition: Component cannot be null

        const components = this.splitStringInComponents(this.name);
        components[i] = c;
        
        // Return a new instance. noComponents is calculated automatically in the public constructor.
        return new StringName(components.join(this.delimiter), this.delimiter);
    }

    public insert(i: number, c: string): Name {
        // Precondition: Index can be equal to noComponents (inserting at the end)
        this.assertIndexInBounds(i, true); 
        IllegalArgumentException.assert(c != null, "Component cannot be null");

        const oldLength = this.noComponents; 
        const components = this.splitStringInComponents(this.name);

        if (this.noComponents === 0) {
            // SPECIAL EDGE CASE HANDLING (as defined in the original code logic):
            // If this.noComponents is 0, splitStringInComponents(this.name) returned [""] (1 element).
            // To insert 'c' and result in only 1 component, the existing [""] must be overwritten by 'c'.
            // If we simply splice (i, 0, c), we'd get ["c", ""] which yields "c.", which is wrong.
            
            // Overwrite the single empty component that splitStringInComponents falsely generated.
            components.splice(i, 1, c); 
        } else {
            // Normal insert operation
            components.splice(i, 0, c);
        }

        const result = new StringName(components.join(this.delimiter), this.delimiter);
        
        // Postcondition: length must be larger by 1
        MethodFailedException.assert(result.getNoComponents() === oldLength + 1, "Insert failed to increase length");
        return result;
    }

    public append(c: string): Name {
        // Delegate to the insert method at the end of the array to reduce code duplication.
        return this.insert(this.noComponents, c);
    }
    
    public remove(i: number): Name {
        // Precondition: Index must be within bounds (not allowing length)
        this.assertIndexInBounds(i, false); 

        const oldLength = this.noComponents;

        const components = this.splitStringInComponents(this.name);
        components.splice(i, 1);

        // CRITICAL: When removing, we must explicitly pass the new component length to the constructor,
        // otherwise, if the result is "", the public constructor will assume 1 component ([””]).
        const result = new StringName(components.join(this.delimiter), this.delimiter, components.length);
        
        // Postcondition: length must decrease by 1
        MethodFailedException.assert(result.getNoComponents() === oldLength - 1, "Remove failed to decrease length");
        return result;
    }
}