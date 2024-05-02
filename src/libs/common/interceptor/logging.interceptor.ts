import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { v4 } from 'uuid'
// import { logger } from '../logger/winston.logger'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse()
    const { method, url } = request
    const userId = request.user?.id // 가드를 통해 주입된 사용자 객체에서 ID 가져오기

    const logMessage = `Method: ${method} | URL: ${url} | UserID: ${userId}`
    const requestId = v4()
    // console.log(`Request started [${requestId}]: ${logMessage}`)
    // logger.info(`Request started: ${logMessage}`)

    const now = Date.now()
    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now
        Logger.verbose(`Request completed: ${logMessage} | ResponseTime: ${responseTime}ms`)
        // logger.info(`Request completed: ${logMessage} | ResponseTime: ${responseTime}ms`)
      }),
    )
  }
}
