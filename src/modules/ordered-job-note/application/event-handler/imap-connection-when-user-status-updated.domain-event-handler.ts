/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { UserStatusUpdatedDomainEvent } from '../../../users/domain/events/user-status-updated.domain-event'
import { UserStatusEnum } from '@modules/users/domain/user.types'
import { ImapManagerService } from '@modules/ordered-job-note/infrastructure/imap.manager.service'

@Injectable()
export class ImapConnectionWhenUserStatusChangedEventHandler {
  constructor(private readonly imapService: ImapManagerService) {}
  @OnEvent(UserStatusUpdatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: UserStatusUpdatedDomainEvent) {
    if (event.email.includes('@baruncorp')) {
      // 유저 상태 확인
      if (event.status === UserStatusEnum.ACTIVE) {
        // active인 경우 IMAP Connect
        this.imapService.connect(event.email)
      } else {
        // active가 아닌 경우 IMAP Disconnect
        this.imapService.disconnect(event.email)
      }
    }
  }
}
