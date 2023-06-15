FROM node:18-alpine

# 앱 디렉터리 생성
WORKDIR /app

# 앱 의존성 설치
# 가능한 경우(npm@5+) package.json과 package-lock.json을 모두 복사하기 위해
# 와일드카드를 사용
COPY package*.json ./

RUN npm i -g pnpm
RUN pnpm i
# RUN npm i

# 프로덕션을 위한 코드를 빌드하는 경우
# RUN npm ci --omit=dev

# 앱 소스 추가
COPY . .

RUN pnpx prisma generate
RUN pnpm build

# RUN pnpx prisma db push

CMD ["pnpm", "run", "start:dev"]

EXPOSE 3000
