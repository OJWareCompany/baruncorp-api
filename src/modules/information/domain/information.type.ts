export interface CreateInformationProps {
  contents: JSON[]
  isActive: boolean
}

export type InformationProps = CreateInformationProps

export interface CreateInformationHistoryProps {
  contents: JSON[]
  updatedBy: string
}

export type InformationHistoryProps = CreateInformationHistoryProps
