/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { SERVICE_REPOSITORY } from '../../../service/service.di-token'
import { ServiceRepositoryPort } from '../../../service/database/service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../../ordered-service/ordered-service.di-token'
import { OrderedServiceRepositoryPort } from '../../../ordered-service/database/ordered-service.repository.port'
import { addMinutes } from 'date-fns'
import { ProjectEntity } from '../../../project/domain/project.entity'
import { AssignedTaskProps } from '../../../assigned-task/domain/assigned-task.type'

export class TotalDurationCalculator {
  constructor(
    // @ts-ignore
    @Inject(SERVICE_REPOSITORY) private readonly serviceRepo: ServiceRepositoryPort, // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
  ) {}
  async calcTotalDuration(tasks: Pick<AssignedTaskProps, 'serviceId' | 'description'>[], project: ProjectEntity) {
    const services = await this.serviceRepo.find({ id: { in: tasks.map((task) => task.serviceId) } })

    let totalDurationInMinutes = new Date()
    const DAY_TO_MINUTES = 1440

    await Promise.all(
      services.map(async (service) => {
        const preOrderedServices = await this.orderedServiceRepo.getPreviouslyOrderedServices(project.id, service.id)
        const isRevision = preOrderedServices.length > 0
        const duration = service.getTaskDuration(project, isRevision) || 0
        totalDurationInMinutes = addMinutes(totalDurationInMinutes, duration * DAY_TO_MINUTES)
      }),
    )

    return totalDurationInMinutes
  }
}
