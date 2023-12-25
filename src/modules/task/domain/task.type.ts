import { LicenseTypeEnum } from '../../license/dtos/license.response.dto'

export interface CreateTaskProps {
  name: string
  serviceId: string
  serviceName: string
  licenseType: LicenseTypeEnum | null
}

export type TaskProps = CreateTaskProps
