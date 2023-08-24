import { ProjectEntity } from '../domain/project.entity'
import { UserEntity } from '../../../modules/users/domain/user.entity'

export interface ProjectRepositoryPort {
  // 어떤 메서드가 필요하다는 것을 정의해둘수 있음
  createProject(props: ProjectEntity): Promise<void>
  isExistedProjectByClientIdAndProjectNumber(clientId: string, projectName: string): Promise<boolean>
  isExistedByPropertyOwnerAddress(propertyOwnerAddress: string): Promise<boolean>
  findClientUserById(id: string): Promise<UserEntity>
  isExistedOrganizationById(organizationId: string): Promise<boolean>
}
