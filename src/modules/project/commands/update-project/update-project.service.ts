/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ConflictException, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { NotFoundOrganization } from '../../../organization/domain/organization.error'
import { ProjectRepositoryPort } from '../../database/project.repository.port'
import { PROJECT_REPOSITORY } from '../../project.di-token'
import { UpdateProjectCommand } from './update-project.command'
import { ProjectEntity } from '../../domain/project.entity'

@CommandHandler(UpdateProjectCommand)
export class UpdateProjectService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(PROJECT_REPOSITORY) private readonly projectRepository: ProjectRepositoryPort,
  ) {}

  async execute(command: UpdateProjectCommand): Promise<void> {
    const project = await this.projectRepository.findProjectOrThrow(command.projectId)

    await this.validate(project, command)
    await this.validateProjectNumber(project, command)
    await this.validatePropertyAddress(project, command)

    project.update({
      projectPropertyType: command.projectPropertyType,
      projectPropertyOwner: command.projectPropertyOwner,
      projectNumber: command.projectNumber,
      projectPropertyAddress: command.projectPropertyAddress,
      projectAssociatedRegulatory: command.projectAssociatedRegulatory,
      updatedBy: command.updatedByUserId,
    })

    // Project Number가 이미 존재하면 업데이트 안됨
    // 근데 변경되지 않은 경우도 Project Number가 넘어옴
    // 변경을 위한 project number와

    await this.projectRepository.update(project)
  }

  private async validate(projectEntity: ProjectEntity, command: UpdateProjectCommand) {
    const organization = await this.projectRepository.isExistedOrganizationById(
      projectEntity.getProps().clientOrganizationId,
    )
    if (!organization) {
      throw new NotFoundOrganization()
    }
  }

  private async validateProjectNumber(projectEntity: ProjectEntity, command: UpdateProjectCommand) {
    if (projectEntity.getProps().projectNumber === command.projectNumber) return

    const isAlreadyExistedProjectNumber = command.projectNumber
      ? await this.projectRepository.isExistedProjectByClientIdAndProjectNumber(
          projectEntity.getProps().clientOrganizationId,
          command.projectNumber,
        )
      : false

    if (command.projectNumber && isAlreadyExistedProjectNumber) {
      throw new ConflictException(`Project number ${command.projectNumber} is Already Existed`, '30002')
    }
  }

  private async validatePropertyAddress(projectEntity: ProjectEntity, command: UpdateProjectCommand) {
    if (projectEntity.getProps().projectPropertyAddress.fullAddress === command.projectPropertyAddress.fullAddress) {
      return
    }

    const isAlreadyExistedPropertyAddress = await this.projectRepository.isExistedByPropertyOwnerAddress(
      projectEntity.getProps().clientOrganizationId,
      command.projectPropertyAddress.fullAddress,
    )

    if (isAlreadyExistedPropertyAddress) {
      throw new ConflictException(
        `Project Property Full Address ${command.projectPropertyAddress.fullAddress} is Already Existed`,
        '30002',
      )
    }
  }
}
