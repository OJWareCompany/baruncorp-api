import { Tasks } from '@prisma/client'

export interface CreateServiceProps {
  name: string
  billingCode: string
  basePrice: number
}

export interface ServiceProps {
  name: string
  billingCode: string
  basePrice: number
  tasks: Tasks[]
}

// export type AssignedTaskStatus = 'Not Started' | 'In Progress' | 'On Hold' | 'Completed' | 'Canceled'
