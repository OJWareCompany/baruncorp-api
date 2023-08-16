export class OrganizationResponseDto {
  id: string
  name: string
  description: string | null
  email: string
  phoneNumber: string
  organizationType: string
  city: string
  country: string
  postalCode: string
  stateOrRegion: string
  street1: string
  street2: string
  isActiveContractor: number | null
  isActiveWorkResource: number | null
  revenueShare: number | null
  revisionRevenueShare: number | null
  invoiceRecipient: string | null
  invoiceRecipientEmail: string | null
}
