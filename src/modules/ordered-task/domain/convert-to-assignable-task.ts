import { Services } from '@prisma/client'

export const convertToAssignableTask = (taskId: string | string[], services: Services[]): Services[] => {
  const taskIds = Array.isArray(taskId) ? taskId : [taskId]
  const result = taskIds.map((taskId) => {
    return services.filter((service) => {
      if (!service.is_member_assignment) return false
      else return service.id === taskId || service.parent_task_id === taskId
    })
  })
  return result.flat()
}
