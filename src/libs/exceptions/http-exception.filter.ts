import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common'
import { Request, Response } from 'express'
import got from 'got'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    console.log(exception)
    let errorCode: string = null
    if (status < 500) {
      errorCode = exception.getResponse()['error']
    }

    got.post('https://hooks.slack.com/services/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', {
      json: { text: JSON.stringify({ ...exception }) },
    })

    const message =
      exception.getResponse && Array.isArray(exception.getResponse)
        ? [...exception.getResponse()['message']]
        : exception.getResponse && !Array.isArray(exception.getResponse)
        ? exception.getResponse()['message']
        : [exception.message]

    response.status(status).json({
      errorCode: Array.isArray(errorCode) ? [...errorCode] : [errorCode],
      message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    })
  }
}
