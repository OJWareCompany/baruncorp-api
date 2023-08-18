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
  state: string
  street1: string
  street2: string
  isActiveContractor: boolean | null
  isActiveWorkResource: boolean | null
  isRevenueShare: boolean | null
  isRevisionRevenueShare: boolean | null
  invoiceRecipient: string | null
  invoiceRecipientEmail: string | null
}
