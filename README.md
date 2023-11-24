## References

This is an attempt to combine multiple architectural patterns and styles together.

- https://github.com/Sairyss/domain-driven-hexagon

## Installation

```bash
$ pnpm install
$ pnpx prisma generate
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Nginx

nginx 폴더와 docker-compose.yml 파일들을 한단계 상위 폴더로 복사합니다.

```bash
cp -r nginx ../
cp docker-compose.yml ../
cp docker-compose.ssl.dry-run.yml ../
cp docker-compose.ssl.yml ../
cd ../
```

ssl 인증서를 발급합니다.

```bash
docker compose -f docker-compose.ssl.dry-run.yml up # 성공했다면 아래 코드 실행
docker compose -f docker-compose.ssl.yml up # ssl 인증서 발급
```

prod, dev 각 프로젝트 폴더가 잘 구성 되어있는지 확인하고 실행시킵니다.

```bash
docker compose up --build
```

## CQRS Code Generator

book store라는 도메인으로 cqrs 패턴 포맷의 모듈 생성

```
pnpm cqrs:generate init book-store
```

# Domain documents

### Price vs GM Price

GM은 Ground Mount를 의미한다, 프로젝트의 설치 타입에는 Roof Mount, Ground Mount, 또는 두가지를 혼용하는 경우가 있는데
Grount Mount 유형의 경우 비용을 더 많이 받기때문에 GM Price라는 가격 필드가 따로 있다.
