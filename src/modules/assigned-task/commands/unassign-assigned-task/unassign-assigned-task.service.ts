/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UnassignAssignedTaskCommand } from './unassign-assigned-task.command'
import { Inject } from '@nestjs/common'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
import { INVOICE_REPOSITORY } from '../../../invoice/invoice.di-token'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { InvoiceRepositoryPort } from '../../../invoice/database/invoice.repository.port'
import { IssuedJobUpdateException } from '../../../ordered-job/domain/job.error'
import { AssignedTaskAlreadyCompletedException } from '../../domain/assigned-task.error'
import { TaskStatusChangeValidationDomainService } from '../../domain/domain-services/task-status-change-validation.domain-service'

@CommandHandler(UnassignAssignedTaskCommand)
export class UnassignAssignedTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY)
    private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    // @ts-ignore
    @Inject(JOB_REPOSITORY)
    private readonly jobRepo: JobRepositoryPort,
    // @ts-ignore
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepo: InvoiceRepositoryPort,
    private readonly taskStatusValidator: TaskStatusChangeValidationDomainService,
  ) {}
  async execute(command: UnassignAssignedTaskCommand): Promise<void> {
    /**
     * unassign 불가 조건
     * 태스크가 완료됨
     * 잡 인보이스 이슈됨
     * 잡 결과물 전송됨
     *
     * TODO: Job은 ordered task, status의 변화를 항상 감지해야함, Aggregate로 나중에 합쳐야하나
     */

    /**
     * Job이 completed면 태스크도 completed임 => 애초에 unassign 불가능
     * Job이 completed인데, canceled인 태스크를 풀었다. => 따로 서비스의 reactive 이벤트 있어서 잡, 태스크의 status가 pending으로 됨, 즉 여기서 바꿀필요 없음
     * Job이 Inprogress인 경우 -> 상태 업데이트 필요
     */
    const assignedTask = await this.assignedTaskRepo.findOneOrThrow(command.assignedTaskId)

    await assignedTask.unassign(this.taskStatusValidator)
    await this.assignedTaskRepo.update(assignedTask)
  }
}
