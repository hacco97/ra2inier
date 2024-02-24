import { Entry, IniObject, UniqueObject } from '../entity/Obejct';
import { ToDto } from './index';

export class IniObjectRo extends IniObject implements ToDto {
   declare package: string
   declare cache: ObjectCache

   toDto() {
      return {
         ...this,
         package: undefined
      }
   }
}


export class IniObjectCore extends UniqueObject {
   scope: string = ''
   entry: Entry[] = []
}

export class ObjectCache {

}
