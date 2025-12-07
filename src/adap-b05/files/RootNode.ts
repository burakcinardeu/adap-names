// --- RootNode.ts ---

import { Name } from "../names/Name";
import { StringName } from "../names/StringName";
import { Directory } from "./Directory";

export class RootNode extends Directory {

    protected static ROOT_NODE: RootNode = new RootNode();

    public static getRootNode(): RootNode {
        return this.ROOT_NODE;
    }

    protected constructor() {
        // Hata Çözümü: Node'a geçici olarak geçerli bir ad ("ROOT_TEMP") gönderiyoruz.
        // pn için null gönderilebilir, çünkü Node'un constructor'ı pn'yi assertIsNotNullOrUndefined ile kontrol eder.
        super("ROOT_TEMP", null as any); 
    }

    protected initialize(pn: any): void { 
        // 1. BaseName'i boş dizeye sıfırla (Kök kuralı).
        this.baseName = ""; 
        
        // 2. Parent'ı kendine set et.
        this.parentNode = this as Directory; 
        
        // Node.ts'deki addChildNode çağrısı atlanmıştır.
    }
    
    // HOOK OVERRIDE: RootNode için basename kontratını gevşetir (boş dizeye izin verir).
    protected assertBaseNameValidAsPrecondition(bn: string) {
        // Yalnızca null/undefined kontrolünü korur. Boş dize kontrolü atlanır.
        this.assertIsNotNullOrUndefined(bn);
    }

    // INVARIANT OVERRIDE: RootNode'un Invariant'ını gevşetir.
    protected assertClassInvariants() {
        // RootNode'un Invariant'ı: Sadece null kontrolü yapılır.
        this.assertIsNotNullOrUndefined(this.baseName, ExceptionType.InvalidState); 
    }

    // ... (Diğer metotlar aynı kalır)
}