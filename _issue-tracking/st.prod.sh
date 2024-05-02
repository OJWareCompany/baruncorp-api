#!/bin/bash
# 현재 날짜와 시간을 MM-DD_hh-mm-ss 형태로 포맷팅
current_time=$(date +"%m-%d_%H-%M-%S")
# 로그 파일과 JSON 결과 파일의 경로와 이름 설정
log_filename="./_issue-tracking/artillery_results/results_$current_time.log"
json_filename="./_issue-tracking/artillery_results/results_$current_time.json"

# Artillery 실행 및 결과 로그 저장 및 콘솔에 출력, JSON 결과 저장
artillery run -e production stress-test.yml --output $json_filename | tee $log_filename 2>&1
