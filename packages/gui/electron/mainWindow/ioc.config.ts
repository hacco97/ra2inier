import { useIocControllers } from "~/ioc"
import config from "~/boot/config"


const ioc = useIocControllers(config.MAIN_WINDOW_NAME)

export const {
   controller,
   component,
   mapping,
   inject,
   param,
   pathVar,
   container,
   task,
   final,
   components,
   test,
   factory
} = ioc

export default ioc.init
