"""gaon(WMS) 재고 조회 클라이언트 — Nexacro dynamicService.do 연동.

- 로그인: POST /hanex/ex/login.do  (sCompanyCd / sUserId / sUserPw)
- 재고조회: POST /hanex//dynamicService.do  서비스 Wms.Inventory.P000000430_stock02_S
- 응답: Dataset dsList02 (셀별 재고). CELLDESCR = 존-랙열-베이-단

자격증명은 코드에 넣지 않는다. 환경변수로만 받는다.
  GAON_COMPANY (기본 100) / GAON_ID / GAON_PW
"""

import os
import re
import gzip
import io
import json
import urllib.request
import urllib.error
import http.cookiejar

BASE = os.environ.get("GAON_BASE", "https://gaon.hanex.co.kr")
LOGIN_URL = BASE + "/hanex/ex/login.do"
SERVICE_URL = BASE + "/hanex//dynamicService.do"
NS = "http://www.nexacroplatform.com/platform/dataset"

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158 Safari/537.36"


def _opener():
    jar = http.cookiejar.CookieJar()
    return urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar)), jar


def _post(opener, url, body, timeout=30):
    req = urllib.request.Request(
        url,
        data=body.encode("utf-8"),
        method="POST",
        headers={
            "Content-Type": "text/xml",
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate",
            "Origin": BASE,
            "Referer": BASE + "/",
            "User-Agent": UA,
            "X-Requested-With": "XMLHttpRequest",
        },
    )
    with opener.open(req, timeout=timeout) as res:
        raw = res.read()
        if res.headers.get("Content-Encoding") == "gzip":
            raw = gzip.decompress(raw)
        return res.status, raw.decode("utf-8", "replace")


def _esc(v):
    return (
        str(v)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def login_body(company, user_id, user_pw):
    """실제 로그인 폼(frmLogin.xfdl.js)과 동일한 파라미터 구성.
    sUserPwd 는 입력값 그대로 전송한다(클라이언트 암호화 없음).
    """
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        f'<Root xmlns="{NS}">\n'
        "  <Parameters>\n"
        f'    <Parameter id="sCompanyCd">{_esc(company)}</Parameter>\n'
        f'    <Parameter id="sUserId">{_esc(user_id)}</Parameter>\n'
        f'    <Parameter id="sUserPwd">{_esc(user_pw)}</Parameter>\n'
        '    <Parameter id="sDomain">ko_KR</Parameter>\n'
        '    <Parameter id="sWebViewType">desktop</Parameter>\n'
        '    <Parameter id="__tcsFormId">frmLogin</Parameter>\n'
        "  </Parameters>\n"
        "</Root>"
    )


def inventory_body(warehouse, market, date_fr, date_to, cell="", item=""):
    """P000000430(재고현황) 조회 요청 XML. HAR에서 확인한 구조를 그대로 사용."""
    cols = [
        "CELL", "WAREHOUSE_CODE", "ITEM_CODE", "LOTABLE1", "MARKET_CODE",
        "PLOT", "DATE_FR", "DATE_TO", "LOTABLE2", "OTHER_COMPANY_BRAND",
    ]
    vals = {
        "CELL": cell, "WAREHOUSE_CODE": warehouse, "ITEM_CODE": item, "LOTABLE1": "",
        "MARKET_CODE": market, "PLOT": "", "DATE_FR": date_fr, "DATE_TO": date_to,
        "LOTABLE2": "", "OTHER_COMPANY_BRAND": "",
    }
    coldefs = "\n".join(
        f'        <Column id="{c}" type="string" size="256" />' for c in cols
    )
    rowvals = "\n".join(
        (f'        <Col id="{c}">{_esc(vals[c])}</Col>' if vals[c] != "" else f'        <Col id="{c}" />')
        for c in cols
    )
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        f'<Root xmlns="{NS}">\n'
        "  <Parameters />\n"
        '  <Dataset id="dsService">\n'
        "    <ColumnInfo>\n"
        '      <Column id="name" type="string" size="256" />\n'
        '      <Column id="inMapping" type="string" size="256" />\n'
        '      <Column id="inputDataset" type="string" size="256" />\n'
        '      <Column id="outMapping" type="string" size="256" />\n'
        '      <Column id="strParam" type="string" size="256" />\n'
        '      <Column id="useRowType" type="string" size="256" />\n'
        '      <Column id="condition" type="string" size="256" />\n'
        "    </ColumnInfo>\n"
        "    <Rows>\n"
        "      <Row>\n"
        '        <Col id="name">Wms.Inventory.P000000430_stock02_S</Col>\n'
        '        <Col id="inMapping">dsSearch=dsSearch&#32;gdsComIn=gdsComIn</Col>\n'
        '        <Col id="inputDataset">dsSearch=dsSearch&#32;gdsComIn=gdsComIn</Col>\n'
        '        <Col id="outMapping">dsList02=dsList</Col>\n'
        '        <Col id="strParam" />\n'
        '        <Col id="useRowType">rowType</Col>\n'
        '        <Col id="condition" />\n'
        "      </Row>\n"
        "    </Rows>\n"
        "  </Dataset>\n"
        '  <Dataset id="dsServiceOption">\n'
        '    <ColumnInfo><Column id="mybatisExecutorType" type="string" size="256" /></ColumnInfo>\n'
        '    <Rows><Row><Col id="mybatisExecutorType">simple</Col></Row></Rows>\n'
        "  </Dataset>\n"
        '  <Dataset id="dsSearch">\n'
        "    <ColumnInfo>\n" + coldefs + "\n    </ColumnInfo>\n"
        "    <Rows>\n      <Row>\n" + rowvals + "\n      </Row>\n    </Rows>\n"
        "  </Dataset>\n"
        "</Root>"
    )


