import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    // Store components as an array internally, parsed from the source string.
    // This simplifies all abstract method implementations and correctly handles escaping.
    protected components: string[] = [];

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        
        // --- String Parsing Logic (Required for Name implementation) ---
        let currentPart = '';
        let isEscaped = false;
        this.components = [];

        for (let i = 0; i < source.length; i++) {
            const char = source[i];

            if (char === ESCAPE_CHARACTER && !isEscaped) {
                // Found unescaped '\', enter escape mode.
                isEscaped = true;
                continue; 
            }

            if (char === this.delimiter && !isEscaped) {
                // Found unescaped delimiter, push part and reset.
                this.components.push(currentPart);
                currentPart = '';
            } else {
                // Normal character or escaped character.
                currentPart += char;
                isEscaped = false; // Exit escape mode (if we were in it).
            }
        }
        
        // Add the final remaining part.
        this.components.push(currentPart);
    }

    // --- Abstract Method Implementations ---

    public clone(): Name {
        // Creates a new instance using a copy of the components array.
        const newComponents = this.components.slice(); 
        return new StringName(newComponents.join(this.delimiter), this.getDelimiterCharacter());
    }

    public asDataString(): string {
        // Delegates the difficult part (escaping) to the AbstractName's common logic, 
        // which uses getComponent(). We just need to join them after AbstractName handles escaping.
        // NOTE: If AbstractName does not have an asDataString implementation that handles escaping,
        // you must use the B01/B02 escaping logic here. 
        // Based on the B01 solution:
        const escapedComponents = this.components.map(component => {
            let escaped = component.split(ESCAPE_CHARACTER).join(ESCAPE_CHARACTER + ESCAPE_CHARACTER);
            escaped = escaped.split(DEFAULT_DELIMITER).join(ESCAPE_CHARACTER + DEFAULT_DELIMITER);
            return escaped;
        });

        return escapedComponents.join(DEFAULT_DELIMITER);
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertValidIndex(i);
        // Returns the component directly from the array.
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        this.assertValidIndex(i);
        this.components[i] = c;
    }

    public insert(i: number, c: string) {
        this.assertValidIndexLax(i);
        this.components.splice(i, 0, c);
    }

    public append(c: string) {
        this.components.push(c);
    }

    public remove(i: number) {
        this.assertValidIndex(i);
        this.components.splice(i, 1);
    }

    // --- Private Assertion Methods (Simplified) ---

    private assertValidIndex(i: number): void {
        if (i >= this.getNoComponents() || i < 0) {
            throw new Error("index out of range");
        }
    }

    private assertValidIndexLax(i: number): void {
        if (i > this.getNoComponents() || i < 0) {
            throw new Error("index out of range");
        }
    }
}