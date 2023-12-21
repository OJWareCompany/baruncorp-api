export interface CreateTaskProps {
  name: string
  serviceId: string
  serviceName: string
}

export type TaskProps = CreateTaskProps

export enum LicenseRequiredEnum {
  structural = 'Structural',
  electrical = 'Electrical',
}
