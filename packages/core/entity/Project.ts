import { IUniqueObject, UniqueObject } from './Obejct';

export interface IProject extends IUniqueObject {

}

export interface Project extends IProject { }
export class Project extends UniqueObject {

}


