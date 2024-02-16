import { NotFoundException } from '@nestjs/common'

export class CreditTransactionNotFoundException extends NotFoundException {
  constructor() {
    super('Not CreditTransaction found', '50401')
  }
}
