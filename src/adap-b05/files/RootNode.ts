import { Name } from "../names/Name";
import { StringName } from "../names/StringName";
import { Directory } from "./Directory";
import { Node } from "./Node";

export class RootNode extends Directory {

    protected static ROOT_NODE: RootNode = new RootNode();

    public static getRootNode() {
        return this.ROOT_NODE;
    }

    constructor() {
        super("", new Object as Directory);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = this;
    }

    public getFullName(): Name {
        return new StringName("", '/');
    }

    public move(to: Directory): void {
        // null operation
    }

    protected doSetBaseName(bn: string): void {
        // null operation
    }

    protected doFindNodes(bn: string): Set<Node> {
        // RootNode has empty basename by design, skip validation
        const result: Set<Node> = new Set<Node>();

        // Recursively search through all child nodes
        for (const child of this.childNodes) {
            const childResults = child.findNodes(bn);
            childResults.forEach(node => result.add(node));
        }

        return result;
    }

}