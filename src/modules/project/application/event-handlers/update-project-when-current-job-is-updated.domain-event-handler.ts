/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '../../../database/prisma.service'
import { PROJECT_REPOSITORY } from '../../project.di-token'
import { ProjectRepositoryPort } from '../../database/project.repository.port'
import { CurrentJobUpdatedDomainEvent } from '../../../ordered-job/domain/events/current-job-updated.domain-event'
import { NewOrderedServices } from '../../../ordered-job/domain/value-objects/assigned-task.value-object'

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

    // const newOrderedServices = event.assignedTasks.map((tasks) => {
    //   return new NewOrderedServices({ serviceId: tasks.ser, description: tasks.ser })
    // })
    const project = await this.projectRepository.findOneOrThrow({ id: event.projectId })
    project
      .setSystemSize(event.systemSize)
      .setMailingFullAddressForWetStamp(event.mailingFullAddressForWetStamp)
      .setMountingType(event.mountingType)
    // .updateHasTaskHistory(event.assignedTasks)

    await this.projectRepository.updateProjectWhenJobIsCreated(project)
  }
}
