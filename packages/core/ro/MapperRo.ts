import { ToDto } from '../dto';
import { Mapper, MapperHandler } from '../entity/Mapper';

export class MapperRo extends Mapper implements ToDto {

   declare package: string
   declare handlers: Record<string, MapperHandler>
   declare data: Record<string, any>

   toDto() {
      return {
         ...this,
         package: undefined
      }
   }
}

