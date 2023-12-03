import { OrderedJobs, OrderedProjects, OrderedServices, Organizations } from '@prisma/client'
import { ServiceEntity } from '../../../service/domain/service.entity'
import { AssignedTaskStatusEnum } from '../../../assigned-task/domain/assigned-task.type'
import { PrismaService } from '../../../database/prisma.service'
import { CustomPricingRepositoryPort } from '../../../custom-pricing/database/custom-pricing.repository.port'
import { MountingType, ProjectPropertyType } from '../../../project/domain/project.type'
import { OrderedServiceSizeForRevision } from '../../domain/ordered-service.type'
import { CustomPricingEntity } from '../../../custom-pricing/domain/custom-pricing.entity'
import { OrderedServiceEntity } from '../../domain/ordered-service.entity'

export class OrderedServiceManager {
  // Don't use Directly
  private preOrderedServices: OrderedServices[]
  private isCheckoutPreOrderedServices = false
  // Don't use Directly
  private customPricing: CustomPricingEntity | null

  constructor(
    private readonly prismaService: PrismaService,
    private readonly service: ServiceEntity,
    private readonly customPricingRepo: CustomPricingRepositoryPort,
    private readonly organization: Organizations,
    private readonly project: OrderedProjects,
    private readonly job: OrderedJobs,
    private readonly orderedService: OrderedServiceEntity | null,
  ) {}

  // 생성자인자와 메서드인자 구분을 어떻게해야할까, 클래스가 여러 조직이 사용가능한가, 조직마다 새로 생성해야하나의 여부에따라 달라질수도있다.
  async determineInitialPrice() {
    const projectType = this.getProjectType(this.project)
    const mountingType = this.getMountingType(this.job.mountingType)
    const systemSize = this.job.systemSize ? Number(this.job.systemSize) : null
    const revisionSize = await this.getRevisionSize()
    const isRevision = await this.determineRevisionStatus()

    const standardPrice = this.service
      .getProps()
      .pricing.getPrice(isRevision, projectType, mountingType, systemSize, revisionSize)

    const customPricing = await this.getCustomPricing()
    const customPrice = customPricing
      ? customPricing.getPrice(isRevision, projectType, mountingType, systemSize, revisionSize)
      : null

    const isFreeRevision = await this.calculateFreeRevisionStatus()

    const initialPrice = isFreeRevision
      ? 0
      : !!customPricing && customPricing.hasNewResidentialPricing() //
      ? customPrice
      : customPrice ?? standardPrice

    return initialPrice
  }

  async isRevision() {
    return await this.determineRevisionStatus()
  }

  async isFixedPricing() {
    const customPricing = await this.getCustomPricing()
    return customPricing?.hasFixedPricing() || this.service.getProps().pricing.fixedPrice
  }

  async getRevisionSize(): Promise<OrderedServiceSizeForRevision | null> {
    const isFreeRevision = await this.calculateFreeRevisionStatus()
    return this.orderedService?.getProps().sizeForRevision
      ? (this.orderedService.getProps().sizeForRevision as OrderedServiceSizeForRevision)
      : isFreeRevision || (await this.isFixedPricing())
      ? 'Major'
      : null
  }

  private getProjectType(project: OrderedProjects): ProjectPropertyType {
    return project.projectPropertyType === 'Residential' ? 'Residential' : 'Commercial'
  }

  private getMountingType(mountingType: string): MountingType {
    return mountingType === 'Ground Mount' ? 'Ground Mount' : 'Roof Mount'
  }

  private async determineRevisionStatus() {
    // 주문 정보를 다 가지고 있는 프로젝트 엔티티가 필요한가
    const preOrderedServices = await this.getPreOrederedServices()
    const isNew =
      preOrderedServices.length === 0 ||
      (preOrderedServices.length === 1 && preOrderedServices[0].id === this.orderedService?.id)

    return !isNew // True if it's a revision
  }

  private async calculateFreeRevisionStatus() {
    const preOrderedServices = await this.getPreOrederedServices()
    const isRevision = await this.determineRevisionStatus()
    const receivedFreeRevisionsCount = preOrderedServices.filter((service) => Number(service.price) === 0).length
    const hasRemainingFreeRevisions = Number(this.organization.numberOfFreeRevisionCount) > receivedFreeRevisionsCount
    return isRevision && this.organization.isSpecialRevisionPricing && hasRemainingFreeRevisions
  }

  private async getCustomPricing() {
    //계속해서 체크할 여지 있음
    if (!this.customPricing) {
      this.customPricing = await this.customPricingRepo.findOne(null, {
        serviceId: this.service.id,
        organizationId: this.organization.id,
      })
    }
    return this.customPricing
  }

  private async getPreOrederedServices() {
    if (!this.isCheckoutPreOrderedServices) {
      this.preOrderedServices = await this.prismaService.orderedServices.findMany({
        where: {
          projectId: this.project.id,
          serviceId: this.service.id,
          status: { notIn: [AssignedTaskStatusEnum.Canceled, AssignedTaskStatusEnum.On_Hold] },
        },
      })
    }
    return this.preOrderedServices
  }
}