# ── 응답 파싱 ────────────────────────────────────────────────────────────────
def _unesc(v):
    return (
        v.replace("&#32;", " ")
        .replace("&amp;", "&")
        .replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&quot;", '"')
        .strip()
    )


def parse_inventory(xml_text, dataset="dsList02"):
    """dsList02 → [{컬럼: 값}]"""
    i = xml_text.find(f'<Dataset id="{dataset}">')
    if i < 0:
        return [], []
    seg = xml_text[i:]
    end = seg.find("</Dataset>")
    if end > 0:
        seg = seg[: end + len("</Dataset>")]
    ci = re.search(r"<ColumnInfo>(.*?)</ColumnInfo>", seg, re.S)
    cols = re.findall(r'<Column id="([^"]+)"', ci.group(1)) if ci else []
    rows = []
    for rm in re.finditer(r"<Row>(.*?)</Row>", seg, re.S):
        kv = {}
        for cm in re.finditer(r'<Col id="([^"]+)"\s*(?:/>|>(.*?)</Col>)', rm.group(1), re.S):
            kv[cm.group(1)] = _unesc(cm.group(2) or "")
        rows.append({c: kv.get(c, "") for c in cols})
    return cols, rows


def parse_ssv_error(text):
    """SSV 응답 → (code, msg). 정상 XML이면 (None, None).

    두 가지 형태가 모두 온다:
      성공: SSV:utf-8ErrorCode=0ErrorMsg=SUCC...
      오류: SSV:utf-8ErrorCode:string=-2ErrorMsg:string=로그인 정보가 없습니다.
    """
    if not text.startswith("SSV:"):
        return None, None
    code = re.search(r"ErrorCode(?::string)?=(-?\d+)", text)
    msg = re.search(r"ErrorMsg(?::string)?=([^\x00-\x1f]*)", text)
    return (code.group(1) if code else "?"), (msg.group(1).strip() if msg else "")


def to_app_inventory(rows, file_name="gaon 연동"):
    """capa_dash가 쓰는 재고 구조로 변환 — xlsx 업로드와 동일한 형식.
    {fileName, importedAt, rows, cellCount, cells:{코드:{q,n,d,c}}}
    """
    from datetime import datetime, timezone

    cells = {}
    used = 0
    for r in rows:
        code = (r.get("CELLDESCR") or "").strip()
        if not code:
            continue

        def num(key):
            try:
                return int(float(r.get(key) or 0))
            except ValueError:
                return 0

        q = num("N_QTY") or num("QTY")
        descr = (r.get("STOCKDESCR") or "").strip()
        owner = (r.get("SUPPLIERDESCR") or "").strip()
        c = cells.setdefault(code, {"q": 0, "n": 0, "d": descr, "c": owner})
        c["q"] += q
        c["n"] += 1
        if not c["d"] and descr:
            c["d"] = descr
        if not c["c"] and owner:
            c["c"] = owner
        used += 1
    return {
        "fileName": file_name,
        "importedAt": datetime.now(timezone.utc).isoformat(),
        "rows": used,
        "cellCount": len(cells),
        "cells": cells,
    }


