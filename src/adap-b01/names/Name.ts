export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * * Homogenous name examples
 * * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    protected noComponents: number = 0;
    private components: string[] = [];

    /** Expects that all Name components are properly masked */
    constructor(source: string[], delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
        
        // Copy the source array to the internal components array
        this.components = [...source]; 

        this.noComponents = this.components.length;
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set control characters
     * Control characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    public asString(delimiter: string = this.delimiter): string {
        // Simple join of components using the specified delimiter.
        return this.components.join(delimiter);
    }
    
    /** * Returns a machine-readable representation of Name instance using default control characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The control characters in the data string are the default characters
     */
    public asDataString(): string {
        // This method must escape the default delimiter and the escape character itself 
        // within each component before joining.
        
        const escapedComponents = this.components.map(component => {
            // 1. Escape the escape character itself (\ -> \\)
            let escaped = component.split(ESCAPE_CHARACTER).join(ESCAPE_CHARACTER + ESCAPE_CHARACTER);
            
            // 2. Escape the default delimiter character (. -> \.)
            escaped = escaped.split(DEFAULT_DELIMITER).join(ESCAPE_CHARACTER + DEFAULT_DELIMITER);
            
            return escaped;
        });

        // Join the escaped components using the default delimiter.
        return escapedComponents.join(DEFAULT_DELIMITER);
    }

    public getComponent(i: number): string {
        if (i < 0 || i >= this.noComponents) {
            throw new Error(`Index ${i} is out of bounds.`);
        }
        return this.components[i];
    }

    /** Expects that new Name component c is properly masked */
    public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.noComponents) {
            throw new Error(`Index ${i} is out of bounds for setting component.`);
        }
        this.components[i] = c;
    }

    /** Returns number of components in Name instance */
    public getNoComponents(): number {
        return this.noComponents;
    }

    /** Expects that new Name component c is properly masked */
    public insert(n: number, c: string): void {
        // Insert component 'c' at index 'n' (splice(index, deleteCount, items...))
        this.components.splice(n, 0, c);
        this.noComponents = this.components.length;
    }

    /** Expects that new Name component c is properly masked */
    public append(c: string): void {
        // Append component 'c' to the end of the internal array.
        this.components.push(c);
        // Update the component count.
        this.noComponents = this.components.length;
    }
    
    public remove(i: number): void {
        // Remove 1 element starting from index 'i'
        if (i < 0 || i >= this.noComponents) {
            throw new Error(`Index ${i} is out of bounds for removal.`);
        }
        this.components.splice(i, 1);
        this.noComponents = this.components.length;
    }

    // You may also need the concat method if it's part of the Name interface:
    /*
    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.components.push(other.getComponent(i));
        }
        this.noComponents = this.components.length;
    }
    */
}