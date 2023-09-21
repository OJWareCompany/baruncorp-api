import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { ServiceRepositoryPort } from './service.repository.port'
import { ServiceEntity } from '../domain/service.entity'

@Injectable()
export class ServiceRepository implements ServiceRepositoryPort {
  constructor(private readonly prismaService: PrismaService) {}
  insert(entity: ServiceEntity): Promise<{ id: string }> {
    throw new Error('Method not implemented.')
  }
}
