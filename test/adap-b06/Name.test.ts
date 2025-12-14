import { describe, it, expect } from "vitest";

import { StringName } from "../.././src/adap-b06/names/StringName";
import { StringArrayName } from "../.././src/adap-b06/names/StringArrayName";
import { Name } from "../.././src/adap-b06/names/Name";
import { IllegalArgumentException } from "../.././src/adap-b06/common/IllegalArgumentException";
import { DEFAULT_DELIMITER } from "../.././src/adap-b06/common/Printable";

// Helper function to create StringName from components array
const createStringName = (components: string[], delimiter: string = DEFAULT_DELIMITER): StringName =>
    new StringName(components.join(delimiter), delimiter);

// Helper function to create StringArrayName from components array
const createStringArrayName = (components: string[], delimiter: string = DEFAULT_DELIMITER): StringArrayName =>
    new StringArrayName(components, delimiter);

describe("Homework B06: Name Value Objects Tests", () => {

    const TestSets: { name: string, creator: (c: string[], d?: string) => Name }[] = [
        { name: "StringName Implementation", creator: createStringName },
        { name: "StringArrayName Implementation", creator: createStringArrayName }
    ];

    TestSets.forEach(({ name, creator }) => {
        describe(`Functionality & Immutability: ${name}`, () => {

            // --- MUTATOR FUNCTIONALITY & IMMUTABILITY TESTS ---

            it("should return a NEW object on 'append' and preserve the original", () => {
                const n1 = creator(["base"]);
                const n2 = n1.append("end");

                expect(n1.asString()).toBe("base");
                expect(n2.asString()).toBe("base.end");
                expect(n1).not.toBe(n2);
            });

            it("should return a NEW object on 'insert' and preserve the original", () => {
                const n1 = creator(["a", "c"]);
                const n2 = n1.insert(1, "b");

                expect(n1.asString()).toBe("a.c");
                expect(n2.asString()).toBe("a.b.c");
            });

            it("should return a NEW object on 'remove' and preserve the original", () => {
                const n1 = creator(["x", "y", "z"]);
                const n2 = n1.remove(1); // removes 'y'

                expect(n1.asString()).toBe("x.y.z");
                expect(n2.asString()).toBe("x.z");
            });

            it("should return a NEW object on 'setComponent' and preserve the original", () => {
                const n1 = creator(["v1", "v2"]);
                const n2 = n1.setComponent(0, "new_v1");

                expect(n1.asString()).toBe("v1.v2");
                expect(n2.asString()).toBe("new_v1.v2");
                expect(n1).not.toBe(n2);
            });
            
            it("should NOT modify the original object on concat (Immutability check)", () => {
                const n1 = creator(["one"]);
                const n2 = creator(["two"]);
                const n3 = n1.concat(n2);

                expect(n1.asString()).toBe("one");
                expect(n3.asString()).toBe("one.two");
                expect(n1).not.toBe(n3);
            });

            // --- EQUALITY & HASHCODE TESTS ---
            
            it("should return true for isEqual if contents are value-identical", () => {
                const n1 = creator(["cmp", "test"]);
                const n2 = creator(["cmp", "test"]);
                expect(n1.isEqual(n2)).toBe(true);
            });

            it("should return same HashCode for value-identical objects", () => {
                const n1 = creator(["hash", "check"]);
                const n2 = creator(["hash", "check"]);
                expect(n1.getHashCode()).toBe(n2.getHashCode());
            });

            // --- EMPTY STATE LOGIC ---
            
            it("should correctly handle 'Empty String' (1 component) versus 'True Empty' (0 components)", () => {
                // 1. Instantiation with empty string -> 1 Component (Empty)
                const n1 = creator([""]);
                expect(n1.getNoComponents()).toBe(1);
                expect(n1.isEmpty()).toBe(false);

                // 2. Remove that component -> 0 Components (True Empty)
                const n2 = n1.remove(0);
                expect(n2.getNoComponents()).toBe(0);
                expect(n2.isEmpty()).toBe(true);

                // 3. Append to the true empty object should result in 1 component
                const n3 = n2.append("first");
                expect(n3.getNoComponents()).toBe(1);
                expect(n3.asString()).toBe("first");
            });
            
            it("should chain operations correctly (integration test)", () => {
                const initial = creator(["a"]);
                const result = initial
                    .append("b")
                    .insert(0, "start")
                    .remove(2); 

                expect(result.asString()).toBe("start.a"); // Initial: start.a.b -> Remove b (index 2) -> start.a
            });
        });
    });

    // =========================================================
    // Interoperability Tests (Mixing StringName and StringArrayName)
    // =========================================================
    describe("Cross-Type Interoperability", () => {
        it("should treat StringName and StringArrayName as equal if content matches", () => {
            const sn = new StringName("x.y");
            const san = new StringArrayName(["x", "y"]);

            expect(sn.isEqual(san)).toBe(true);
            expect(san.isEqual(sn)).toBe(true);
            expect(sn.getHashCode()).toBe(san.getHashCode());
        });

        it("should allow concatenation of mixed Name types", () => {
            const sn = new StringName("component1");
            const san = new StringArrayName(["component2"]);

            const result1 = sn.concat(san);
            expect(result1.asString()).toBe("component1.component2");

            const result2 = san.concat(sn); 
            expect(result2.asString()).toBe("component2.component1");
        });
    });

    // =========================================================
    // Design by Contract (Preconditions)
    // =========================================================
    describe("Design by Contract (Preconditions)", () => {
        const n = createStringName(["c1", "c2"]); // Use one factory for simplicity

        it("should throw IllegalArgumentException on invalid component indices", () => {
            expect(() => n.getComponent(-1)).toThrow(IllegalArgumentException);
            expect(() => n.getComponent(5)).toThrow(IllegalArgumentException);
            expect(() => n.remove(5)).toThrow(IllegalArgumentException);
            expect(() => n.insert(5, "c")).toThrow(IllegalArgumentException); 
        });

        it("should throw IllegalArgumentException on null/undefined arguments to mutators", () => {
            // @ts-ignore
            expect(() => n.append(null)).toThrow(IllegalArgumentException);
            // @ts-ignore
            expect(() => n.concat(null)).toThrow(IllegalArgumentException);
        });

        it("should throw IllegalArgumentException for invalid delimiter definitions", () => {
            expect(() => new StringName("a", "")).toThrow(IllegalArgumentException);
            expect(() => new StringName("a", "long")).toThrow(IllegalArgumentException);
            expect(() => new StringName("a", "\\")).toThrow(IllegalArgumentException); 
        });
    });
    
    // =========================================================
    // Deep Clone Test
    // =========================================================
    describe("Deep Cloning (Independent State)", () => {
        it("should create a true deep clone that is equal but not the same object", () => {
            const n1 = createStringName(["base", "clone"]);
            const n2 = n1.clone();

            expect(n1.isEqual(n2)).toBe(true);
            expect(n1).not.toBe(n2);

            // Verify independent lifecycle
            const n3 = n1.append("extension");
            expect(n2.getNoComponents()).toBe(2); 
            expect(n3.getNoComponents()).toBe(3);
        });
    });
});