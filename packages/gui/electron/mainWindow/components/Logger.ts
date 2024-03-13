import { useLogger } from "~/boot/logger";
import { factory } from "../ioc.config";



@factory('logger')
export class Logger {

   create() {
      return useLogger('service-component')
   }
}
