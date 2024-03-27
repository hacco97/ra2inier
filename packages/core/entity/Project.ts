
export class Project {
   name: string
   loaderVersion = 'v1'
   author = ''


   constructor(name?: string) {
      this.name = name || ''
   }
}


