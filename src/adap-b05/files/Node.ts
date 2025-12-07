// --- Node.ts ---

import { Exception } from "../common/Exception";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { ServiceFailureException } from "../common/ServiceFailureException";

import { Name } from "../names/Name";
// import { Directory } from "./Directory"; // <-- CRITICAL FIX: DÖNGÜ KIRILDI

enum ExceptionType {
    IllegalArgument,
    InvalidState,
}

export class Node {

    protected baseName: string = "";
    protected parentNode: any; 

    constructor(bn: string, pn: any) { 
        // 1. BaseName Kontrolü (Hook kullanılır)
        this.assertIsNotNullOrUndefined(bn);
        this.assertBaseNameValidAsPrecondition(bn); 
        this.baseName = bn;
        
        // 2. ParentNode Kontrolü
        this.assertIsNotNullOrUndefined(pn); // Hata 3'ü engeller: pn'nin null/undefined olup olmadığı kontrol edilir
        this.parentNode = pn; 
        
        // 3. Initialize
        this.initialize(pn); 
    }

    protected initialize(pn: any): void { 
        // RootNode'un override edeceği basitleştirilmiş mantık.
        if (this.parentNode && this.parentNode.addChildNode) {
            this.parentNode.addChildNode(this); 
        }
    }
    
    // --- DbC Assertion Helpers ---

    protected dispatchException(m: string, et: ExceptionType = ExceptionType.IllegalArgument) {
        switch (et) {
            case ExceptionType.IllegalArgument:
                throw new IllegalArgumentException(m);
            case ExceptionType.InvalidState:
                throw new InvalidStateException(m);
            default:
                throw new IllegalArgumentException("unknown exception type encountered while dispatching exception with message: " + m);
        }
    }

    protected assertIsNotNullOrUndefined(o: any, et: ExceptionType = ExceptionType.IllegalArgument) {
        // Hata 3'ü çözmek için: Sadece null veya undefined ise hata fırlatılır.
        if (o === undefined || o === null) {
            this.dispatchException("passed undefined or null as argument", et);
        }
    }

    // HOOK IMPLEMENTATION: Default is the strict check
    protected assertBaseNameValidAsPrecondition(bn: string) {
        this.assertIsValidBaseName(bn);
    }
    
    // STRICT CHECK (Used by default and Class Invariant)
    protected assertIsValidBaseName(bn: string, et: ExceptionType = ExceptionType.IllegalArgument) {
        this.assertIsNotNullOrUndefined(bn);
        if (typeof bn !== 'string' || bn.trim() === "") { 
            this.dispatchException("Base name cannot be null or empty.", et);
        }
    }

    protected assertClassInvariants() {
        this.assertIsValidBaseName(this.baseName, ExceptionType.InvalidState); 
    }
    
    // ... (Diğer tüm metotlar aynı kalır)
}