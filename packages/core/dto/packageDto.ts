import { Package, Project } from '../entity';

export class ProjectDto extends Project {
   declare main: PackageDto
}

export class PackageDto extends Package {


}
