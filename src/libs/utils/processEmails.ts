type EmailInput = string | string[] | Array<string>

export function processEmails(input: EmailInput): string[] {
  let emails: string[] = []

  // 입력 데이터의 타입에 따라 적절한 처리 수행
  if (typeof input === 'string') {
    // JSON 배열 형태의 문자열이라면 파싱을 시도합니다.
    if (input.startsWith('[') && input.endsWith(']')) {
      try {
        emails = JSON.parse(input)
      } catch {
        // 파싱에 실패하면 단일 이메일로 처리
        emails = [input]
      }
    } else {
      // 일반 문자열인 경우 배열로 변환
      emails = [input]
    }
  } else if (Array.isArray(input)) {
    // 배열이면 직접 할당
    emails = input
  }

  return emails
}
