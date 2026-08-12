"""공유 저장소 — 여러 명이 같은 도면을 함께 작업하기 위한 서버측 상태 보관.

앱 상태를 통째로 하나로 두면 두 사람이 서로 다른 층을 만져도 매번 충돌한다.
그래서 '키 단위'로 쪼개 보관한다.

  rackLayouts/남이천1센터||지상2층   ← 층 하나의 랙 배치
  floorplans/남이천1센터            ← 도면 이미지·배경 설정
  inventory/남이천1센터             ← gaon 재고 스냅샷
  offbook/남이천1센터               ← 미전산재고
  records/남이천1센터||...          ← 수기 CAPA 입력
  misc                              ← 센터 목록·분류 마스터 등 공통 설정

키마다 rev(수정 횟수)를 두고, 저장 요청의 rev가 서버 rev와 다르면 거절한다(낙관적 잠금).
다른 층을 만지는 두 사람은 서로 다른 키를 쓰므로 절대 충돌하지 않는다.
"""

import json
import os
import tempfile
import threading
from datetime import datetime, timezone

# 실데이터 폴더. 테스트할 때는 CAPA_DATA_DIR 로 다른 폴더를 지정해
# 실제 도면 작업 결과를 건드리지 않는다.
DATA_DIR = os.environ.get("CAPA_DATA_DIR") or os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "data"
)
STATE_PATH = os.path.join(DATA_DIR, "state.json")
BACKUP_DIR = os.path.join(DATA_DIR, "backups")
MAX_BACKUPS = 30

_lock = threading.RLock()
_state = None


def _now():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _blank():
    return {"version": 1, "entries": {}}


def _load():
    global _state
    if _state is not None:
        return _state
    os.makedirs(DATA_DIR, exist_ok=True)
    try:
        with open(STATE_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        if not isinstance(data, dict) or "entries" not in data:
            raise ValueError("형식 오류")
        _state = data
    except FileNotFoundError:
        _state = _blank()
    except Exception as e:
        # 손상된 파일은 지우지 않고 옆으로 치워 둔다 (복구 가능하도록)
        broken = STATE_PATH + ".broken-" + datetime.now().strftime("%Y%m%d%H%M%S")
        try:
            os.replace(STATE_PATH, broken)
            print(f"  ! state.json 을 읽지 못해 {os.path.basename(broken)} 로 보관했습니다: {e}")
        except OSError:
            pass
        _state = _blank()
    return _state


def _save_locked():
    """원자적 저장 — 임시 파일에 쓰고 교체해야 중간에 죽어도 파일이 깨지지 않는다."""
    os.makedirs(DATA_DIR, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=DATA_DIR, prefix=".state-", suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(_state, f, ensure_ascii=False, separators=(",", ":"))
        os.replace(tmp, STATE_PATH)
    except Exception:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise


def _rotate_backup():
    """저장 직전 스냅샷 보관 — 실수로 배치를 날려도 되돌릴 수 있게."""
    if not os.path.exists(STATE_PATH):
        return
    os.makedirs(BACKUP_DIR, exist_ok=True)
    name = "state-" + datetime.now().strftime("%Y%m%d-%H%M%S") + ".json"
    try:
        with open(STATE_PATH, "rb") as src, open(os.path.join(BACKUP_DIR, name), "wb") as dst:
            dst.write(src.read())
    except OSError:
        return
    files = sorted(f for f in os.listdir(BACKUP_DIR) if f.startswith("state-"))
    for old in files[:-MAX_BACKUPS]:
        try:
            os.unlink(os.path.join(BACKUP_DIR, old))
        except OSError:
            pass


def snapshot():
    """전체 내려받기 — 접속 직후 1회."""
    with _lock:
        s = _load()
        return {"version": s.get("version", 1), "entries": s["entries"]}


def revs():
    """키별 rev만 — 주기 폴링용(가볍게)."""
    with _lock:
        s = _load()
        return {k: v.get("rev", 0) for k, v in s["entries"].items()}


def apply(changes, by=""):
    """변경 적용. changes = [{key, rev, data}]

    rev 가 서버와 같을 때만 반영하고, 다르면 충돌로 돌려준다.
    rev 를 생략(None)하면 강제 덮어쓰기 — 되돌리기·가져오기 같은 의도적 복원에만 쓴다.
    """
    applied, conflicts = [], []
    with _lock:
        s = _load()
        entries = s["entries"]
        touched = False
        for ch in changes or []:
            key = str(ch.get("key") or "").strip()
            if not key or len(key) > 300:
                continue
            cur = entries.get(key)
            cur_rev = cur.get("rev", 0) if cur else 0
            want = ch.get("rev", None)
            if want is not None and int(want) != cur_rev:
                conflicts.append({"key": key, "serverRev": cur_rev, "data": cur.get("data") if cur else None,
                                  "by": cur.get("by", "") if cur else "", "updatedAt": cur.get("updatedAt", "") if cur else ""})
                continue
            entries[key] = {"rev": cur_rev + 1, "updatedAt": _now(), "by": by or "", "data": ch.get("data")}
            applied.append({"key": key, "rev": cur_rev + 1})
            touched = True
        if touched:
            _rotate_backup()
            _save_locked()
    return {"applied": applied, "conflicts": conflicts}


def stats():
    with _lock:
        s = _load()
        size = os.path.getsize(STATE_PATH) if os.path.exists(STATE_PATH) else 0
        last = max((v.get("updatedAt", "") for v in s["entries"].values()), default="")
        return {"keys": len(s["entries"]), "bytes": size, "updatedAt": last, "path": STATE_PATH}
