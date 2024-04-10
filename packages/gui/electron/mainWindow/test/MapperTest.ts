import { controller, inject, test } from "~main/ioc.config";
import { MapperDao } from "../daos/MapperDao";

@controller('test::mapper')
export class MapperTest {
   @inject('mapper-dao') declare mapperDao: MapperDao


   @test('read', [
      { path: 'projects/example' },
   ])
   testReader() {

   }
}
