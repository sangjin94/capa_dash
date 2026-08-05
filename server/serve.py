"""capa_dash 로컬 서버 + gaon 재고 연동 중계.

실행:
  set GAON_ID=사번
  set GAON_PW=비밀번호
  py server\serve.py            (기본 포트 5180)

- 정적 파일(index.html 등)은 이 서버가 그대로 제공 → 앱과 API가 같은 출처라 CORS 문제 없음
- 재고 API:  GET /api/gaon/inventory?warehouse=0000200&market=2151&date=20260730
- 상태 확인:  GET /api/gaon/status
자격증명은 이 서버 프로세스의 환경변수에만 있고, 브라우저로 나가지 않는다.
"""

import hmac
import http.cookies
import json
import os
import secrets
import sys
import threading
import traceback
from datetime import date
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs, unquote

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "server"))
import gaon_client as gaon  # noqa: E402
import store  # noqa: E402

PORT = int(os.environ.get("PORT", "5180"))
# 혼자 쓸 때는 localhost만, 동료와 함께 쓸 때는 0.0.0.0 으로 열어 외부 접속을 받는다
HOST = os.environ.get("HOST", "127.0.0.1")
# 공통 암호 — 설정하면 접속 시 1회 입력해야 API를 쓸 수 있다. 비우면 잠금 없음
APP_PASSWORD = os.environ.get("APP_PASSWORD", "")
COOKIE = "hxsid"

# 로그인 세션은 이 프로세스 메모리에만 둔다 (비밀번호는 저장하지 않는다)
SESSION = gaon.Session()

# 공통 암호 통과한 브라우저 토큰 (프로세스 메모리, 재시작하면 모두 재로그인)
_tokens = set()
_tokens_lock = threading.Lock()


def _issue_token():
    t = secrets.token_urlsafe(24)
    with _tokens_lock:
        _tokens.add(t)
    return t


def _valid_token(t):
    with _tokens_lock:
        return bool(t) and t in _tokens


