import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { v4 } from 'uuid'

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const uuid = v4()

    console.log(`[${uuid}] [${new Date().toISOString()}] Request...`)
    console.log(`[${uuid}] Method: ${req.method}`)
    console.log(`[${uuid}] URL: ${req.originalUrl}`)
    console.log(`[${uuid}] IP: ${req.ip}`)
    console.log(`[${uuid}] Body: ${JSON.stringify(req.body)}`)
    console.log(`[${uuid}] Query: ${JSON.stringify(req.query)}`)

    // 요청 처리를 계속하기 위해 next()를 호출합니다.
    next()
  }
}
