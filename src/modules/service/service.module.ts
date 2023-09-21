import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaService } from '../database/prisma.service'

@Module({
  imports: [PrismaService, CqrsModule],
  providers: [],
  controllers: [],
})
export class ServiceModule {}
