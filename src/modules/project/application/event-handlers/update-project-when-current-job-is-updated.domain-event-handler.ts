/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '../../../database/prisma.service'
import { PROJECT_REPOSITORY } from '../../project.di-token'
import { ProjectRepositoryPort } from '../../database/project.repository.port'
import { CurrentJobUpdatedDomainEvent } from '../../../ordered-job/domain/events/current-job-updated.domain-event'

@Injectable()
export class UpdateProjectWhenCurrentJobIsUpdatedEventHandler {
  constructor(
    // @ts-ignore
    @Inject(PROJECT_REPOSITORY) private readonly projectRepository: ProjectRepositoryPort,
    // @ts-ignore
    @Inject(PROJECT_REPOSITORY) private readonly prismaService: PrismaService,
  ) {}
  @OnEvent(CurrentJobUpdatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: CurrentJobUpdatedDomainEvent) {
    if (!event.isCurrentJop) return

    const project = await this.projectRepository.findProjectOrThrow(event.projectId)
    project
      .setSystemSize(event.systemSize)
      .setMailingFullAddressForWetStamp(event.mailingFullAddressForWetStamp)
      .setMountingType(event.mountingType)
      .updateHasTaskHistory(event.orderedTask)

    await this.projectRepository.updateProjectWhenJobIsCreated(project)
  }
}
