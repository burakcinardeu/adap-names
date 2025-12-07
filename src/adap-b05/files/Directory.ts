import { Node } from "./Node";
// Hata fırlatmak için gerekli olan sınıfı varsayalım
import { IllegalArgumentException } from "../common/IllegalArgumentException"; 

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        return this.childNodes.has(cn);
    }

    /**
     * Çocuğu ekler. PRECONDITION: Düğüm zaten çocuk listesinde olmamalıdır.
     */
    public addChildNode(cn: Node): void {
        // --- ÖN KOŞUL KONTROLÜ (DbC/B05) ---
        if (this.hasChildNode(cn)) {
            // İstemci Hata Fırlatır
            throw new IllegalArgumentException("Cannot add child node: Node is already present in this directory.");
        }
        
        this.childNodes.add(cn);
    }

    /**
     * Çocuğu kaldırır. PRECONDITION: Düğüm listede mevcut olmalıdır.
     */
    public removeChildNode(cn: Node): void {
        // --- ÖN KOŞUL KONTROLÜ (DbC/B05) ---
        if (!this.hasChildNode(cn)) {
            // İstemci Hata Fırlatır
            throw new IllegalArgumentException("Cannot remove child node: Node is not a child of this directory.");
        }
        
        this.childNodes.delete(cn);
    }

    /**
     * Dizin içinde ve tüm alt dizinlerde arama yapar.
     */
    public findNodes(bn: string): Set<Node> {
        // Node'un kendi üzerindeki sonucu alır
        const result: Set<Node> = super.findNodes(bn); 
        
        // Tüm çocuk düğümlerinde (dosya veya dizin) arama yapar.
        for (const child of this.childNodes) {
            // Özyinelemeli çağrı: child'ın findNodes metodunu çağırır.
            const childMatches = child.findNodes(bn); 
            
            // Sonuçları birleştirir.
            for (const match of childMatches) {
                result.add(match);
            }
        }
        return result;
    }

}