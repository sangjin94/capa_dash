# capa_dash 서버

정적 파일 제공 + gaon(WMS) 재고 중계 + **여러 명이 함께 쓰는 공유 저장소**를 한 프로세스가 담당한다.
앱과 API가 같은 출처라 CORS 문제가 없다.

## 실행

```bash
# 혼자 쓸 때 (지금까지와 동일)
py server/serve.py                       # http://localhost:5180

# 동료와 함께 쓸 때
set HOST=0.0.0.0
set APP_PASSWORD=공통암호
py server/serve.py
```

| 환경변수 | 기본값 | 설명 |
|---|---|---|
| `PORT` | `5180` | 포트 |
| `HOST` | `127.0.0.1` | `0.0.0.0` 으로 두면 외부 접속 허용 |
| `APP_PASSWORD` | (없음) | 설정하면 접속 시 공통 암호 1회 입력. **외부 공개 시 필수** |
| `GAON_ID` / `GAON_PW` | (없음) | 설정하면 gaon 자동 로그인. 없으면 앱에서 직접 로그인 |
| `GAON_COMPANY` | `100` | gaon 회사코드 |

## 함께 작업하기 (공유 저장소)

도면 배치·재고·미전산·수기 CAPA를 서버에 보관해 접속한 사람 모두가 같은 자료를 본다.

- 접속하면 서버 자료를 자동으로 받아온다
- 편집하면 1.2초 뒤 바뀐 부분만 서버로 올라간다
- 15초마다 동료의 변경을 확인해 자동 반영한다 (내가 지금 고치는 중인 부분은 건드리지 않고 알림만)
- 사이드바 하단에 동기화 상태가 표시된다. 눌러서 작업자 이름을 바꿀 수 있다

### 충돌은 이렇게 처리한다

상태를 **키 단위**로 쪼개 저장한다.

```
rackLayouts/남이천1센터||지상2층     ← 층 하나의 배치
floorplans/남이천1센터               ← 도면 이미지·배경 설정
inventory/남이천1센터                ← gaon 재고 스냅샷
offbook/남이천1센터                  ← 미전산재고
records/남이천1센터||보관공간||일반   ← 수기 CAPA
misc                                 ← 센터 목록·분류 마스터 등 공통 설정
```

- **서로 다른 층을 작업하면 키가 달라 충돌이 없다.** 둘이 동시에 도면을 그려도 된다
- 같은 층을 동시에 고치면 나중에 저장하는 쪽에 경고가 뜨고 `서버 것 받기` / `내 것으로 덮어쓰기` 를 고른다
- 화면 접기·이름표 표시 같은 **개인 설정은 공유하지 않는다** (사람마다 다르게 유지)

### 저장 위치

```
server/data/state.json          현재 자료
server/data/backups/            저장 직전 스냅샷 30개 (자동 순환)
```

`server/data/` 는 git에 올라가지 않는다. **백업은 이 폴더를 통째로 복사**하면 된다.

## Lightsail 배포

```bash
# 1) 코드 받기
sudo apt update && sudo apt install -y python3 git
git clone https://github.com/sangjin94/capa_dash.git
cd capa_dash

# 2) 서비스 등록
sudo tee /etc/systemd/system/capa_dash.service > /dev/null <<'UNIT'
[Unit]
Description=capa_dash
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/capa_dash
Environment=HOST=0.0.0.0
Environment=PORT=5180
Environment=APP_PASSWORD=여기에_공통암호
ExecStart=/usr/bin/python3 server/serve.py
Restart=always

[Install]
WantedBy=multi-user.target
UNIT

sudo systemctl daemon-reload
sudo systemctl enable --now capa_dash
sudo systemctl status capa_dash
```

Lightsail 콘솔의 **네트워킹 → 방화벽**에서 해당 포트를 열어야 접속된다.

### 배포 시 반드시 확인할 것

