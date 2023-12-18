export enum AutoAssignmentTypeEnum {
  none = 'None',
  rsidential = 'Rsidential',
  commercial = 'Commercial',
  all = 'Rsidential / Commercial',
}

export interface CreatePositionProps {
  name: string
  description?: string | null
  maxAssignedTasksLimit: number | null
}

export type PositionProps = CreatePositionProps
