import { Tasks } from '@prisma/client'
import { Pricing } from './value-objects/pricing.value-object'

export interface CreateServiceProps {
  name: string
  billingCode: string
  pricing: Pricing
}

export interface ServiceProps extends CreateServiceProps {
  tasks: Tasks[]
}

// export type AssignedTaskStatus = 'Not Started' | 'In Progress' | 'On Hold' | 'Completed' | 'Canceled'

export enum ServicePricingTypeEnum {
  standard = 'Standard',
  fixed = 'Fixed',
}

/**
 * Pricing Type
 *
 * Pricing (Standard / Fixed)
 *
 * Standard Case
 * Residential - (Standard / Tiered(Flat))
 * Commercial - (Standard Tiered / Custom Tiered)
 * Commercial Revision - (Standard / Custom)
 *
 * Fixed Case
 * Residential - Fixed
 * Commercial - Fixed
 * Commercial Revision - Fixed
 */
