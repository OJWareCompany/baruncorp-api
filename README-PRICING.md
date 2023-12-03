가격 자동 입력 테스트

테스트 해야하는 것

1. New Residential
   1. 설정된 할인가가 있다면 주문시 가격 0원
   2. 설정된 할인가가 없다면 기본 가격으로 자동 입력됨
   3. Mounting Type에 따라 가격이 달라진다.
2. Residential Revision
   1. Free Revision
      1. n회 이후부터 설정가격 적용되는지 확인하기
   2. Not Free Revision
      1. 주문시 자동 입력 안됨
      2. 조직에 설정된 가격 (Major 선택시)
      3. 기본 가격 (Major 선택시)
      4. Mounting Type에 따라 가격이 달라진다.
3. Commercial New
   1. 조직에 설정된 가격있으면 적용
   2. Mounting Type에 따라 가격이 달라진다.
   3. System Size에 따라 가격이 달라진다.
4. Commercial Revision
   1. 소요시간 입력하면 가격이 자동 입력 됨
5. Fixed Price

---

준비

1. 서비스별 기본 가격 설정
   1. S- PE는 New Res 고정가격으로 설정하기
   2. 커스텀 가격 없이 기본가격으로 설정되는것도 보기 위해서 커스텀 하나 지우기 (Shading Report)
2. 조직의 커스텀 가격 설정
   1. Normal, Special 두가지 조직

순서

1. Residential Project 생성 (Roof Mount, GM 각각 하나씩)
   1. 주문 (가격 입력된 것 확인)
   2. 주문 (가격 0원인 것 확인)
      1. Revision Major로 변경후 가격 확인
2. Commercial Project 생성 (50kW) (Roof Mount, GM 각각 하나씩)
   1. 주문 (가격 입력된 것 확인)
   2. 주문 (가격 0원인 것 확인)
      1. 태스크의 Duration 입력후 가격 확인
3. Fixed는 1,2번에서 바로 확인 가능 (Wet Stamp)
4. Barun Corp의 조직 설정에서 special pricing 설정 변경하기 (true, 3회)
   1. 주문후 free인지 확인
   2. free count 다 사용할때까지 주문

### Job 생성 API, 각각 두번씩 (Revision 확인을 위해)

참고: sql파일에서 프라이싱 테스트를 위한 쿼리를 입력한다.
Project Data또한 sql파일에 있다.
스탠다드 프라이싱 적용되는 것 확인을 위해서 일부 커스텀 프라이싱 제거해야할수있음 e.g 샤딩리포트는 커스텀 프라이싱 제거

Create RM Residential Job

```tsx
{
  "deliverablesEmails": ["chris@barun.com"],
  "clientUserId": "07ec8e89-6877-4fa1-a029-c58360b57f43",
  "additionalInformationFromClient": "please, check this out.",
  "systemSize": 50.1,
  "projectId": "d6935a65-2ec5-4df0-a8b5-a4e39f124d05",
  "mountingType": "Roof Mount",
  "taskIds": [
    {
      "serviceId": "e5d81943-3fef-416d-a85b-addb8be296c0",
      "description": "PV Design"
    },
		{
      "serviceId": "8a593d31-81ed-41b7-bec5-8d55f348cc05",
      "description": "Shading Report"
    },
    {
      "serviceId": "99ff64ee-fe47-4235-a026-db197628d077",
      "description": "S- PE Stamp"
    },
    {
      "serviceId": "5c29f1ae-d50b-4400-a6fb-b1a2c87126e9",
      "description": "E- PE Stamp"
    },
    {
      "serviceId": "0ce5a100-8b38-45fd-92a7-69e9aa7bd549",
      "description": "S- Wet Stamp"
    },
    {
      "serviceId": "2a2a256b-57a5-46f5-8cfb-1855cc29238a",
      "description": "This is not on the menu."
    }
  ],
  "mailingAddressForWetStamp": {
    "street1": "3480 Northwest 33rd Court",
    "street2": "A101",
    "city": "Lauderdale Lakes",
    "state": "Florida",
    "postalCode": "33309",
    "country": "United State",
    "fullAddress": "3480 Northwest 33rd Court, Lauderdale Lakes, Florida 33309",
    "coordinates": [
      -97.87,
      34
    ]
  },
  "numberOfWetStamp": 3,
  "isExpedited": false
}
```

GM Residential

