import { ToDto } from '../dto';
import { UniqueObject } from '../entity/Obejct';
import { Scope } from '../entity/Scope';

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
