import { Mapper, MapperHandler } from '../entity/Mapper';
import { ToDto } from './index';

export class MapperRo extends Mapper implements ToDto {

   declare package: string
   declare handlers: Record<string, MapperHandler>

   toDto() {
      return {
         ...this,
         package: undefined
      }
   }
}

