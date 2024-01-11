// /* eslint-disable @typescript-eslint/ban-ts-comment */
// import { Inject } from '@nestjs/common'
// import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
// import { AggregateID } from '../../../../libs/ddd/entity.base'
// import { PrismaService } from '../../../database/prisma.service'
// import { FILESYSTEM_REPOSITORY } from '../../filesystem.di-token'
// import { FilesystemEntity } from '../../domain/filesystem.entity'
// import { CreateFilesystemCommand } from './create-filesystem.command'

// @CommandHandler(CreateFilesystemCommand)
// export class CreateFilesystemService implements ICommandHandler {
//   constructor(
//     // @ts-ignore
//     @Inject(FILESYSTEM_REPOSITORY)
//     private readonly filesystemRepo: FilesystemRepositoryPort,
//     private readonly prismaService: PrismaService,
//   ) {}
//   async execute(command: CreateFilesystemCommand): Promise<AggregateID> {
//     const entity = FilesystemEntity.create({
//       ...command,
//     })
//     await this.filesystemRepo.insert(entity)
//     return entity.id
//   }
// }
