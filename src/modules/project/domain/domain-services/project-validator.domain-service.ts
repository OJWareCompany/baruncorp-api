/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { CreateProjectCommand } from '../../commands/create-project/create-project.command'
import { UpdateProjectCommand } from '../../commands/update-project/update-project.command'
import { ProjectEntity } from '../project.entity'
import { ProjectNumberConflictException, ProjectPropertyAddressConflictException } from '../project.error'
import { PROJECT_REPOSITORY } from '../../project.di-token'
import { ProjectRepositoryPort } from '../../database/project.repository.port'
import { ORGANIZATION_REPOSITORY } from '../../../organization/organization.di-token'
import { OrganizationRepositoryPort } from '../../../organization/database/organization.repository.port'

@Injectable()
export class ProjectValidatorDomainService {
  constructor(
    // @ts-ignore
    @Inject(PROJECT_REPOSITORY) private readonly projectRepo: ProjectRepositoryPort,
    // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepo: OrganizationRepositoryPort,
  ) {}

  async validateForCreation(command: CreateProjectCommand) {
    await this.validateExistOrganization(command.clientOrganizationId)
    await this.checkProjectNumberConflict(command.clientOrganizationId, command.projectNumber)
    await this.checkPropertyAddressConflict(command.clientOrganizationId, command.projectPropertyAddress.fullAddress)
  }

  async validateForUpdate(projectEntity: ProjectEntity, command: UpdateProjectCommand) {
    await this.validateExistOrganization(projectEntity.clientOrganizationId)
    await this.checkProjectNumberConflict(projectEntity.clientOrganizationId, command.projectNumber, projectEntity)
    await this.checkPropertyAddressConflict(
      projectEntity.clientOrganizationId,
      command.projectPropertyAddress.fullAddress,
      projectEntity,
    )
  }

  private async validateExistOrganization(clientOrganizationId: string) {
    await this.organizationRepo.findOneOrThrow(clientOrganizationId)
  }

  private async checkProjectNumberConflict(
    clientOrganizationId: string,
    projectNumber: string | null,
    projectEntity?: ProjectEntity,
  ) {
    if (projectEntity && projectEntity.projectNumber === projectNumber) return

    const existingProject = await this.projectRepo.findOne({
      clientOrganizationId,
      projectNumber,
    })

    if (projectNumber && existingProject) {
      throw new ProjectNumberConflictException()
    }
  }

  private async checkPropertyAddressConflict(
    clientOrganizationId: string,
    fullAddress: string,
    projectEntity?: ProjectEntity,
  ) {
    if (projectEntity && projectEntity.projectPropertyAddress.fullAddress === fullAddress) return

    const existingAddress = await this.projectRepo.findOne({
      clientOrganizationId,
      propertyFullAddress: fullAddress,
    })

    if (existingAddress) {
      throw new ProjectPropertyAddressConflictException()
    }
  }
}
