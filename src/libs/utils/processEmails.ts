// 이메일 처리를 위한 함수와 타입 정의
type EmailInput = string | string[]

export function processEmails(input: EmailInput): string[] {
  let emails: string[] = []

  // 입력 데이터의 타입에 따라 적절한 처리 수행
  if (typeof input === 'string') {
    // JSON 배열 형태의 문자열이라면 파싱을 시도합니다.
    if (input.startsWith('[') && input.endsWith(']')) {
      try {
        // 문자열을 JSON으로 파싱하여 배열로 변환
        input = input.replace(/'/g, '"') // JSON 파싱을 위해 작은따옴표를 큰따옴표로 변환
        emails = JSON.parse(input)
        // 파싱된 결과가 배열이 아니면 배열로 감싸기
        if (!Array.isArray(emails)) {
          emails = [emails]
        }
      } catch {
        // 파싱에 실패하면 쉼표로 구분된 단일 이메일 문자열로 처리
        emails = input.split(',').map((email) => email.trim())
      }
    } else {
      // 쉼표로 구분된 이메일 주소를 배열로 변환
      emails = input.split(',').map((email) => email.trim())
    }
  } else if (Array.isArray(input)) {
    // 배열이면 각 원소를 정리하여 다시 배열로 구성
    emails = input.flatMap((email) => {
      if (typeof email === 'string' && email.includes(',')) {
        return email.split(',').map((e) => e.trim())
      }
      return email
    })
  }

  return emails
}

// console.log(processEmails('gyals0386@gmail.com')) // ["gyals0386@gmail.com"]
// console.log(processEmails("['gyals0386@gmail.com']")) // ["gyals0386@gmail.com"]
// console.log(processEmails(['gyals0386@gmail.com'])) // ["gyals0386@gmail.com"]
// console.log(processEmails('hyomin@oj.vision, sangwon@oj.vision')) // ["hyomin@oj.vision", "sangwon@oj.vision"]
// console.log(processEmails(['hyomin@oj.vision'])) // ["hyomin@oj.vision"]
// console.log(processEmails("['hyomin@oj.vision']")) // ["hyomin@oj.vision"]
// console.log(processEmails("['sangwon@oj.vision','yohan1101@oj.vision']")) // ["sangwon@oj.vision", "yohan1101@oj.vision"]
