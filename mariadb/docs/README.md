### root 비밀번호를 수정할 때 Host별로 비밀번호가 다르게 설정 될 수 있다.

![alt text](image-1.png)

### 데일리 백업 crontab 설정

백업 스크립트 권한 설정하기

```sh
chmod +x /usr/local/bin/backup_mariadb.sh
```

```sh
crontab -e
```

```sh
0 4 * * * docker exec -i mariadb custom_mariadb/backup_mariadb.sh >> /home/api/baruncorp-api/backup/mariadb_backup.log 2>&1
```

백업 파일 저장되는 곳
/home/api/baruncorp-api/backup

/home/api/baruncorp-api 경로에 .env파일 생성
MARIADB_ROOT_PASSWORD=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=
