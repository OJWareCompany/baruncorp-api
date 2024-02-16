import { NotFoundException, UnprocessableEntityException } from '@nestjs/common'

export class CreditTransactionNotFoundException extends NotFoundException {
  constructor() {
    super('Not CreditTransaction found', '50401')
  }
}

export class CreditInsufficientException extends UnprocessableEntityException {
  constructor(insufficientAmount: number) {
    super(`You have insufficient credit. (${insufficientAmount})`, '50402')
  }
}

export class CreditDeductionMissingInvoiceIdException extends UnprocessableEntityException {
  constructor() {
    super('Enter the relatedInvoiceId, Please.', '50403')
  }
}
