import { Package, Project } from '../entity';

export class ProjectDto extends Project {
	declare main: PackageDto
}

export class PackageDto extends Package { }

const TMP = new Package
export class ProjectInfoDto extends Project {
	path: string = ''
	main: Package = TMP
}