```tsx
{
  "deliverablesEmails": ["chris@barun.com"],
  "clientUserId": "07ec8e89-6877-4fa1-a029-c58360b57f43",
  "additionalInformationFromClient": "please, check this out.",
  "systemSize": 50.1,
  "projectId": "fbb8d2ba-2579-437b-9173-4543a1b4b4dd",
  "mountingType": "Ground Mount",
  "taskIds": [
    {
      "serviceId": "e5d81943-3fef-416d-a85b-addb8be296c0",
      "description": "PV Design"
    },
		{
      "serviceId": "8a593d31-81ed-41b7-bec5-8d55f348cc05",
      "description": "Shading Report"
    },
    {
      "serviceId": "99ff64ee-fe47-4235-a026-db197628d077",
      "description": "S- PE Stamp"
    },
    {
      "serviceId": "5c29f1ae-d50b-4400-a6fb-b1a2c87126e9",
      "description": "E- PE Stamp"
    },
    {
      "serviceId": "0ce5a100-8b38-45fd-92a7-69e9aa7bd549",
      "description": "S- Wet Stamp"
    },
    {
      "serviceId": "2a2a256b-57a5-46f5-8cfb-1855cc29238a",
      "description": "This is not on the menu."
    }
  ],
  "mailingAddressForWetStamp": {
    "street1": "3480 Northwest 33rd Court",
    "street2": "A101",
    "city": "Lauderdale Lakes",
    "state": "Florida",
    "postalCode": "33309",
    "country": "United State",
    "fullAddress": "3480 Northwest 33rd Court, Lauderdale Lakes, Florida 33309",
    "coordinates": [
      -97.87,
      34
    ]
  },
  "numberOfWetStamp": 3,
  "isExpedited": false
}
```

RM Commercial Job

```tsx
{
  "deliverablesEmails": ["chris@barun.com"],
  "clientUserId": "07ec8e89-6877-4fa1-a029-c58360b57f43",
  "additionalInformationFromClient": "please, check this out.",
  "systemSize": 50.1,
  "projectId": "e106236a-9d46-4eca-9a32-8359184b8265",
  "mountingType": "Roof Mount",
  "taskIds": [
    {
      "serviceId": "e5d81943-3fef-416d-a85b-addb8be296c0",
      "description": "PV Design"
    },
		{
      "serviceId": "8a593d31-81ed-41b7-bec5-8d55f348cc05",
      "description": "Shading Report"
    },
    {
      "serviceId": "99ff64ee-fe47-4235-a026-db197628d077",
      "description": "S- PE Stamp"
    },
    {
      "serviceId": "5c29f1ae-d50b-4400-a6fb-b1a2c87126e9",
      "description": "E- PE Stamp"
    },
    {
      "serviceId": "0ce5a100-8b38-45fd-92a7-69e9aa7bd549",
      "description": "S- Wet Stamp"
    },
    {
      "serviceId": "2a2a256b-57a5-46f5-8cfb-1855cc29238a",
      "description": "This is not on the menu."
    }
  ],
  "mailingAddressForWetStamp": {
    "street1": "3480 Northwest 33rd Court",
    "street2": "A101",
    "city": "Lauderdale Lakes",
    "state": "Florida",
    "postalCode": "33309",
    "country": "United State",
    "fullAddress": "3480 Northwest 33rd Court, Lauderdale Lakes, Florida 33309",
    "coordinates": [
      -97.87,
      34
    ]
  },
  "numberOfWetStamp": 3,
  "isExpedited": false
}
```

GM Commercial

```tsx
{
  "deliverablesEmails": ["chris@barun.com"],
  "clientUserId": "07ec8e89-6877-4fa1-a029-c58360b57f43",
  "additionalInformationFromClient": "please, check this out.",
  "systemSize": 50.1,
  "projectId": "69b4f2e1-c40f-44ab-92de-5282322758d6",
  "mountingType": "Ground Mount",
  "taskIds": [
    {
      "serviceId": "e5d81943-3fef-416d-a85b-addb8be296c0",
      "description": "PV Design"
    },
		{
      "serviceId": "8a593d31-81ed-41b7-bec5-8d55f348cc05",
      "description": "Shading Report"
    },
    {
      "serviceId": "99ff64ee-fe47-4235-a026-db197628d077",
      "description": "S- PE Stamp"
    },
    {
      "serviceId": "5c29f1ae-d50b-4400-a6fb-b1a2c87126e9",
      "description": "E- PE Stamp"
    },
    {
      "serviceId": "0ce5a100-8b38-45fd-92a7-69e9aa7bd549",
      "description": "S- Wet Stamp"
    },
    {
      "serviceId": "2a2a256b-57a5-46f5-8cfb-1855cc29238a",
      "description": "This is not on the menu."
    }
  ],
  "mailingAddressForWetStamp": {
    "street1": "3480 Northwest 33rd Court",
    "street2": "A101",
    "city": "Lauderdale Lakes",
    "state": "Florida",
    "postalCode": "33309",
    "country": "United State",
    "fullAddress": "3480 Northwest 33rd Court, Lauderdale Lakes, Florida 33309",
    "coordinates": [
      -97.87,
      34
    ]
  },
  "numberOfWetStamp": 3,
  "isExpedited": false
}
```
