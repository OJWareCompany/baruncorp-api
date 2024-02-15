import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'

@Catch()
export class FileExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    // if (exception.code === 'LIMIT_FILE_SIZE') {
    if (exception.response.statusCode === HttpStatus.PAYLOAD_TOO_LARGE) {
      // 파일 용량 제한을 위반했을 경우
      response.status(HttpStatus.PAYLOAD_TOO_LARGE).json({
        errorCode: [22001],
        message: 'File too large. Max size: 25MB',
        statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
        timestamp: new Date(),
      })
    } else if (exception.response.statusCode === HttpStatus.BAD_REQUEST) {
      // 필드 이름 예외(ex. 서버에서 제시한 필드명이 files인데 file로 파일 전송)
      // 필드 갯수 불일치
      response.status(HttpStatus.BAD_REQUEST).json({
        errorCode: [22002],
        message: 'Check files name or files count. Max count : 10',
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: new Date(),
      })
    } else {
      // 기타 에러 처리
      response.status(exception.response.statusCode).json({
        errorCode: [exception.response.error],
        message: exception.response.message,
        statusCode: exception.response.statusCode,
        timestamp: new Date(),
      })
    }
  }
}
