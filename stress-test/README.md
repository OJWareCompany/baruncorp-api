### 실행하는법

```
./stress-test/stg.sh
./stress-test/stso.sh
```

---

### 로그 관련 명령어

10시부터 11시까지의 로그만 추출

```
grep -E "09/Apr/2024:(10|11)" ./access.log > filter-logs.log
```

OPTION 필터링

```
grep -v "OPTIONS" ./filter-logs-10AM.log > filter-logs-10AM-without-options.log
```

로그 필터

```
awk '{print $1 $6 $7}' ./filter-logs-10AM-without-options.log | sort | uniq -c | sort -nr
```
