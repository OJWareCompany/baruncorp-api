import { OrganizationCreatedDomainEvent } from './../../../organization/domain/events/organization-created.domain-event'
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { FilesystemApiService } from '../../infra/filesystem.api.service'
import { PrismaService } from '../../../../modules/database/prisma.service'
import { OrganizationSharedDriveConflictException } from './../../domain/filesystem.error'

@Injectable()
export class CreateGoogleSharedDriveWhenOrganizationIsCreatedDomainEventHandler {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly filesystemApiService: FilesystemApiService,
  ) {}

  @OnEvent(OrganizationCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: OrganizationCreatedDomainEvent) {
    const organizationId = event.aggregateId
    const organizationName = event.name
    try {
      const { sharedDrive, residentialFolder, commercialFolder } =
        await this.filesystemApiService.requestToCreateGoogleSharedDrive(organizationName)
      await this.prismaService.google_shared_drive.create({
        data: {
          id: sharedDrive.id,
          name: organizationName,
          residential_folder_id: residentialFolder.id,
          commercial_folder_id: commercialFolder.id,
          organization_id: organizationId,
        },
      })
    } catch (error) {
      await this.prismaService.organizations.delete({
        where: {
          id: organizationId,
        },
      })
      return new OrganizationSharedDriveConflictException(organizationName)
    }
  }
}
