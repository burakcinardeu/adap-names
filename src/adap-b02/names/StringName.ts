import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

/**
 * StringName parses a source string into components based on a delimiter,
 * while respecting the escape character. It implements the base Name interface.
 */
export class StringName implements Name {

    // Internal Class Properties
    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;
    protected components: string[] = []; // Stores the parsed components

    /**
     * Constructor parses the source string into components, handling the escape character.
     */
    constructor(source: string, delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
        
        // String Parsing Logic
        let currentPart = '';
        let isEscaped = false;
        this.components = [];

        for (let i = 0; i < source.length; i++) {
            const char = source[i];

            if (char === ESCAPE_CHARACTER && !isEscaped) {
                // Case 1: Escape character encountered, enter escape mode.
                isEscaped = true;
                continue; // Do not append the backslash to the current component.
            }

            if (char === this.delimiter && !isEscaped) {
                // Case 2: Delimiter encountered and not in escape mode -> Finalize current part.
                this.components.push(currentPart);
                currentPart = '';
            } else {
                // Case 3: Normal character or character immediately following an escape.
                currentPart += char;
                isEscaped = false; // Exit escape mode (if we were in it).
            }
        }
        
        // Add the final remaining part after the loop finishes.
        this.components.push(currentPart);

        // Update properties
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

    // --- Manipulation Methods ---

    public setComponent(n: number, c: string): void {
        if (n < 0 || n >= this.noComponents) {
            throw new Error(`Index ${n} is out of bounds for setting component.`);
        }
        this.components[n] = c;
    }

    public insert(n: number, c: string): void {
        // Insert component 'c' at index 'n' (splice(index, deleteCount, items...))
        this.components.splice(n, 0, c);
        this.noComponents = this.components.length;
    }

    public append(c: string): void {
        // Append component 'c' to the end of the array
        this.components.push(c);
        this.noComponents = this.components.length;
    }

    public remove(n: number): void {
        // Remove 1 element starting from index 'n'
        if (n < 0 || n >= this.noComponents) {
            throw new Error(`Index ${n} is out of bounds for removal.`);
        }
        this.components.splice(n, 1);
        this.noComponents = this.components.length;
    }

    // --- String Conversion Methods ---

    public asString(delimiter: string = this.delimiter): string {
        // Simple join of components using the specified delimiter.
        return this.components.join(delimiter);
    }

    public asDataString(): string {
        // This method must escape delimiters and escape characters within components.
        
        const escapedComponents = this.components.map(component => {
            // 1. Escape the escape character itself (e.g., \ -> \\)
            let escaped = component.split(ESCAPE_CHARACTER).join(ESCAPE_CHARACTER + ESCAPE_CHARACTER);
            
            // 2. Escape the delimiter character (e.g., . -> \.)
            escaped = escaped.split(this.delimiter).join(ESCAPE_CHARACTER + this.delimiter);
            
            return escaped;
        });

        // Join the escaped components using the unescaped delimiter.
        return escapedComponents.join(this.delimiter);
    }

    // --- Concatenation Method ---

    public concat(other: Name): void {
        // Append all components from the 'other' Name object to the current object.
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.components.push(other.getComponent(i));
        }
        this.noComponents = this.components.length;
    }
}