1. **HTTPS를 붙일 것.** 그냥 열면 공통 암호와 gaon 사번·비밀번호가 평문으로 오간다.
   nginx + Let's Encrypt로 앞단을 감싸고 5180은 외부에 직접 열지 않는 것을 권장한다.

   ```nginx
   server {
     listen 443 ssl;
     server_name capa.example.com;
     ssl_certificate     /etc/letsencrypt/live/capa.example.com/fullchain.pem;
     ssl_certificate_key /etc/letsencrypt/live/capa.example.com/privkey.pem;
     client_max_body_size 64m;          # 도면 이미지 업로드
     location / { proxy_pass http://127.0.0.1:5180; proxy_set_header Host $host; }
   }
   ```
   이때 `HOST=127.0.0.1` 로 되돌리고 방화벽은 443만 연다.

2. **gaon 자격증명이 외부 서버를 거친다.** `GAON_ID`/`GAON_PW`를 서버에 두지 말고
   필요한 사람이 앱에서 직접 로그인하도록 두는 편이 낫다(비밀번호는 서버 메모리에만 남고 저장되지 않는다).
   사내 규정상 곤란하면 gaon 연동은 사내 PC에서만 쓰고 Lightsail은 도면 작업용으로만 쓰면 된다.

3. **`server/data/` 를 주기적으로 백업**할 것. 도면 작업 결과가 전부 이 안에 있다.

## API

### 인증
- `POST /api/auth/login` `{pw}` → 세션 쿠키 발급
- `GET  /api/auth/status` → `{needPassword, authed}`
- `GET  /api/auth/logout`

### 공유 저장소 (인증 필요)
- `GET /api/store` → 전체 `{entries: {키: {rev, updatedAt, by, data}}}`
- `GET /api/store/revs` → 키별 rev만 (폴링용)
- `GET /api/store/stats` → 키 수·용량·최종 수정 시각
- `PUT /api/store` `{changes: [{key, rev, data}]}` → `{applied, conflicts}`
  - `rev`가 서버와 다르면 그 키는 `conflicts`로 반환되고 반영되지 않는다
  - `data: null`은 삭제, `rev` 생략은 강제 덮어쓰기

### gaon 재고 (인증 필요)
- `GET /api/gaon/status` — 로그인 상태
- `POST /api/gaon/login` `{id, pw}` — 비밀번호는 저장하지 않고 세션만 메모리에 유지
- `GET /api/gaon/logout`
- `GET /api/gaon/inventory?warehouse=0000200&market=2151&date=20260730`
  - `warehouse` WMS 창고코드 (남이천1센터 = `0000200`)
  - `market` 화주코드 (비우면 센터 전체)
  - `date` 기준일 `YYYYMMDD`

## gaon 연동 대상 (HAR 분석 결과)

- `POST /hanex/ex/login.do` — `sCompanyCd` / `sUserId` / `sUserPwd`
- `POST /hanex//dynamicService.do` — 서비스 `Wms.Inventory.P000000430_stock02_S`
- 응답 Dataset `dsList02` (35컬럼). 사용 컬럼:
  - `CELLDESCR` 셀코드 (존-랙열-베이-단, 예 `06-01-01-40`)
  - `N_QTY`/`QTY` 수량, `PALLET_ENTRY_QUANTITY` 파렛트 입수 (PLT 환산에 사용)
  - `STOCKDESCR` 품목명, `SUPPLIERDESCR` 화주명

셀코드의 단(4번째)이 10/20/30/40 형식이라 앱의 랙 셀 매칭 규칙과 그대로 맞는다.
랙 속성의 **셀 접두**에 `06-01` 처럼 넣으면 실재고가 3D에 반영된다.

## 주의

- 자격증명은 서버 프로세스 환경변수에만 두고 코드/브라우저로 보내지 않는다.
- 이 조회는 gaon에 감사 로그(사번·IP)를 남긴다. 자동화 전 전산팀 승인 권장.
