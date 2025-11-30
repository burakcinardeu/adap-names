import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

// Note: Assuming Name interface extends Equality and Cloneable
export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    /** Constructor: Sets the internal delimiter state. */
    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    /** Cloning method must be implemented by concrete subclass. */
    public abstract clone(): Name;

    /** Returns a human-readable string representation (unmasked). */
    public asString(delimiter: string = this.delimiter): string {
        let s: string = "";
        const numComponents = this.getNoComponents();
        
        for (let i = 0; i < numComponents; i++) {
            // Note: This assumes a private 'unmask' method exists in the subclass, 
            // or that unmasking logic is handled elsewhere for the final representation.
            // For AbstractName, we use the raw component and rely on the subclass to handle escaping correctly.
            s += this.getComponent(i); 
            
            // Add delimiter if it is not the last component
            if (i < numComponents - 1) {
                s += delimiter;
            }
        }
        return s;
    }

    /** Delegates to asDataString(). This is a Conversion Method. */
    public toString(): string {
        return this.asDataString();
    }

    /** Machine-readable representation must be implemented by concrete subclass. This is a Conversion Method. */
    public abstract asDataString(): string;

    /** Implements the Equality contract. Compares machine-readable representations. This is a Boolean Query Method. */
    public isEqual(other: Name): boolean {
        // Two names are equal if their machine-readable representations are the same.
        return this.asDataString() === other.asDataString();
    }

    /** Implements the HashCode contract. Calculates hash from machine-readable string. */
    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.asDataString();
        
        for (let i: number = 0; i < s.length; i++) {
            let c: number = s.charCodeAt(i);
            // Hash calculation logic
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0; // Convert to 32bit integer
        }
        return hashCode;
    }

    /** Checks if the name is empty. This is a Boolean Query Method. */
    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    /** Returns the delimiter character. This is a Getter Method. */
    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    // --- Abstract Methods (Primitives to be implemented by subclass) ---
    public abstract getNoComponents(): number;
    public abstract getComponent(i: number): string;
    public abstract setComponent(i: number, c: string): void;
    public abstract insert(i: number, c: string): void;
    public abstract append(c: string): void;
    public abstract remove(i: number): void;

    /** Appends components from another Name object. This is a Command Method. */
    public concat(other: Name): void {
        for (let i: number = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }
}

