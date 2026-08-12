"""배치 백업(JSON)을 공유 저장소에 되돌려 넣는다.

앱의 '배치 관리 → 내보내기' 로 받은 파일을 그대로 받는다.
기존 저장소는 건드리기 전에 backups/ 로 스냅샷을 남긴다.

  py server/restore_backup.py "C:\\path\\capa_배치백업.json"
  py server/restore_backup.py 파일.json --dry-run     # 무엇이 바뀌는지만 확인
"""

import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import store  # noqa: E402

SECTIONS = ("rackLayouts", "floorplans", "records", "inventory", "offbook")


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("-")]
    dry = "--dry-run" in sys.argv
    if not args:
        print(__doc__)
        sys.exit(1)
    path = args[0]
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    changes = []
    for sec in SECTIONS:
        for key, value in (data.get(sec) or {}).items():
            changes.append({"key": f"{sec}/{key}", "data": value})
    # centerFloors 등 공통 설정은 misc 에 병합한다 (기존 misc 를 통째로 덮지 않도록)
    snap = store.snapshot()["entries"]
    misc = dict((snap.get("misc") or {}).get("data") or {})
    for k in ("centerFloors", "centers", "majors", "centerPhotos", "centerInfo",
              "shippers", "centerShipperMap", "centerWmsCodes", "gaonShippers"):
        if k in data:
            misc[k] = data[k]
    changes.append({"key": "misc", "data": misc})

    print(f"백업 파일: {path}")
    print(f"복원 대상 키 {len(changes)}개")
    for ch in changes:
        cur = snap.get(ch["key"])
        racks = (ch["data"] or {}).get("racks") if isinstance(ch["data"], dict) else None
        now = len(racks) if isinstance(racks, list) else "-"
        before = "-"
        if cur and isinstance(cur.get("data"), dict) and isinstance(cur["data"].get("racks"), list):
            before = len(cur["data"]["racks"])
        if ch["key"].startswith("rackLayouts/"):
            print(f"  {ch['key']}: 요소 {before} → {now}")
    if dry:
        print("\n--dry-run 이라 저장하지 않았습니다.")
        return

    # rev 를 생략하면 강제 덮어쓰기. 저장 직전 스냅샷은 store 가 알아서 남긴다
    res = store.apply(changes, by="백업복원")
    print(f"\n반영 {len(res['applied'])}개 / 충돌 {len(res['conflicts'])}개")
    st = store.stats()
    print(f"저장소: {st['path']}  (키 {st['keys']}개 · {st['bytes']:,} bytes)")
    print("백업 스냅샷:", os.path.join(store.BACKUP_DIR))


if __name__ == "__main__":
    main()
