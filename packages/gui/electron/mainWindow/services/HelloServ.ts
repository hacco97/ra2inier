
import { mapping, param, pathVar, controller, task, final } from "~/mainWindow/ioc.config";


@controller('hello')
export class Hello {
   @mapping('hi')
   hi(options: RequestOptions) {
      return 'hello form hello service'
   }

   count = 0
   @mapping('count')
   async addCount() {
      const count = new Promise<number>((solve) => {
         setTimeout(() => solve(this.count++), 400)
      })
      return count
   }

   @mapping('param')
   param(@param('path') path: string) {
      console.log(path)
      return 'test param "path": ' + path
   }

   @mapping('pv')
   pathVar(@pathVar val: string) {
      return 'path var is: ' + val
   }

   id = 1
   @task(300)
   execTask() {
      console.log(this.id++ + ', task execs per 300s')
   }

   @final
   finalExec() {
      console.log('this task will be execcuted when the app will quit')
   }
}
