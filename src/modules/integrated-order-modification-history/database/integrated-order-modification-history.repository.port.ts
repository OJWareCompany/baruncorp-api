import { OrderedServiceEntity } from '../../ordered-service/domain/ordered-service.entity'
import { AssignedTaskEntity } from '../../assigned-task/domain/assigned-task.entity'
import { UserEntity } from '../../users/domain/user.entity'
import { JobEntity } from '../../ordered-job/domain/job.entity'

export interface IntegratedOrderModificationHistoryRepositoryPort {
  generateCreationHistory(
    entity: JobEntity | OrderedServiceEntity | AssignedTaskEntity,
    editor?: UserEntity | null,
  ): Promise<void>
  generateDeletionHistory(
    entity: JobEntity | OrderedServiceEntity | AssignedTaskEntity,
    editor?: UserEntity | null,
  ): Promise<void>
}
