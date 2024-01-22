export interface CreateInformationProps {
  contents: string
  isActive: boolean
}

export type InformationProps = CreateInformationProps

export interface CreateInformationHistoryProps {
  informationId: string
  contents: string
  updatedBy: string
}

export type InformationHistoryProps = CreateInformationHistoryProps
