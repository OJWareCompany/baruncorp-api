import { ApiProperty } from '@nestjs/swagger'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class ClientInformation {
  @ApiProperty()
  clientOrganizationId: string

  @ApiProperty()
  clientOrganizationName: string

  @ApiProperty()
  clientContactEmail: string

  @ApiProperty()
  deliverablesEmail: string[]

  constructor(props: ClientInformation) {
    initialize(this, props)
  }
}
