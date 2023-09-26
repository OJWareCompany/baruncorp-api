import { Services } from '@prisma/client'
import { NewOrderedServices } from '../../ordered-job/domain/value-objects/ordered-task.value-object'

export const convertToAssignableTask = (
  orderTasks: NewOrderedServices | NewOrderedServices[],
  services: Services[],
): Services[] => {
  const filteredTasks = filterDuplicatedTask(orderTasks)

  // Wet Stamp 관련 로직 작성, Job List 매개변수로 받기

  const result = filteredTasks.map((task) => {
    return services.map((service) => {
      if (!service.is_member_assignment) return null
      if (service.id === task.serviceId || service.parent_task_id === task.serviceId) {
        service.description = task.description
        return { ...service }
      }
    })
  })

  return result.flat().filter((r): r is Services => !!r)
}

const filterDuplicatedTask = (orderTasks: NewOrderedServices | NewOrderedServices[]): NewOrderedServices[] => {
  const orderTaskList = Array.isArray(orderTasks) ? orderTasks : [orderTasks]

  const otherTaskId = '2a2a256b-57a5-46f5-8cfb-1855cc29238a'
  const otherTasks = orderTaskList.filter((task) => task.serviceId === otherTaskId)

  const menuTaskIdSet = new Set()
  const menuTask = orderTaskList.map((task) => {
    if (task.serviceId === otherTaskId || menuTaskIdSet.has(task.serviceId)) return
    menuTaskIdSet.add(task.serviceId)
    return new NewOrderedServices({ serviceId: task.serviceId, description: task.description })
  })

  return [...menuTask, ...otherTasks].filter((r): r is NewOrderedServices => !!r)
}
