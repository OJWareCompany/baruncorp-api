import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import { FilesystemApiService } from './infra/filesystem.api.service'

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [FilesystemApiService],
  exports: [FilesystemApiService],
  // controllers: [...httpControllers],
})
export class FilesystemModule {}