def _ensure_session():
    """환경변수에 자격증명이 있으면 자동 로그인(없으면 앱에서 로그인)."""
    if SESSION.alive:
        return True
    uid, pw = os.environ.get("GAON_ID"), os.environ.get("GAON_PW")
    if uid and pw:
        SESSION.login(os.environ.get("GAON_COMPANY", "100"), uid, pw)
        return True
    return False


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def log_message(self, fmt, *args):  # 조용한 로그
        sys.stderr.write("%s - %s\n" % (self.log_date_time_string(), fmt % args))

    def _json(self, obj, status=200, cookie=None):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        if cookie:
            self.send_header("Set-Cookie", cookie)
        self.end_headers()
        self.wfile.write(body)

    def _body(self, limit=32 * 1024 * 1024):
        n = int(self.headers.get("Content-Length") or 0)
        if n > limit:
            raise ValueError("요청 본문이 너무 큽니다")
        return json.loads(self.rfile.read(n) or b"{}")

    def _authed(self):
        """공통 암호를 안 걸었으면 항상 통과, 걸었으면 쿠키 토큰을 확인한다."""
        if not APP_PASSWORD:
            return True
        raw = self.headers.get("Cookie") or ""
        try:
            jar = http.cookies.SimpleCookie(raw)
        except http.cookies.CookieError:
            return False
        m = jar.get(COOKIE)
        return _valid_token(m.value if m else "")

    def _who(self):
        # 한글 이름은 인코딩되어 오므로 되돌린다
        raw = (self.headers.get("X-Editor") or "").strip()
        try:
            return unquote(raw)[:40]
        except Exception:
            return raw[:40]

    def _guard(self):
        """API 접근 차단. 막았으면 True 를 돌려준다."""
        if self._authed():
            return False
        self._json({"ok": False, "needPassword": True, "error": "접속 암호가 필요합니다."}, 401)
        return True

    def do_GET(self):
        u = urlparse(self.path)
        # ── 접속 암호 ────────────────────────────────────────────────────
        if u.path == "/api/auth/status":
            return self._json({"ok": True, "needPassword": bool(APP_PASSWORD), "authed": self._authed()})
        if u.path == "/api/auth/logout":
            raw = self.headers.get("Cookie") or ""
            try:
                m = http.cookies.SimpleCookie(raw).get(COOKIE)
                if m:
                    with _tokens_lock:
                        _tokens.discard(m.value)
            except http.cookies.CookieError:
                pass
            return self._json({"ok": True}, cookie=f"{COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax")

        # ── 공유 저장소 ──────────────────────────────────────────────────
        if u.path == "/api/store":
            if self._guard():
                return
            return self._json({"ok": True, **store.snapshot()})
        if u.path == "/api/store/revs":
            if self._guard():
                return
            return self._json({"ok": True, "revs": store.revs()})
        if u.path == "/api/store/stats":
            if self._guard():
                return
            return self._json({"ok": True, **store.stats()})

        if u.path.startswith("/api/") and self._guard():
            return
        if u.path == "/api/gaon/status":
            return self._json(
                {
                    "ok": True,
                    "loggedIn": SESSION.alive,
                    "userId": SESSION.user_id if SESSION.alive else "",
                    "hasEnvCredentials": bool(os.environ.get("GAON_ID") and os.environ.get("GAON_PW")),
                    "base": gaon.BASE,
                    "service": "Wms.Inventory.P000000430_stock02_S",
                }
            )
        if u.path == "/api/gaon/logout":
            SESSION.opener = None
            SESSION.user_id = ""
            return self._json({"ok": True})
        if u.path == "/api/gaon/inventory":
            q = parse_qs(u.query)
            wh = (q.get("warehouse") or [""])[0].strip()
            mk = (q.get("market") or [""])[0].strip()
            today = date.today().strftime("%Y%m%d")
            d_to = (q.get("date") or [today])[0].strip()
            d_fr = (q.get("dateFrom") or [d_to])[0].strip()
            if not wh:
                return self._json({"ok": False, "error": "warehouse(센터코드)가 필요합니다."}, 400)
            try:
                if not _ensure_session():
                    return self._json({"ok": False, "needLogin": True, "error": "gaon 로그인이 필요합니다."}, 401)
                res = SESSION.inventory(wh, mk, d_fr, d_to)
                return self._json(
                    {
                        "ok": True,
                        "warehouse": wh,
                        "market": mk,
                        "date": d_to,
                        "rowCount": res["rowCount"],
                        "cellCount": res["inventory"]["cellCount"],
                        "totalPlt": res["inventory"].get("totalPlt", 0),
                        "inventory": res["inventory"],
                        "prefixes": res["summary"]["prefixes"],
                        "byCustomer": res["summary"]["byCustomer"],
                    }
                )
            except Exception as e:
                traceback.print_exc()
                need = "로그인" in str(e)
                return self._json({"ok": False, "needLogin": need, "error": str(e)}, 401 if need else 502)
        return super().do_GET()

    def do_PUT(self):
        u = urlparse(self.path)
        if u.path == "/api/store":
            if self._guard():
                return
            try:
                body = self._body()
                res = store.apply(body.get("changes") or [], by=self._who() or str(body.get("by") or ""))
                return self._json({"ok": True, **res})
            except Exception as e:
                traceback.print_exc()
                return self._json({"ok": False, "error": str(e)}, 400)
        self.send_error(404)

    def do_POST(self):
        u = urlparse(self.path)
        if u.path == "/api/auth/login":
            try:
                pw = str(self._body(limit=4096).get("pw") or "")
            except Exception:
                pw = ""
            if not APP_PASSWORD:
                return self._json({"ok": True, "needPassword": False})
            if not pw or not hmac.compare_digest(pw, APP_PASSWORD):
                return self._json({"ok": False, "error": "암호가 맞지 않습니다."}, 401)
            tok = _issue_token()
            return self._json({"ok": True}, cookie=f"{COOKIE}={tok}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800")

        if u.path.startswith("/api/") and self._guard():
            return

        if u.path == "/api/gaon/login":
            try:
                body = self._body(limit=8192)
                uid = str(body.get("id") or "").strip()
                pw = str(body.get("pw") or "")
                company = str(body.get("company") or os.environ.get("GAON_COMPANY", "100")).strip()
                if not uid or not pw:
                    return self._json({"ok": False, "error": "사번과 비밀번호가 필요합니다."}, 400)
                SESSION.login(company, uid, pw)
                # 비밀번호는 어디에도 저장하지 않는다 (세션 쿠키만 메모리에 유지)
                return self._json({"ok": True, "userId": uid})
            except Exception as e:
                return self._json({"ok": False, "error": str(e)}, 401)
        self.send_error(404)


if __name__ == "__main__":
    # 한국어 Windows 콘솔(cp949)은 일부 문자를 못 찍어 print 하나에 서버가 죽는다.
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8", errors="replace")
        except (AttributeError, ValueError):
            pass
    creds = bool(os.environ.get("GAON_ID") and os.environ.get("GAON_PW"))
    st = store.stats()
    where = "localhost 전용" if HOST in ("127.0.0.1", "localhost") else f"{HOST} (외부 접속 허용)"
    print(f"capa_dash 서버 → http://localhost:{PORT}   [{where}]")
    print(f"  정적 폴더: {ROOT}")
    print(f"  공유 저장소: {st['path']}  (키 {st['keys']}개 · {st['bytes']:,} bytes)")
    print(f"  접속 암호: {'설정됨' if APP_PASSWORD else '없음 (APP_PASSWORD 미설정, 아무나 접속 가능)'}")
    print(f"  gaon 자격증명: {'설정됨' if creds else '없음 (앱에서 직접 로그인)'}")
    if HOST not in ("127.0.0.1", "localhost") and not APP_PASSWORD:
        print("  ! 외부 접속을 열어두고 암호가 없습니다. APP_PASSWORD 를 설정하세요.")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
