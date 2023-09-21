// enum OrderedServiceStatus {
//   taskStatus: 'Not Started' | 'In Progress' | 'On Hold' | 'Completed' | 'Canceled'
// }

export interface CreateServiceProps {
  name: string
  billingCode: string | null
  // stateRestricted: boolean | null
}

export interface ServiceProps {
  name: string
  billingCode: string | null
  // stateRestricted: boolean | null
}

export interface CreateOrderedServiceProps {
  name: string
  billingCode: string | null
  // stateRestricted: boolean | null
}

export interface OrderedServiceProps {
  name: string
  billingCode: string | null
  // stateRestricted: boolean | null
  // status:
  doneAt: Date
}