def to_cell_inventory(rows):
    """셀별 집계 → capa_dash가 쓰는 형태.

    CELLDESCR = 존-랙열-베이-단 (예: 06-01-01-40)
    반환: {cells: {셀코드: {qty, items, customer}}, prefixes: {존-랙열: 셀수}, byCustomer: {...}}
    """
    cells = {}
    prefixes = {}
    by_customer = {}
    for r in rows:
        code = (r.get("CELLDESCR") or "").strip()
        if not code:
            continue
        qty = 0
        for k in ("QTY", "N_QTY"):
            try:
                qty = int(float(r.get(k) or 0))
                if qty:
                    break
            except ValueError:
                qty = 0
        cust = r.get("SUPPLIERDESCR") or r.get("SUPPLIER") or ""
        c = cells.setdefault(code, {"qty": 0, "items": 0, "customer": cust})
        c["qty"] += qty
        c["items"] += 1
        parts = code.split("-")
        if len(parts) == 4:
            prefixes[f"{parts[0]}-{parts[1]}"] = prefixes.get(f"{parts[0]}-{parts[1]}", 0) + 1
        if cust:
            by_customer[cust] = by_customer.get(cust, 0) + qty
    return {"cells": cells, "prefixes": prefixes, "byCustomer": by_customer}


class Session:
    """로그인된 gaon 세션 — 서버 메모리에만 보관(디스크·브라우저 저장 안 함)."""

    def __init__(self):
        self.opener = None
        self.jar = None
        self.user_id = ""

    @property
    def alive(self):
        return self.opener is not None

    def login(self, company, user_id, user_pw):
        opener, jar = _opener()
        st, body = _post(opener, LOGIN_URL, login_body(company, user_id, user_pw))
        code, msg = parse_ssv_error(body)
        if code not in (None, "0"):
            # gaon이 코드만 반환하는 경우(M0011 등)가 있어 안내를 덧붙인다
            if not msg or re.fullmatch(r"[A-Z]\d{3,6}", msg):
                msg = f"사번 또는 비밀번호를 확인하세요 (gaon 응답: {msg or code})"
            raise RuntimeError(msg)
        self.opener, self.jar, self.user_id = opener, jar, user_id
        return {"status": st, "cookies": [c.name for c in jar]}

    def inventory(self, warehouse, market, date_fr, date_to):
        if not self.alive:
            raise RuntimeError("로그인이 필요합니다.")
        st, inv = _post(self.opener, SERVICE_URL, inventory_body(warehouse, market, date_fr, date_to))
        code, msg = parse_ssv_error(inv)
        if code not in (None, "0"):
            # 세션 만료 시 다시 로그인하도록 알림
            if code == "-2":
                self.opener = None
            raise RuntimeError(msg or f"재고조회 실패 (code={code})")
        cols, rows = parse_inventory(inv)
        return {
            "status": st,
            "columns": cols,
            "rowCount": len(rows),
            "inventory": to_app_inventory(rows, f"gaon {warehouse}/{market or '전체'} {date_to}"),
            "summary": to_cell_inventory(rows),
        }


def fetch_inventory(warehouse, market, date_fr, date_to, company=None, user_id=None, user_pw=None):
    """로그인 → 재고조회 → 파싱. 자격증명은 인자 또는 환경변수."""
    company = company or os.environ.get("GAON_COMPANY", "100")
    user_id = user_id or os.environ.get("GAON_ID", "")
    user_pw = user_pw or os.environ.get("GAON_PW", "")
    if not user_id or not user_pw:
        raise RuntimeError("자격증명이 없습니다. 환경변수 GAON_ID / GAON_PW 를 설정하세요.")
    opener, jar = _opener()
    st, body = _post(opener, LOGIN_URL, login_body(company, user_id, user_pw))
    code, msg = parse_ssv_error(body)
    if code not in (None, "0"):
        raise RuntimeError(f"로그인 실패: {msg} (code={code})")
    st2, inv = _post(opener, SERVICE_URL, inventory_body(warehouse, market, date_fr, date_to))
    code2, msg2 = parse_ssv_error(inv)
    if code2 not in (None, "0"):
        raise RuntimeError(f"재고조회 실패: {msg2} (code={code2})")
    cols, rows = parse_inventory(inv)
    return {
        "loginStatus": st,
        "status": st2,
        "cookies": [c.name for c in jar],
        "columns": cols,
        "rowCount": len(rows),
        "inventory": to_app_inventory(rows, f"gaon {warehouse}/{market} {date_to}"),
        "summary": to_cell_inventory(rows),
    }
