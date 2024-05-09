import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards, UploadedFiles, UseInterceptors, UseFilters } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { IssueInvoiceCommand } from './issue-invoice.command'
import { IssueInvoiceRequestDto, IssueInvoiceParamRequestDto } from './issue-invoice.request.dto'
import { ApiConsumes } from '@nestjs/swagger'
import { FilesInterceptor } from '@nestjs/platform-express'
import { FileExceptionFilter } from '../../../../libs/exceptions/file-exception.filter'

@Controller('invoices')
export class IssueInvoiceHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':invoiceId/issue')
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: { fileSize: 25 * 1024 * 1024 }, // 파일 크기 제한 25MB
    }),
  )
  @UseFilters(new FileExceptionFilter())
  async patch(
    @User() user: UserEntity,
    @UploadedFiles() files: Express.Multer.File[],
    @Param() param: IssueInvoiceParamRequestDto,
    @Body() request: IssueInvoiceRequestDto,
  ): Promise<void> {
    const command = new IssueInvoiceCommand({
      invoiceId: param.invoiceId,
      ...request,
      cc: request.cc?.filter((email) => !!email.length) || [],
      issuedByUserName: user.userName.fullName,
      issuedByUserId: user.id,
      files: files,
    })

    await this.commandBus.execute(command)
  }
}
