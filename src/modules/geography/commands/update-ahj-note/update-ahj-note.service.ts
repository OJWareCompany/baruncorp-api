/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { GeographyRepositoryPort } from '../../database/geography.repository.port'
import { GEOGRAPHY_REPOSITORY } from '../../geography.di-token'
import { UpdateAhjNoteCommand } from './update-ahj-note.command'

@CommandHandler(UpdateAhjNoteCommand)
export class UpdateAhjNoteService {
  constructor(
    // @ts-ignore
    @Inject(GEOGRAPHY_REPOSITORY) private readonly geographyRepo: GeographyRepositoryPort, // @ts-ignore
    @Inject(GEOGRAPHY_REPOSITORY) private readonly userRepo: UserRepositoryPort,
  ) {}
  async handle(command: UpdateAhjNoteCommand) {
    await this.geographyRepo.findNoteByGeoIdOrThrow(command.geoId)
    const user = await this.userRepo.findOneByIdOrThrow(command.editorUserId)
    await this.geographyRepo.updateNoteAndCreateHistory(user.userName.fullName, command.geoId, command)
  }
}

/**
 * Repository는 추상화 하는 것일뿐 본질적인 기능을 숨기면 안된다.
 * create와 history생성을 같이 하는 것은 잘못됨
 * 하지만 메서드명에서 표현하면 ㄱㅊ
 */
