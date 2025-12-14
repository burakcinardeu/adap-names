import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import {IllegalArgumentException} from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";


export abstract class AbstractName implements Name {

    protected readonly delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.assertIsValidDelimiter(delimiter); // precondition

        this.delimiter = delimiter;
    }

    protected assertIsValidDelimiter(delimiter: string): void {
        IllegalArgumentException.assert(delimiter.length == 1, "Delimiter must be a single character");
        IllegalArgumentException.assert(delimiter != ESCAPE_CHARACTER, "Delimiter cannot be the escape character");
    }


    public abstract clone(): Name;

    public asString(delimiter: string = this.delimiter): string {
        this.assertIsValidDelimiter(delimiter); // precondition

        const humanReadableComponents: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            let component = this.getComponent(i);
            component = component
                // Unmask the delimiter (e.g., replace '\/' with '/')
                .replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter)
                // Unmask the escape character (e.g., replace '\\' with '\')
                .replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER);
            humanReadableComponents.push(component);
        }
        return humanReadableComponents.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            let comp = this.getComponent(i);

            // This section seems to contain logical redundancy, but we preserve the original behavior.
            let rawComp = comp.replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter)
                .replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER);

            let maskedForDefault = "";
            for (const char of rawComp) {
                if (char === DEFAULT_DELIMITER || char === ESCAPE_CHARACTER) {
                    // Escape the delimiter or escape character itself
                    maskedForDefault += ESCAPE_CHARACTER;
                }
                maskedForDefault += char;
            }

            components.push(maskedForDefault);
        }
        return components.join(DEFAULT_DELIMITER);
    }

    public isEqual(other: Name): boolean {
        if (!other) { 
            return false;
        }
        // Basic check for required methods to avoid runtime errors
        if (typeof (other as any).getNoComponents !== 'function' ||
            typeof (other as any).getDelimiterCharacter !== 'function') {
            return false;
        }

        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }

        if (this.getDelimiterCharacter() !== other.getDelimiterCharacter()) {
            return false;
        }
        // Compare components element by element
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        return true;
    }

    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.asDataString();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            // Standard hash code calculation
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0; // Convert to 32bit integer
        }
        return hashCode;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): Name;

    abstract insert(i: number, c: string): Name;
    abstract append(c: string): Name;
    abstract remove(i: number): Name;

    public concat(other: Name): Name {
        // Precondition: can not be null
        IllegalArgumentException.assert(other != null, "Cannot concatenate null");

        const oldLength = this.getNoComponents();
        const otherLength = other.getNoComponents();

        let result: Name = this;
        for (let i = 0; i < other.getNoComponents(); i++) {
            result = result.append(other.getComponent(i));
        }

        // Postcondition: correct change of length?
        MethodFailedException.assert(result.getNoComponents() === oldLength + otherLength,
            "Concat failed: Length did not increase correctly"
        );

        return result;
    }

}