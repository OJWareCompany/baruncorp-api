import { Services } from '@prisma/client'
import { NewOrderedTasks } from '../../ordered-job/domain/value-objects/ordered-task.value-object'

export const convertToAssignableTask = (
  orderTasks: NewOrderedTasks | NewOrderedTasks[],
  services: Services[],
): Services[] => {
  const filteredTasks = filterDuplicatedTask(orderTasks)

  // Wet Stamp 관련 로직 작성, Job List 매개변수로 받기

  const result = filteredTasks.map((task) => {
    return services.map((service) => {
      if (!service.is_member_assignment) return null
      if (service.id === task.taskId || service.parent_task_id === task.taskId) {
        service.description = task.description
        return { ...service }
      }
    })
  })

  return result.flat().filter((r) => r) as Services[] // TODO: any
}

const filterDuplicatedTask = (orderTasks: NewOrderedTasks | NewOrderedTasks[]): NewOrderedTasks[] => {
  const orderTaskList = Array.isArray(orderTasks) ? orderTasks : [orderTasks]

  const otherTaskId = '2a2a256b-57a5-46f5-8cfb-1855cc29238a'
  const otherTasks = orderTaskList.filter((task) => task.taskId === otherTaskId) // Other Task

  const menuTaskIdSet = new Set()
  const menuTask = orderTaskList.map((task) => {
    if (task.taskId === otherTaskId || menuTaskIdSet.has(task.taskId)) return
    menuTaskIdSet.add(task.taskId)
    return new NewOrderedTasks({ taskId: task.taskId, description: task.description })
  })

  return [...menuTask, ...otherTasks].filter((r) => r) as NewOrderedTasks[] // TODO: any
}
