export interface CreateUtilitySnapshotProps {
  utilityId: string
  updatedBy: string
  name: string
  stateAbbreviations: string[]
  notes: string
  type: UtilitySnapshotTypeEnum
}

export type UtilitySnapshotProps = CreateUtilitySnapshotProps

export const enum UtilitySnapshotTypeEnum {
  Create = 'Create',
  Modify = 'Modify',
}
