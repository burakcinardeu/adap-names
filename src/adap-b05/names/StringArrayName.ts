import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
// import { IllegalArgumentException } from "../common/IllegalArgumentException"; // Assuming B05 exception is defined

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    /**
     * Constructor: Initializes the name with a source array of components.
     * @param source The array of name components.
     * @param delimiter The delimiter character to use for conversions.
     */
    constructor(source: string[], delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter); 
        this.components = source;
    }


    public clone(): Name {
        const clonedComponents: string[] = this.components.map(component => component);
        return new StringArrayName(clonedComponents, this.delimiter);
    }


    public asDataString(): string {
        return this.components.join(DEFAULT_DELIMITER);
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertValidIndex(i); // PRECONDITION: Index must be valid
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        this.assertValidIndex(i); // PRECONDITION: Index must be valid
        this.components[i] = c;
    }

    public insert(i: number, c: string) {
        this.assertValidIndexLax(i); // PRECONDITION: Index must be valid or equal to count
        this.components.splice(i, 0, c);
    }

    public append(c: string) {
        this.components.push(c);
    }

    public remove(i: number) {
        this.assertValidIndex(i); // PRECONDITION: Index must be valid (element must exist)
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