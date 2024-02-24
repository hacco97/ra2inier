import { UniqueObject } from "../entity/Obejct";
import { Scope } from "../entity/Scope";
import { PackageRo } from "./PackageRo";
import { ToDto } from "./index";


export class ScopeRo extends Scope implements ToDto {
   declare package:string

   toDto() {
      return {
         ...this,
         package: undefined
      }
   }
}


export class ScopeCore extends UniqueObject { }
