import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../../../src/modules/database/prisma.module'

const httpControllers = [] as any
const commandHandlers: Provider[] = []
const eventHandlers: Provider[] = []
const queryHandlers: Provider[] = []
const repositories: Provider[] = []
const mappers: Provider[] = []

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
})
export class OrderedServiceModule {}
