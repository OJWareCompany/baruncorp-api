export enum AutoAssignmentTypeEnum {
  none = 'None',
  residential = 'Residential',
  commercial = 'Commercial',
  all = 'Residential / Commercial',
}

export interface CreatePositionProps {
  name: string
  description?: string | null
  maxAssignedTasksLimit: number | null
}

export type PositionProps = CreatePositionProps
