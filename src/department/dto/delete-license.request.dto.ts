/**
 * is record's primary key okay to expose?
 * https://softwareengineering.stackexchange.com/questions/218306/why-not-expose-a-primary-key
 */

export class DeleteLicenseRequestDto {
  userId: string
  type: 'Electrical' | 'Structural'
  issuingCountryName: string
}
