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

import json
import os
import sys
import traceback
from datetime import date
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "server"))
import gaon_client as gaon  # noqa: E402

PORT = int(os.environ.get("PORT", "5180"))


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def log_message(self, fmt, *args):  # 조용한 로그
        sys.stderr.write("%s - %s\n" % (self.log_date_time_string(), fmt % args))

    def _json(self, obj, status=200):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        u = urlparse(self.path)
        if u.path == "/api/gaon/status":
            return self._json(
                {
                    "ok": True,
                    "hasCredentials": bool(os.environ.get("GAON_ID") and os.environ.get("GAON_PW")),
                    "base": gaon.BASE,
                    "service": "Wms.Inventory.P000000430_stock02_S",
                }
            )
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
                res = gaon.fetch_inventory(wh, mk, d_fr, d_to)
                return self._json(
                    {
                        "ok": True,
                        "warehouse": wh,
                        "market": mk,
                        "date": d_to,
                        "rowCount": res["rowCount"],
                        "cellCount": res["inventory"]["cellCount"],
                        "inventory": res["inventory"],
                        "prefixes": res["summary"]["prefixes"],
                        "byCustomer": res["summary"]["byCustomer"],
                    }
                )
            except Exception as e:
                traceback.print_exc()
                return self._json({"ok": False, "error": str(e)}, 502)
        return super().do_GET()


if __name__ == "__main__":
    creds = bool(os.environ.get("GAON_ID") and os.environ.get("GAON_PW"))
    print(f"capa_dash 서버 → http://localhost:{PORT}")
    print(f"  정적 폴더: {ROOT}")
    print(f"  gaon 자격증명: {'설정됨' if creds else '없음 (GAON_ID / GAON_PW 환경변수 설정 필요)'}")
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
