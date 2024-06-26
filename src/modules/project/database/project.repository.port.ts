import { ProjectEntity } from '../domain/project.entity'
import { UserEntity } from '../../../modules/users/domain/user.entity'
import { Prisma } from '@prisma/client'

export interface ProjectRepositoryPort {
  // 어떤 메서드가 필요하다는 것을 정의해둘수 있음
  findOne(whereInput: Prisma.OrderedProjectsWhereInput): Promise<ProjectEntity | null>
  findOneOrThrow(whereInput: Prisma.OrderedProjectsWhereInput): Promise<ProjectEntity>
  countTotalOfJobs(id: string): Promise<number>
  update(entity: ProjectEntity): Promise<void>
  createProject(props: ProjectEntity): Promise<void>
  updateProjectWhenJobIsCreated(entity: ProjectEntity): Promise<void>
  updateProjectMailingAddress(entity: ProjectEntity): Promise<void>
  updateProjectSystemSize(entity: ProjectEntity): Promise<void>
  findClientUserById(id: string): Promise<UserEntity>
}
