import { NotFoundException, UnprocessableEntityException } from '@nestjs/common'

export class VendorCreditTransactionNotFoundException extends NotFoundException {
  constructor() {
    super('Not CreditTransaction found', '50431')
  }
}

export class VendorCreditInsufficientException extends UnprocessableEntityException {
  constructor(insufficientAmount: number) {
    super(`You have insufficient credit. (${insufficientAmount})`, '50432')
  }
}

export class VendorCreditDeductionMissingInvoiceIdException extends UnprocessableEntityException {
  constructor() {
    super('Enter the relatedInvoiceId, Please.', '50433')
  }
}

export class VendorCreditWrongReloadException extends UnprocessableEntityException {
  constructor() {
    super('Credit Reload Method can not have related invoice id.', '50434')
  }
}
