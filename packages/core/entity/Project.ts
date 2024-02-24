import { IUniqueObject, UniqueObject } from "./Obejct";
import { Package } from "./Package";


export interface IProject extends IUniqueObject {

}

export interface Project extends IProject { }
export class Project extends UniqueObject {

}
