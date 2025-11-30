import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    // Store components as an array internally, parsed from the source string.
    protected components: string[] = [];

    constructor(source: string, delimiter: string = DEFAULT_DELIMITER) {
        // IMPORTANT: Call super with the delimiter argument
        super(delimiter); 
        
        // --- String Parsing Logic (Required to handle the escape character) ---
        let currentPart = '';
        let isEscaped = false;
        this.components = [];

        for (let i = 0; i < source.length; i++) {
            const char = source[i];

            if (char === ESCAPE_CHARACTER && !isEscaped) {
                isEscaped = true;
                continue; 
            }

            if (char === this.delimiter && !isEscaped) {
                this.components.push(currentPart);
                currentPart = '';
            } else {
                currentPart += char;
                isEscaped = false;
            }
        }
        
        this.components.push(currentPart);
    }

    // --- Abstract Method Implementations (Primitives) ---

    public clone(): Name {
        // Creates a new instance using a copy of the components array.
        const newComponents = this.components.slice(); 
        return new StringName(newComponents.join(this.delimiter), this.getDelimiterCharacter());
    }

    public asDataString(): string {
        // Escaping logic is required here for the machine-readable string.
        const escapedComponents = this.components.map(component => {
            // 1. Escape the escape character itself
            let escaped = component.split(ESCAPE_CHARACTER).join(ESCAPE_CHARACTER + ESCAPE_CHARACTER);
            
            // 2. Escape the default delimiter character
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

    // --- Private Assertion Methods (Assumed helper methods) ---

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

    // Note: getDelimiterCharacter, isEmpty, isEqual, getHashCode, toString, asString, and concat 
    // are inherited from AbstractName and are now functional because the abstract methods are implemented.
}