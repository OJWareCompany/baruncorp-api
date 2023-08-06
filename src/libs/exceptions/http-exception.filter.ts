import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { Request, Response } from 'express'
import got from 'got'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()
    const errorCode = exception.getResponse()['error']
    console.log(exception)

    response.status(status).json({
      errorCode: Array.isArray(errorCode) ? [...errorCode] : [errorCode],
      message: Array.isArray(exception.message) ? [...exception.getResponse()['message']] : [exception.message],
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    })
  }
}
