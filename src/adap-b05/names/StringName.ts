import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected components: string[] = []; 

    /**
     * Constructor: Parses the source string into components, respecting the escape character.
     * @param source The full name string (e.g., "a\.b.c").
     * @param delimiter The delimiter character to use.
     */
    constructor(source: string, delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter); 
        
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
                isEscaped = false; // Exit escape mode.
            }
        }
        
        this.components.push(currentPart);
    }


    public clone(): Name {
        const clonedComponents = this.components.slice();
        return new StringName(clonedComponents.join(this.delimiter), this.getDelimiterCharacter());
    }

    public asDataString(): string {
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
        this.assertValidIndex(i); // PRECONDITION
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        this.assertValidIndex(i); // PRECONDITION
        this.components[i] = c;
    }

    public insert(i: number, c: string) {
        this.assertValidIndexLax(i); // PRECONDITION (allows index == count)
        this.components.splice(i, 0, c);
    }

    public append(c: string) {
        this.components.push(c);
    }

    public remove(i: number) {
        this.assertValidIndex(i); // PRECONDITION
        this.components.splice(i, 1);
    }

    
    /** PRECONDITION Helper: Asserts index is within the valid range [0, count - 1]. */
    private assertValidIndex(i: number): void {
        if (i >= this.getNoComponents() || i < 0) {
            throw new Error("IllegalArgumentException: Index out of range (i >= count or i < 0)."); 
        }
    }

    /** PRECONDITION Helper: Asserts index is within the valid range [0, count]. (Allows insertion at the end) */
    private assertValidIndexLax(i: number): void {
        if (i > this.getNoComponents() || i < 0) {
            throw new Error("IllegalArgumentException: Index out of range (i > count or i < 0).");
        }
    }

}