#!/bin/bash

# 환경 변수에서 설정 읽기
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}
BACKUP_DIR="/backup"
DATE=$(date +"%Y%m%d%H%M")

# 백업 파일 이름 지정
BACKUP_FILE="$BACKUP_DIR/$DB_NAME-$DATE.sql"

# 백업 실행
mysqldump -u${DB_USER} -p${DB_PASSWORD} ${DB_NAME} > ${BACKUP_FILE}

# 오래된 백업 파일 삭제 (7일 이상된 파일 삭제)
find ${BACKUP_DIR} -type f -name "*.sql" -mtime +7 -exec rm {} \;

# chmod +x /usr/local/bin/backup_mariadb.sh

# 크론 작업 설정
# crontab -e
# 0 4 * * * docker exec mariadb custom_mariadb/backup_mariadb.sh

# 스크립트 정상 실행 여부 확인
# ./backup_mariadb.sh

