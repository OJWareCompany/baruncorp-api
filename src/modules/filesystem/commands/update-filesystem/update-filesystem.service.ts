// /* eslint-disable @typescript-eslint/ban-ts-comment */
// import { Inject } from '@nestjs/common'
// import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
// import { PrismaService } from '../../../database/prisma.service'
// import { FilesystemRepositoryPort } from '../../database/filesystem.repository.port'
// import { FilesystemNotFoundException } from '../../domain/filesystem.error'
// import { FILESYSTEM_REPOSITORY } from '../../filesystem.di-token'
// import { UpdateFilesystemCommand } from './update-filesystem.command'

// @CommandHandler(UpdateFilesystemCommand)
// export class UpdateFilesystemService implements ICommandHandler {
//   constructor(
//     // @ts-ignore
//     @Inject(FILESYSTEM_REPOSITORY)
//     private readonly filesystemRepo: FilesystemRepositoryPort,
//     private readonly prismaService: PrismaService,
//   ) {}
//   async execute(command: UpdateFilesystemCommand): Promise<void> {
//     const entity = await this.filesystemRepo.findOne(command.filesystemId)
//     if (!entity) throw new FilesystemNotFoundException()
//     await this.filesystemRepo.update(entity)
//   }
// }
