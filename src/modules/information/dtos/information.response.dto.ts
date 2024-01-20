import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'

export class InformationResponseDto {
  @ApiProperty({ default: 'bd2d7904-136d-4e2e-966a-679fe4f499d0' })
  @IsString()
  readonly id: string
  constructor(props: InformationResponseDto) {
    initialize(this, props)
  }
  @ApiProperty({
    default: [
      {
        type: 'p',
        children: [
          { text: 'Please send an email to ' },
          {
            type: 'a',
            url: 'mailto:newjobs@baruncorp.com',
            target: '_blank',
            children: [{ text: 'newjobs@baruncorp.com' }],
          },
          { text: ' if you need to:' },
        ],
      },
      {
        type: 'p',
        listStyleType: 'disc',
        indent: 1,
        children: [{ text: 'Add additional services to an active service order' }],
      },
      {
        type: 'p',
        listStyleType: 'disc',
        indent: 1,
        children: [
          { text: 'Send us updated information for an active service order or for a service order that is on hold' },
        ],
        listStart: 2,
      },
      {
        type: 'p',
        listStyleType: 'disc',
        indent: 1,
        listStart: 3,
        children: [{ text: 'Any other questions or issues concerning service orders' }],
      },
      {
        type: 'p',
        children: [
          { text: 'Please send an email to ' },
          {
            type: 'a',
            url: 'mailto:chrisk@baruncorp.com',
            target: '_blank',
            children: [{ text: 'chrisk@baruncorp.com' }],
          },
          { text: ' for any matter relating to the portal.' },
        ],
      },
    ],
  })
  contents: JSON[]
  @ApiProperty({ default: true })
  isActive: boolean
  @ApiProperty({ default: '2024-01-07T23:56:28.493Z' })
  createdAt: Date
  @ApiProperty({ default: '2024-01-07T23:56:28.493Z' })
  updatedAt: Date
}
