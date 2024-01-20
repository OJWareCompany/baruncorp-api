import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsJSON, IsNumber, IsObject, IsOptional, IsString, Max } from 'class-validator'
import { CustomMax } from '../../../../libs/decorators/custom/custom-max.decorator'
import { CustomMin } from '../../../../libs/decorators/custom/custom-min.decorator'
import { TotalRangeException } from '../../../pto/domain/pto.error'

export class CreateInformationParamRequestDto {
  @ApiProperty({ default: '529cec06-1fb7-4284-b56f-9f31219cd099' })
  @IsString()
  readonly informationId: string
}

export class CreateInformationRequestDto {
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
  @IsArray()
  readonly contents: JSON[]
}
