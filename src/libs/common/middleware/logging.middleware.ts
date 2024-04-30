import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    console.log(`[${new Date().toISOString()}] Request...`)
    console.log(`Method: ${req.method}`)
    console.log(`URL: ${req.originalUrl}`)
    console.log(`IP: ${req.ip}`)
    console.log(`Body: ${JSON.stringify(req.body)}`)
    console.log(`Query: ${JSON.stringify(req.query)}`)

    // 요청 처리를 계속하기 위해 next()를 호출합니다.
    next()
  }
}
