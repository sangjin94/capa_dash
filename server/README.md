# gaon(WMS) 재고 연동 중계 서버

브라우저에서 gaon을 직접 호출할 수 없어(CORS + 세션 인증) 이 서버가 중계한다.
앱과 API를 같은 출처로 제공하므로 CORS 문제가 없다.

## 실행

```
cd C:\Users\HanEx\Desktop\capa_dash
set GAON_ID=사번
set GAON_PW=비밀번호
py server\serve.py
```

브라우저에서 http://localhost:5180 접속 → 3D 점유도 → 랙 배치 편집 → **🔄 gaon 재고**

## 엔드포인트

- `GET /api/gaon/status` — 연동 준비 상태(자격증명 설정 여부)
- `GET /api/gaon/inventory?warehouse=0000200&market=2151&date=20260730`
  - `warehouse` WMS 창고코드 (남이천1센터 = 0000200)
  - `market` 화주코드 (예: 2151 = 바이오포트코리아). 비우면 센터 전체
  - `date` 기준일 YYYYMMDD (기본: 오늘)

## 연동 대상 (HAR 분석 결과)

- `POST /hanex/ex/login.do` — sCompanyCd / sUserId / sUserPw
- `POST /hanex//dynamicService.do` — 서비스 `Wms.Inventory.P000000430_stock02_S`
- 응답 Dataset `dsList02` (35컬럼). 사용 컬럼:
  - `CELLDESCR` 셀코드 (존-랙열-베이-단, 예 `06-01-01-40`)
  - `N_QTY`/`QTY` 수량, `STOCKDESCR` 품목명, `SUPPLIERDESCR` 화주명

셀코드의 단(4번째)이 10/20/30/40 형식이라 앱의 랙 셀 매칭 규칙과 그대로 맞는다.
랙 속성의 **셀 접두**에 `06-01` 처럼 넣으면 실재고가 3D에 반영된다.

## 주의

- 자격증명은 서버 프로세스 환경변수에만 두고 코드/브라우저로 보내지 않는다.
- 이 조회는 gaon에 감사 로그(사번·IP)를 남긴다. 자동화 전 전산팀 승인 권장.
