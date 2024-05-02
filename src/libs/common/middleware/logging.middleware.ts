import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { v4 } from 'uuid'

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const body = req.method !== 'GET' && req.method !== 'OPTIONS' ? `Body: ${JSON.stringify(req.body)}` : ''
    Logger.log(`[${req.ip}] ${req.method} ${req.originalUrl} ${body}`)

    // 요청 처리를 계속하기 위해 next()를 호출합니다.
    next()
  }
}
