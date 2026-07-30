const STORAGE_KEY = "hx-center-capa-v2";
const LEGACY_STORAGE_KEY = "hx-center-capa-v1";
const ALL = "전체";
const FLOORPLAN_COLS = 216;
const FLOORPLAN_ROWS = 126;
const TWIN_LEVELS = 3; // 랙 기본 단수 (파일 상단에서 선언 — 초기 시드에서 참조)
const ZONE_COLORS = [
  "#f59e0b",
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
  "#db2777",
  "#65a30d",
  "#ea580c",
  "#4f46e5",
];
const CENTER_IMAGES = {
  남이천1센터: "./assets/centers/nami_cheon_1.png",
  남이천2센터: "./assets/centers/nami_cheon_2.jpeg",
  동이천센터: "./assets/centers/dong_icheon.jpeg",
  이천센터: "./assets/centers/icheon.png",
  이천데포: "./assets/centers/icheon.jpeg",
  북이천센터: "./assets/centers/buk_icheon.png",
  설성센터: "./assets/centers/seolseong.png",
  대월센터: "./assets/centers/daewol.jpeg",
  백암센터: "./assets/centers/baegam.png",
};
// 센터별 기본 층 구성 (없으면 ["1F"])
const DEFAULT_CENTER_FLOORS = {
  남이천1센터: ["지하1층", "지상2층", "지상4층"],
};
// floorplanKey → 기본 도면 이미지. 첫 층은 센터명, 그 외는 `센터||층`.
const DEFAULT_FLOORPLANS = {
  남이천1센터: "./assets/centers/nami1_b1.png", // 지하1층(첫 층)
  "남이천1센터||지상2층": "./assets/centers/nami1_2f.png",
  "남이천1센터||지상4층": "./assets/centers/nami1_4f.png",
};
// floorplanKey → 기본 랙 배치(도면에서 1차 추출). 사용자가 편집하면 그 값이 우선.
// 기본 랙/기둥/벽 배치 버전 — 올리면 기존 브라우저도 새 배치로 재시드됨
const DEFAULT_RACKS_VERSION = 7;
const DEFAULT_RACK_LAYOUTS = {
  // 남이천1센터 지하1층 — 도면 픽셀에서 216x63 격자로 직접 산출(반올림 오차 최소화)
  //  랙(백투백 단일) + 기둥(노란 마커) + 벽/챔버 + 작업. 도면-객체 오차 평균 1.6px(<0.25칸)
  남이천1센터: [
    {type:"rack",dir:"h",col:7,row:32,len:24},{type:"rack",dir:"h",col:7,row:33,len:24},{type:"rack",dir:"h",col:7,row:37,len:24},
    {type:"rack",dir:"h",col:7,row:38,len:24},{type:"rack",dir:"h",col:7,row:42,len:31},{type:"rack",dir:"h",col:7,row:44,len:31},
    {type:"rack",dir:"h",col:7,row:48,len:24},{type:"rack",dir:"h",col:7,row:49,len:24},{type:"rack",dir:"h",col:7,row:52,len:24},
    {type:"rack",dir:"h",col:7,row:53,len:24},{type:"rack",dir:"h",col:7,row:55,len:24},{type:"rack",dir:"h",col:7,row:56,len:24},
    {type:"rack",dir:"h",col:7,row:59,len:24},{type:"rack",dir:"h",col:7,row:60,len:24},{type:"rack",dir:"h",col:7,row:66,len:24},
    {type:"rack",dir:"h",col:7,row:67,len:24},{type:"rack",dir:"h",col:7,row:69,len:31},{type:"rack",dir:"h",col:7,row:70,len:31},
    {type:"rack",dir:"h",col:7,row:76,len:24},{type:"rack",dir:"h",col:7,row:77,len:24},{type:"rack",dir:"h",col:7,row:83,len:24},
    {type:"rack",dir:"h",col:7,row:84,len:24},{type:"rack",dir:"h",col:7,row:86,len:24},{type:"rack",dir:"h",col:7,row:87,len:24},
    {type:"rack",dir:"h",col:7,row:93,len:24},{type:"rack",dir:"h",col:7,row:94,len:24},{type:"rack",dir:"h",col:7,row:97,len:31},
    {type:"rack",dir:"h",col:7,row:98,len:31},{type:"rack",dir:"h",col:7,row:100,len:31},{type:"rack",dir:"h",col:7,row:101,len:31},
    {type:"rack",dir:"h",col:56,row:26,len:31},{type:"rack",dir:"h",col:56,row:27,len:31},{type:"rack",dir:"h",col:59,row:32,len:27},
    {type:"rack",dir:"h",col:59,row:33,len:27},{type:"rack",dir:"h",col:59,row:37,len:27},{type:"rack",dir:"h",col:59,row:38,len:27},
    {type:"rack",dir:"h",col:59,row:42,len:27},{type:"rack",dir:"h",col:59,row:43,len:27},{type:"rack",dir:"h",col:59,row:44,len:27},
    {type:"rack",dir:"h",col:59,row:45,len:27},{type:"rack",dir:"h",col:59,row:48,len:27},{type:"rack",dir:"h",col:59,row:49,len:27},
    {type:"rack",dir:"h",col:59,row:52,len:27},{type:"rack",dir:"h",col:59,row:53,len:27},{type:"rack",dir:"h",col:59,row:55,len:27},
    {type:"rack",dir:"h",col:59,row:56,len:27},{type:"rack",dir:"h",col:59,row:59,len:27},{type:"rack",dir:"h",col:59,row:60,len:27},
    {type:"rack",dir:"h",col:59,row:66,len:27},{type:"rack",dir:"h",col:59,row:67,len:27},{type:"rack",dir:"h",col:59,row:69,len:27},
    {type:"rack",dir:"h",col:59,row:70,len:27},{type:"rack",dir:"h",col:59,row:71,len:27},{type:"rack",dir:"h",col:59,row:72,len:27},
    {type:"rack",dir:"h",col:59,row:76,len:27},{type:"rack",dir:"h",col:59,row:77,len:27},{type:"rack",dir:"h",col:59,row:82,len:27},
    {type:"rack",dir:"h",col:59,row:83,len:27},{type:"rack",dir:"h",col:59,row:86,len:25},{type:"rack",dir:"h",col:59,row:87,len:25},
    {type:"rack",dir:"h",col:59,row:93,len:25},{type:"rack",dir:"h",col:59,row:94,len:25},{type:"rack",dir:"h",col:62,row:97,len:22},
    {type:"rack",dir:"h",col:62,row:98,len:22},{type:"rack",dir:"h",col:62,row:100,len:22},{type:"rack",dir:"h",col:62,row:101,len:22},
    {type:"rack",dir:"v",col:85,row:26,len:60},{type:"rack",dir:"v",col:86,row:26,len:60},{type:"rack",dir:"v",col:89,row:26,len:60},
    {type:"rack",dir:"v",col:90,row:26,len:60},{type:"rack",dir:"v",col:91,row:26,len:60},{type:"rack",dir:"v",col:92,row:26,len:60},
    {type:"rack",dir:"v",col:94,row:26,len:60},{type:"rack",dir:"v",col:95,row:26,len:60},{type:"rack",dir:"v",col:97,row:24,len:62},
    {type:"rack",dir:"v",col:98,row:24,len:62},{type:"rack",dir:"v",col:100,row:24,len:62},{type:"rack",dir:"v",col:101,row:24,len:62},
    {type:"rack",dir:"v",col:101,row:24,len:62},{type:"rack",dir:"v",col:102,row:24,len:62},{type:"rack",dir:"v",col:105,row:24,len:62},
    {type:"rack",dir:"v",col:106,row:24,len:62},{type:"rack",dir:"v",col:106,row:24,len:62},{type:"rack",dir:"v",col:107,row:24,len:62},
    {type:"rack",dir:"v",col:108,row:24,len:62},{type:"rack",dir:"v",col:109,row:24,len:62},{type:"rack",dir:"v",col:111,row:24,len:62},
    {type:"rack",dir:"v",col:112,row:24,len:62},{type:"rack",dir:"v",col:112,row:24,len:62},{type:"rack",dir:"v",col:113,row:24,len:62},
    {type:"rack",dir:"v",col:113,row:24,len:62},{type:"rack",dir:"v",col:114,row:24,len:62},{type:"rack",dir:"v",col:117,row:24,len:60},
    {type:"rack",dir:"v",col:118,row:24,len:60},{type:"rack",dir:"v",col:117,row:24,len:60},{type:"rack",dir:"v",col:118,row:24,len:60},
    {type:"rack",dir:"v",col:119,row:24,len:60},{type:"rack",dir:"v",col:120,row:24,len:60},{type:"rack",dir:"v",col:122,row:24,len:62},
    {type:"rack",dir:"v",col:123,row:24,len:62},{type:"rack",dir:"v",col:123,row:24,len:62},{type:"rack",dir:"v",col:124,row:24,len:62},
    {type:"rack",dir:"v",col:125,row:24,len:62},{type:"rack",dir:"v",col:126,row:24,len:62},{type:"rack",dir:"v",col:128,row:26,len:60},
    {type:"rack",dir:"v",col:129,row:26,len:60},{type:"rack",dir:"v",col:129,row:24,len:62},{type:"rack",dir:"v",col:130,row:24,len:62},
    {type:"rack",dir:"v",col:130,row:24,len:62},{type:"rack",dir:"v",col:131,row:24,len:62},{type:"rack",dir:"v",col:134,row:24,len:62},
    {type:"rack",dir:"v",col:135,row:24,len:62},{type:"rack",dir:"v",col:136,row:24,len:62},{type:"rack",dir:"v",col:137,row:24,len:62},
    {type:"rack",dir:"v",col:139,row:24,len:62},{type:"rack",dir:"v",col:140,row:24,len:62},{type:"rack",dir:"v",col:140,row:24,len:62},
    {type:"rack",dir:"v",col:141,row:24,len:62},{type:"rack",dir:"v",col:141,row:24,len:62},{type:"rack",dir:"v",col:142,row:24,len:62},
    {type:"rack",dir:"v",col:145,row:24,len:62},{type:"rack",dir:"v",col:146,row:24,len:62},{type:"rack",dir:"v",col:147,row:24,len:62},
    {type:"rack",dir:"v",col:148,row:24,len:62},{type:"rack",dir:"v",col:150,row:24,len:58},{type:"rack",dir:"v",col:151,row:24,len:58},
    {type:"work",col:155,row:74,w:27,d:19,name:"분배대기장",color:"#10b981",height:1},{type:"wall",col:157,row:23,w:26,d:13,name:"VAS 작업장"},{type:"wall",col:186,row:23,w:9,d:13,name:"VAS"},
    {type:"wall",col:7,row:75,w:33,d:2},{type:"wall",col:51,row:75,w:33,d:2},{type:"column",col:165,row:21,w:2,d:2},
    {type:"column",col:166,row:22,w:2,d:2},{type:"column",col:168,row:21,w:2,d:2},{type:"column",col:172,row:22,w:2,d:2},
    {type:"column",col:121,row:23,w:2,d:2},{type:"column",col:16,row:37,w:2,d:2},{type:"column",col:27,row:37,w:2,d:2},
    {type:"column",col:39,row:37,w:2,d:2},{type:"column",col:61,row:37,w:2,d:2},{type:"column",col:72,row:37,w:2,d:2},
    {type:"column",col:94,row:37,w:2,d:2},{type:"column",col:106,row:37,w:2,d:2},{type:"column",col:128,row:37,w:2,d:2},
    {type:"column",col:139,row:37,w:2,d:2},{type:"column",col:150,row:37,w:2,d:2},{type:"column",col:40,row:45,w:2,d:2},
    {type:"column",col:48,row:45,w:2,d:2},{type:"column",col:16,row:48,w:2,d:2},{type:"column",col:27,row:48,w:2,d:2},
    {type:"column",col:39,row:48,w:2,d:2},{type:"column",col:61,row:48,w:2,d:2},{type:"column",col:72,row:48,w:2,d:2},
    {type:"column",col:94,row:48,w:2,d:2},{type:"column",col:106,row:48,w:2,d:2},{type:"column",col:117,row:48,w:2,d:2},
    {type:"column",col:128,row:48,w:2,d:2},{type:"column",col:139,row:48,w:2,d:2},{type:"column",col:150,row:48,w:2,d:2},
    {type:"column",col:161,row:48,w:2,d:2},{type:"column",col:173,row:48,w:2,d:2},{type:"column",col:184,row:48,w:2,d:2},
    {type:"column",col:94,row:59,w:2,d:2},{type:"column",col:106,row:59,w:2,d:2},{type:"column",col:117,row:59,w:2,d:2},
    {type:"column",col:128,row:59,w:2,d:2},{type:"column",col:139,row:59,w:2,d:2},{type:"column",col:150,row:59,w:2,d:2},
    {type:"column",col:161,row:59,w:2,d:2},{type:"column",col:173,row:59,w:2,d:2},{type:"column",col:184,row:59,w:2,d:2},
    {type:"column",col:16,row:59,w:2,d:2},{type:"column",col:27,row:59,w:2,d:2},{type:"column",col:61,row:59,w:2,d:2},
    {type:"column",col:72,row:59,w:2,d:2},{type:"column",col:40,row:68,w:2,d:2},{type:"column",col:48,row:68,w:2,d:2},
    {type:"column",col:51,row:70,w:2,d:2},{type:"column",col:16,row:71,w:2,d:2},{type:"column",col:27,row:71,w:2,d:2},
    {type:"column",col:39,row:71,w:2,d:2},{type:"column",col:61,row:71,w:2,d:2},{type:"column",col:94,row:71,w:2,d:2},
    {type:"column",col:128,row:71,w:2,d:2},{type:"column",col:139,row:71,w:2,d:2},{type:"column",col:150,row:71,w:2,d:2},
    {type:"column",col:161,row:71,w:2,d:2},{type:"column",col:173,row:71,w:2,d:2},{type:"column",col:184,row:71,w:2,d:2},
    {type:"column",col:16,row:82,w:2,d:2},{type:"column",col:27,row:82,w:2,d:2},{type:"column",col:39,row:82,w:2,d:2},
    {type:"column",col:50,row:82,w:2,d:2},{type:"column",col:61,row:82,w:2,d:2},{type:"column",col:72,row:82,w:2,d:2},
    {type:"column",col:106,row:82,w:2,d:2},{type:"column",col:128,row:82,w:2,d:2},{type:"column",col:139,row:82,w:2,d:2},
    {type:"column",col:161,row:82,w:2,d:2},{type:"column",col:173,row:82,w:2,d:2},{type:"column",col:184,row:82,w:2,d:2},
    {type:"column",col:94,row:93,w:2,d:2},{type:"column",col:106,row:93,w:2,d:2},{type:"column",col:128,row:93,w:2,d:2},
    {type:"column",col:139,row:93,w:2,d:2},{type:"column",col:161,row:93,w:2,d:2},{type:"column",col:173,row:93,w:2,d:2},
    {type:"column",col:16,row:93,w:2,d:2},{type:"column",col:27,row:93,w:2,d:2},{type:"column",col:39,row:93,w:2,d:2},
    {type:"column",col:50,row:93,w:2,d:2},{type:"column",col:61,row:93,w:2,d:2},{type:"column",col:72,row:93,w:2,d:2},
    {type:"column",col:40,row:99,w:2,d:2},{type:"column",col:39,row:104,w:2,d:2},{type:"column",col:50,row:104,w:2,d:2},
    {type:"column",col:72,row:104,w:2,d:2},{type:"column",col:94,row:104,w:2,d:2},{type:"column",col:106,row:104,w:2,d:2},
    {type:"column",col:117,row:104,w:2,d:2},{type:"column",col:128,row:104,w:2,d:2},{type:"column",col:139,row:104,w:2,d:2},
    {type:"column",col:16,row:104,w:2,d:2},{type:"column",col:27,row:104,w:2,d:2},{type:"column",col:61,row:104,w:2,d:2},
    {type:"column",col:55,row:106,w:2,d:2},{type:"column",col:139,row:114,w:2,d:2},{type:"column",col:117,row:115,w:2,d:2},
    {type:"column",col:128,row:115,w:2,d:2},
  ],
  "남이천1센터||지상2층": [
    {type:"rack",dir:"h",col:39,row:32,len:125},{type:"rack",dir:"h",col:39,row:33,len:125},{type:"rack",dir:"h",col:32,row:38,len:132},
    {type:"rack",dir:"h",col:32,row:39,len:132},{type:"rack",dir:"h",col:32,row:43,len:132},{type:"rack",dir:"h",col:32,row:44,len:132},
    {type:"rack",dir:"h",col:39,row:47,len:161},{type:"rack",dir:"h",col:39,row:48,len:161},{type:"rack",dir:"h",col:57,row:50,len:143},
    {type:"rack",dir:"h",col:57,row:51,len:143},{type:"rack",dir:"h",col:57,row:55,len:107},{type:"rack",dir:"h",col:57,row:56,len:107},
    {type:"rack",dir:"h",col:57,row:59,len:104},{type:"rack",dir:"h",col:57,row:60,len:104},{type:"rack",dir:"h",col:57,row:64,len:107},
    {type:"rack",dir:"h",col:57,row:65,len:107},{type:"rack",dir:"h",col:62,row:69,len:101},{type:"rack",dir:"h",col:62,row:70,len:101},
    {type:"rack",dir:"h",col:41,row:72,len:142},{type:"rack",dir:"h",col:41,row:73,len:142},{type:"rack",dir:"h",col:58,row:77,len:106},
    {type:"rack",dir:"h",col:58,row:78,len:106},{type:"rack",dir:"h",col:39,row:83,len:165},{type:"rack",dir:"h",col:39,row:84,len:165},
    {type:"rack",dir:"h",col:39,row:86,len:165},{type:"rack",dir:"h",col:39,row:88,len:165},{type:"rack",dir:"h",col:39,row:92,len:165},
    {type:"rack",dir:"h",col:39,row:96,len:165},{type:"rack",dir:"h",col:33,row:101,len:171},{type:"rack",dir:"h",col:33,row:106,len:171},
    {type:"rack",dir:"h",col:33,row:113,len:155},{type:"rack",dir:"h",col:33,row:115,len:155},
  ],
  "남이천1센터||지상4층": [
    {type:"rack",dir:"h",col:32,row:37,len:100},{type:"rack",dir:"h",col:32,row:38,len:100},{type:"rack",dir:"h",col:40,row:42,len:90},
    {type:"rack",dir:"h",col:40,row:43,len:90},{type:"rack",dir:"h",col:32,row:47,len:98},{type:"rack",dir:"h",col:32,row:48,len:98},
    {type:"rack",dir:"h",col:40,row:52,len:90},{type:"rack",dir:"h",col:40,row:53,len:90},{type:"rack",dir:"h",col:40,row:55,len:90},
    {type:"rack",dir:"h",col:40,row:56,len:90},{type:"rack",dir:"h",col:41,row:58,len:87},{type:"rack",dir:"h",col:41,row:59,len:87},
    {type:"rack",dir:"h",col:32,row:60,len:96},{type:"rack",dir:"h",col:32,row:61,len:96},{type:"rack",dir:"h",col:32,row:64,len:98},
    {type:"rack",dir:"h",col:32,row:65,len:98},{type:"rack",dir:"h",col:32,row:69,len:98},{type:"rack",dir:"h",col:32,row:70,len:98},
    {type:"rack",dir:"h",col:41,row:72,len:89},{type:"rack",dir:"h",col:41,row:73,len:89},{type:"rack",dir:"h",col:32,row:75,len:98},
    {type:"rack",dir:"h",col:32,row:76,len:98},{type:"rack",dir:"h",col:32,row:77,len:98},{type:"rack",dir:"h",col:32,row:78,len:98},
    {type:"rack",dir:"h",col:41,row:83,len:89},{type:"rack",dir:"h",col:41,row:84,len:89},{type:"rack",dir:"h",col:32,row:87,len:98},
    {type:"rack",dir:"h",col:32,row:88,len:98},{type:"rack",dir:"h",col:32,row:92,len:96},{type:"rack",dir:"h",col:32,row:93,len:96},
    {type:"rack",dir:"h",col:32,row:98,len:87},{type:"rack",dir:"h",col:32,row:99,len:87},{type:"rack",dir:"h",col:32,row:104,len:103},
    {type:"rack",dir:"h",col:32,row:105,len:103},{type:"rack",dir:"h",col:37,row:108,len:82},{type:"rack",dir:"h",col:37,row:109,len:82},
    {type:"rack",dir:"h",col:33,row:111,len:86},{type:"rack",dir:"h",col:33,row:112,len:86},{type:"rack",dir:"h",col:33,row:114,len:93},
    {type:"rack",dir:"h",col:33,row:115,len:93},
  ],
};
let _rackSeq = 0;
// 기본 랙 요소 → 편집 가능한 완전한 요소로 확장(고유 id·기본값 채움)
function materializeDefaultRack(e) {
  const id = "el-def-" + (_rackSeq++).toString(36);
  if (e.type === "rack") {
    return {
      id, type: "rack", col: e.col, row: e.row, len: e.len, dir: e.dir === "v" ? "v" : "h",
      levels: e.levels || TWIN_LEVELS, customer: e.customer || "", name: e.name || "",
      capa: e.capa || 0, fill: e.fill != null ? e.fill : 0.6, color: e.color || "#5ac8fa",
    };
  }
  return {
    id, type: e.type, col: e.col, row: e.row, w: e.w || 1, d: e.d || 1,
    name: e.name || "", color: e.color || (e.type === "column" ? "#9aa3b2" : e.type === "wall" ? "#ef4444" : "#64748b"), height: e.height || 1,
  };
}
const CENTER_MAP_POSITIONS = {
  남이천1센터: { x: 53.8, y: 34.6 },
  남이천2센터: { x: 54.4, y: 35.8 },
  동이천센터: { x: 55.0, y: 35.1 },
  이천센터: { x: 55.2, y: 33.8 },
  이천데포: { x: 54.5, y: 34.2 },
  북이천센터: { x: 54.2, y: 32.7 },
  설성센터: { x: 54.8, y: 37.2 },
  대월센터: { x: 55.6, y: 35.9 },
  백암센터: { x: 58.4, y: 36.5 },
};
const KOREA_SERVICE_BOUNDS = {
  sw: { lat: 33.0, lng: 124.8 },
  ne: { lat: 38.2, lng: 130.0 },
  center: { lat: 36.35, lng: 127.75 },
};

const defaultState = {
  centers: [
    "남이천1센터",
    "남이천2센터",
    "동이천센터",
    "이천센터",
    "이천데포",
    "북이천센터",
    "설성센터",
    "대월센터",
    "백암센터",
  ],
  majors: {
    보관공간: ["일반", "보세", "벌크", "위험물", "상온", "저온"],
    작업공간: ["VAS(임가공)", "B2C", "스마트오더", "패키지"],
    사무실공간: ["운영사무실", "회의실", "휴게공간"],
  },
  records: {},
  floorplans: {},
  rackLayouts: {},
  inventory: {},
  centerPhotos: {},
  centerFloors: {},
  shippers: [],
  centerShipperMap: {},
  hiddenMappedShippers: {},
  centerInfo: {},
  shipperTargetAverages: {},
  kakaoApiKey: "",
};

let state = loadState();
ensureBaselineState();
let selectedCenter = state.centers[0];
let selectedFloor = getCenterFloors(selectedCenter)[0];
let twinCenter = null;
let twinFloor = null;
let twinHeightMode = "capa";
let twinState = null;
let twinViewMode = "view";
let selectedRackId = null;
let rackDrag = null;
let twinElementType = "rack";
let selectedCategory = { major: "보관공간", minor: "일반" };
let selectedZoneId = null;
let floorplanMode = "cell";
let shipperSuggestOpen = false;
let mappingSelectedCenter = "";
let mappingDraft = {};
let kakaoMap = null;
let kakaoMarkers = [];
let kakaoCoverageCircles = [];
let kakaoInfoWindow = null;
let kakaoScriptLoading = false;
const $ = (selector) => document.querySelector(selector);

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!saved) return structuredClone(defaultState);
  try {
    const parsed = JSON.parse(saved);
    return {
      centers: parsed.centers?.length ? parsed.centers : defaultState.centers,
      majors: parsed.majors || defaultState.majors,
      records: parsed.records || {},
      floorplans: parsed.floorplans || {},
      rackLayouts: parsed.rackLayouts || {},
      inventory: parsed.inventory || {},
      centerPhotos: parsed.centerPhotos || {},
      centerFloors: parsed.centerFloors || {},
      shippers: parsed.shippers || [],
      centerShipperMap: parsed.centerShipperMap || {},
      hiddenMappedShippers: parsed.hiddenMappedShippers || {},
      centerInfo: parsed.centerInfo || {},
      shipperTargetAverages: parsed.shipperTargetAverages || {},
      kakaoApiKey: parsed.kakaoApiKey || "",
      defaultRacksSeeded: parsed.defaultRacksSeeded || false,
      defaultRacksVersion: parsed.defaultRacksVersion || 0,
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function ensureBaselineState() {
  let changed = false;
  if (!state.centers.includes("동이천센터")) {
    const nami2Index = state.centers.indexOf("남이천2센터");
    const insertIndex = nami2Index >= 0 ? nami2Index + 1 : state.centers.length;
    state.centers.splice(insertIndex, 0, "동이천센터");
    changed = true;
  }
  if (!state.centers.includes("이천데포")) {
    const icheonIndex = state.centers.indexOf("이천센터");
    const insertIndex = icheonIndex >= 0 ? icheonIndex + 1 : state.centers.length;
    state.centers.splice(insertIndex, 0, "이천데포");
    changed = true;
  }
  if (!Array.isArray(state.shippers)) {
    state.shippers = [];
    changed = true;
  }
  if (!state.centerShipperMap) {
    state.centerShipperMap = {};
    changed = true;
  }
  if (!state.hiddenMappedShippers) {
    state.hiddenMappedShippers = {};
    changed = true;
  }
  if (!state.centerInfo) {
    state.centerInfo = {};
    changed = true;
  }
  if (!state.shipperTargetAverages) {
    state.shipperTargetAverages = {};
    changed = true;
  }
  if (!state.centerFloors) {
    state.centerFloors = {};
    changed = true;
  }
  if (typeof state.kakaoApiKey !== "string") {
    state.kakaoApiKey = "";
    changed = true;
  }
  const knownShippers = allShipperNames(false);
  knownShippers.forEach((name) => {
    if (!state.shippers.includes(name)) {
      state.shippers.push(name);
      changed = true;
    }
  });
  state.centers.forEach((center) => {
    if (!Array.isArray(state.centerShipperMap[center])) {
      state.centerShipperMap[center] = [];
      changed = true;
    }
    if (!Array.isArray(state.hiddenMappedShippers[center])) {
      state.hiddenMappedShippers[center] = [];
      changed = true;
    }
    if (!state.centerInfo[center]) {
      state.centerInfo[center] = defaultCenterInfo(center);
      changed = true;
    } else {
      const before = JSON.stringify(state.centerInfo[center]);
      normalizeCenterInfo(center);
      if (JSON.stringify(state.centerInfo[center]) !== before) changed = true;
    }
    if (!Array.isArray(state.centerFloors[center]) || !state.centerFloors[center].length) {
      state.centerFloors[center] = (DEFAULT_CENTER_FLOORS[center] || ["1F"]).slice();
      changed = true;
    } else if (
      DEFAULT_CENTER_FLOORS[center] &&
      state.centerFloors[center].length === 1 &&
      state.centerFloors[center][0] === "1F"
    ) {
      // 손대지 않은 기본 ["1F"] → 내장 기본 층 구성으로 업그레이드
      state.centerFloors[center] = DEFAULT_CENTER_FLOORS[center].slice();
      changed = true;
    }
  });
  // 기본 랙/기둥/벽 배치 — 버전이 바뀌면 기본 배치 키를 새로 시드(좌표·도면 갱신 반영)
  if (state.defaultRacksVersion !== DEFAULT_RACKS_VERSION) {
    Object.entries(DEFAULT_RACK_LAYOUTS).forEach(([key, els]) => {
      state.rackLayouts[key] = { racks: els.map(materializeDefaultRack) };
    });
    state.defaultRacksVersion = DEFAULT_RACKS_VERSION;
    state.defaultRacksSeeded = true;
    changed = true;
  }
  if (changed) saveState();
}

function defaultCenterInfo(center) {
  const known = {
    백암센터: {
      address: "경기 용인시 처인구 백암면 덕평로 120",
      note: "수도권 동남부 보관 거점",
    },
  };
  return {
    address: known[center]?.address || "",
    note: known[center]?.note || "",
    manager: "",
    isHub: false,
    coverageName: "",
    coverageRadius: 25,
  };
}

function normalizeCenterInfo(center) {
  const base = defaultCenterInfo(center);
  const current = state.centerInfo[center] || {};
  state.centerInfo[center] = {
    ...base,
    ...current,
    isHub: Boolean(current.isHub),
    coverageRadius: number(current.coverageRadius) || base.coverageRadius,
  };
  return state.centerInfo[center];
}

let storageWarned = false;
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (err) {
    // 용량 초과 등 저장 실패 — 화면 갱신은 계속되도록 예외를 삼킴
    console.warn("상태 저장 실패(브라우저 저장 용량 초과 가능):", err);
    if (!storageWarned) {
      storageWarned = true;
      window.setTimeout(
        () =>
          alert(
            "브라우저 저장 용량을 초과했습니다.\n도면 이미지가 너무 큰 경우가 많습니다 — 도면을 다시 업로드하면 자동 축소되어 저장됩니다.\n(현재 화면 작업은 계속 가능하지만 새로고침 시 일부가 저장되지 않을 수 있습니다.)",
          ),
        0,
      );
    }
    return false;
  }
}

// 도면 이미지 축소 — localStorage 용량 초과 방지 (긴 변 maxDim, JPEG 압축)
function downscaleImage(dataUrl, maxDim = 1600, quality = 0.75) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      try {
        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

// PDF.js 워커: file://에서는 워커 스폰이 막히므로 워커 스크립트를 Blob URL로 로드해 우회
let _pdfWorkerReady = null;
function ensurePdfWorker() {
  if (_pdfWorkerReady) return _pdfWorkerReady;
  _pdfWorkerReady = fetch("./assets/vendor/pdf.worker.min.js")
    .then((r) => r.text())
    .then((code) => {
      const blob = new Blob([code], { type: "application/javascript" });
      pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(blob);
    })
    .catch(() => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "./assets/vendor/pdf.worker.min.js";
    });
  return _pdfWorkerReady;
}

// PDF 1페이지 → 이미지 dataURL (흰 배경)
function pdfFileToImage(file, scale = 2) {
  return new Promise((resolve, reject) => {
    if (typeof pdfjsLib === "undefined") {
      reject(new Error("PDF 라이브러리를 불러오지 못했습니다"));
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await ensurePdfWorker();
        const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(reader.result) }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport }).promise;
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

// 업로드 파일(이미지 또는 PDF) → 다운스케일된 도면 이미지
async function fileToFloorplanImage(file) {
  const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
  if (isPdf) {
    const raw = await pdfFileToImage(file, 2);
    return downscaleImage(raw, 2000, 0.82);
  }
  const dataUrl = await new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = () => rej(r.error);
    r.readAsDataURL(file);
  });
  return downscaleImage(dataUrl);
}

function getCenterFloors(center) {
  const floors = state.centerFloors?.[center];
  if (Array.isArray(floors) && floors.length) return floors;
  return (DEFAULT_CENTER_FLOORS[center] || ["1F"]).slice();
}

function firstFloor(center) {
  return getCenterFloors(center)[0] || "1F";
}

function recordKey(center, major, minor, floor = firstFloor(center)) {
  return floor === firstFloor(center)
    ? `${center}||${major}||${minor}`
    : `${center}||${floor}||${major}||${minor}`;
}

function getRecord(center, major, minor, floor = selectedFloor || firstFloor(center)) {
  const key = recordKey(center, major, minor, floor);
  if (!state.records[key]) {
    state.records[key] = { capacity: 0, used: 0, memo: "", shippers: [] };
  }
  return state.records[key];
}

function floorplanKey(center, floor = selectedFloor || firstFloor(center)) {
  return floor === firstFloor(center) ? center : `${center}||${floor}`;
}

function getFloorplan(center, floor = selectedFloor || firstFloor(center)) {
  const key = floorplanKey(center, floor);
  if (!state.floorplans[key]) {
    state.floorplans[key] = { image: "", zones: [] };
  }
  // 업로드본이 없으면 기본 내장 도면으로 대체 (사용자 업로드 시 덮어씀)
  if (!state.floorplans[key].image && DEFAULT_FLOORPLANS[key]) {
    state.floorplans[key].image = DEFAULT_FLOORPLANS[key];
  }
  return state.floorplans[key];
}

function getRackLayout(center, floor = selectedFloor || firstFloor(center)) {
  const key = floorplanKey(center, floor);
  if (!state.rackLayouts[key]) {
    state.rackLayouts[key] = { racks: [] };
  }
  return state.rackLayouts[key];
}

// 고객사 이름 → 안정적인 색상 (ZONE_COLORS 인덱스)
function customerColor(name) {
  if (!name) return "#5ac8fa";
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return ZONE_COLORS[hash % ZONE_COLORS.length];
}

/* ===== WMS 재고 연동 ===== */
// CELLDESCR 예: "02-01-05-30" → 존-랙열-베이-단(30=3단)
function getInventory(center) {
  return state.inventory[center] || null;
}
function pad2(n) {
  return String(n).padStart(2, "0");
}
// 재고 있는 셀 접두(존-랙열) 목록
function inventoryPrefixes(inv) {
  if (!inv) return [];
  const set = new Set();
  Object.keys(inv.cells).forEach((code) => {
    const p = code.split("-");
    if (p.length >= 4) set.add(p[0] + "-" + p[1]);
  });
  return Array.from(set).sort();
}
// 화주별 색상 배치: 셀마다 화주(Y열) 색, 단별로 같은 화주끼리 그룹 정렬(왼쪽 정렬)
// 반환 {placements:[{b,l,color,customer}], customers:Map(name->color), count, qty}
function rackInventoryPlacement(inv, rack) {
  const len = Math.max(1, Math.round(number(rack.len)));
  const levels = Math.max(1, Math.round(number(rack.levels) || TWIN_LEVELS));
  const customers = new Map();
  let qty = 0;
  const perLevel = Array.from({ length: levels }, () => []);
  if (inv && rack.cellPrefix) {
    for (let b = 0; b < len; b++) {
      for (let l = 0; l < levels; l++) {
        const code = `${rack.cellPrefix}-${pad2(b + 1)}-${pad2((l + 1) * 10)}`;
        const cell = inv.cells[code];
        if (!cell) continue;
        const name = cell.c || "미지정";
        const color = customerColor(name);
        customers.set(name, color);
        qty += number(cell.q);
        perLevel[l].push({ name, color, origBay: b });
      }
    }
  }
  const placements = [];
  perLevel.forEach((arr, l) => {
    arr.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : a.origBay - b.origBay));
    arr.forEach((it, i) => placements.push({ b: i, l, color: it.color, customer: it.name }));
  });
  return { placements, customers, count: placements.length, qty };
}

// 랙(접두)의 실제 점유 슬롯: {set:Set("b,l"), count, qty}  (b,l 0-indexed)
function occupiedForRack(inv, rack) {
  const set = new Set();
  let qty = 0;
  const len = Math.max(1, Math.round(number(rack.len)));
  const levels = Math.max(1, Math.round(number(rack.levels) || TWIN_LEVELS));
  if (!inv || !rack.cellPrefix) return { set, count: 0, qty: 0 };
  for (let b = 0; b < len; b++) {
    for (let l = 0; l < levels; l++) {
      const code = `${rack.cellPrefix}-${pad2(b + 1)}-${pad2((l + 1) * 10)}`;
      const cell = inv.cells[code];
      if (cell) {
        set.add(`${b},${l}`);
        qty += number(cell.q);
      }
    }
  }
  return { set, count: set.size, qty };
}

// xlsx/csv 파일 → 재고 맵 {cells:{code:{q,n,d}}, ...}
function parseInventoryFile(file) {
  return new Promise((resolve, reject) => {
    if (typeof XLSX === "undefined") {
      reject(new Error("xlsx 파서를 불러오지 못했습니다"));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
        if (!rows.length) {
          reject(new Error("빈 파일입니다"));
          return;
        }
        // 헤더에 앞뒤 공백이 있을 수 있어 trim 후 인덱스로 매핑
        const header = rows[0].map((h) => String(h).trim());
        const col = (name) => header.indexOf(name);
        const iCell = col("CELLDESCR");
        const iNQty = col("N_QTY");
        const iQty = col("QTY");
        const iDescr = col("STOCKDESCR");
        // 화주명 = Y열(SUPPLIERDESCR). 헤더명 우선, 없으면 Y열(인덱스 24)로 폴백
        let iOwner = col("SUPPLIERDESCR");
        if (iOwner < 0) iOwner = 24;
        if (iCell < 0) {
          reject(new Error("CELLDESCR 컬럼을 찾을 수 없습니다"));
          return;
        }
        const cells = {};
        let used = 0;
        for (let r = 1; r < rows.length; r++) {
          const row = rows[r];
          if (!row) continue;
          const code = String(row[iCell] ?? "").trim();
          if (!code) continue;
          const q = (iNQty >= 0 ? number(row[iNQty]) : 0) || (iQty >= 0 ? number(row[iQty]) : 0) || 0;
          const descr = iDescr >= 0 ? String(row[iDescr] ?? "").trim() : "";
          const owner = iOwner >= 0 ? String(row[iOwner] ?? "").trim() : "";
          if (!cells[code]) cells[code] = { q: 0, n: 0, d: descr, c: owner };
          cells[code].q += q;
          cells[code].n += 1;
          if (!cells[code].d && descr) cells[code].d = descr;
          if (!cells[code].c && owner) cells[code].c = owner;
          used++;
        }
        resolve({
          fileName: file.name,
          importedAt: new Date().toISOString(),
          rows: used,
          cellCount: Object.keys(cells).length,
          cells,
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

function recordUsed(record) {
  const shipperUsed = (record.shippers || []).reduce((sum, shipper) => sum + number(shipper.used), 0);
  return record.shippers?.length ? shipperUsed : number(record.used);
}

function allCategories() {
  return Object.entries(state.majors).flatMap(([major, minors]) =>
    minors.map((minor) => ({ major, minor })),
  );
}

function number(value) {
  return Number(value || 0);
}

function formatPlt(value) {
  return `${number(value).toLocaleString("ko-KR")} PLT`;
}

function percent(part, total) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

function centerTotals(center, filterMajor = ALL) {
  return getCenterFloors(center).reduce(
    (total, floor) => {
      allCategories().forEach((category) => {
        if (filterMajor !== ALL && category.major !== filterMajor) return;
        const record = getRecord(center, category.major, category.minor, floor);
        const used = recordUsed(record);
        total.capacity += number(record.capacity);
        total.used += used;
        total.shippers.push(
          ...(record.shippers || []).map((shipper) => ({
            ...shipper,
            center,
            floor,
            major: category.major,
            minor: category.minor,
          })),
        );
      });
      return total;
    },
    { capacity: 0, used: 0, shippers: [] },
  );
}

function floorTotals(center, floor, filterMajor = ALL) {
  return allCategories().reduce(
    (total, category) => {
      if (filterMajor !== ALL && category.major !== filterMajor) return total;
      const record = getRecord(center, category.major, category.minor, floor);
      const used = recordUsed(record);
      total.capacity += number(record.capacity);
      total.used += used;
      total.shippers.push(
        ...(record.shippers || []).map((shipper) => ({
          ...shipper,
          center,
          floor,
          major: category.major,
          minor: category.minor,
        })),
      );
      return total;
    },
    { capacity: 0, used: 0, shippers: [] },
  );
}

function grandTotals(filterMajor = ALL, centers = state.centers) {
  return centers.reduce(
    (total, center) => {
      const item = centerTotals(center, filterMajor);
      total.capacity += item.capacity;
      total.used += item.used;
      return total;
    },
    { capacity: 0, used: 0 },
  );
}

function aggregateShippers(shippers) {
  const map = new Map();
  shippers.forEach((shipper) => {
    if (!shipper.name) return;
    map.set(shipper.name, (map.get(shipper.name) || 0) + number(shipper.used));
  });
  return [...map.entries()]
    .map(([name, used]) => ({ name, used }))
    .sort((a, b) => b.used - a.used);
}

function allShipperNames(includeMaster = true) {
  const names = new Set();
  if (includeMaster) {
    state.shippers?.forEach((name) => {
      if (name) names.add(name);
    });
  }
  Object.values(state.records).forEach((record) => {
    record.shippers?.forEach((shipper) => {
      if (shipper.name) names.add(shipper.name);
    });
  });
  Object.values(state.floorplans).forEach((plan) => {
    plan.zones?.forEach((zone) => {
      if (zone.customer) names.add(zone.customer);
    });
  });
  return [...names].sort((a, b) => a.localeCompare(b, "ko-KR"));
}

function mappedShippersForCenter(center) {
  const mapped = state.centerShipperMap?.[center] || [];
  return mapped.length ? mapped : allShipperNames();
}

function renderNav() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
      document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
      button.classList.add("active");
      $(`#${button.dataset.view}`).classList.add("active");
      renderAll();
      if (button.dataset.view === "mapView") setTwinViewMode(twinViewMode);
    });
  });
}

function renderFilters() {
  $("#centerSelect").innerHTML = state.centers
    .map((center) => `<option value="${center}">${center}</option>`)
    .join("");
  $("#centerSelect").value = selectedCenter;
  renderFloorSelectors();
  $("#majorSelect").innerHTML = Object.keys(state.majors)
    .map((major) => `<option value="${major}">${major}</option>`)
    .join("");
}

function renderFloorSelectors() {
  const floors = getCenterFloors(selectedCenter);
  if (!floors.includes(selectedFloor)) selectedFloor = floors[0];
  ["#floorSelect", "#floorplanFloorSelect"].forEach((selector) => {
    const select = $(selector);
    if (!select) return;
    select.innerHTML = floors.map((floor) => `<option value="${floor}">${floor}</option>`).join("");
    select.value = selectedFloor;
  });
}

function renderCenterSlicer() {
  if (!$("#centerSlicer")) return; // 센터 선택 카드 제거됨
  $("#centerSlicer").innerHTML = state.centers
    .map((center) => {
      const item = centerTotals(center);
      const free = item.capacity - item.used;
      const active = center === selectedCenter ? "active" : "";
      return `
        <button class="slicer-chip ${active}" data-center="${center}" type="button">
          <strong>${center}</strong>
          <span>여유 ${formatPlt(free)}</span>
        </button>
      `;
    })
    .join("");

  document.querySelectorAll(".slicer-chip").forEach((button) => {
    button.addEventListener("click", () => {
      selectedCenter = button.dataset.center;
      selectedFloor = getCenterFloors(selectedCenter)[0];
      selectedZoneId = null;
      renderAll();
    });
  });
}

function renderDashboard() {
  const sourceCenters = state.centers;
  const totals = grandTotals(ALL, sourceCenters);
  const free = Math.max(totals.capacity - totals.used, 0);
  const usedShare = percent(totals.used, totals.capacity);
  const freeShare = percent(free, totals.capacity);

  $("#totalCapacity").textContent = formatPlt(totals.capacity);
  $("#totalUsed").textContent = formatPlt(totals.used);
  $("#totalFree").textContent = formatPlt(free);
  $("#averageRate").textContent = `${percent(totals.used, totals.capacity)}%`;
  $("#capacityMixBar").innerHTML = `
    <div class="mix-segment used" style="width:${Math.min(usedShare, 100)}%">
      <strong>${formatPlt(totals.used)}</strong>
      <span>사용 ${usedShare}%</span>
    </div>
    <div class="mix-segment free" style="width:${Math.max(100 - usedShare, 0)}%">
      <strong>${formatPlt(free)}</strong>
      <span>여유 ${freeShare}%</span>
    </div>
  `;

  renderOverviewChart(sourceCenters);
  renderCenterDetail();
  renderFloorplan();
}

function renderUsageRow(center) {
  const item = centerTotals(center);
  const rate = percent(item.used, item.capacity);
  const free = item.capacity - item.used;
  const freeRate = percent(free, item.capacity);
  const level = rate >= 95 ? "danger" : rate >= 80 ? "warning" : "";
  const freeLevel = freeRate >= 30 ? "high" : freeRate >= 15 ? "medium" : "low";
  return `
    <div class="usage-row ${freeLevel}">
      <div class="usage-main">
        <div class="usage-label">${center}</div>
        <div class="usage-track" title="사용률 ${rate}%">
          <div class="usage-fill ${level}" style="width:${Math.min(rate, 100)}%"></div>
        </div>
        <strong class="usage-rate">${rate}%</strong>
      </div>
      <div class="usage-metrics">
        <span><small>가능</small>${formatPlt(item.capacity)}</span>
        <span><small>사용</small>${formatPlt(item.used)}</span>
        <span class="free-capa"><small>여유</small>${formatPlt(free)}<em>${freeRate}%</em></span>
      </div>
    </div>
  `;
}

function renderOverviewChart(centers) {
  const rows = centers.map((center) => {
    const item = centerTotals(center);
    return {
      center,
      capacity: item.capacity,
      used: item.used,
      free: Math.max(item.capacity - item.used, 0),
      rate: percent(item.used, item.capacity),
    };
  });
  $("#overviewChart").innerHTML = rows
    .map(
      (row) => `
        <button class="overview-row clickable ${row.center === selectedCenter ? "active" : ""}" data-center="${row.center}" type="button">
          <strong class="overview-center">${row.center}</strong>
          ${renderOverviewStackedBar(row)}
          <div class="overview-metrics">
            <span><b>전체</b>${formatPlt(row.capacity)}</span>
            <span><b>사용</b>${formatPlt(row.used)}</span>
            <span class="free-value"><b>여유</b>${formatPlt(row.free)}</span>
          </div>
        </button>
      `,
    )
    .join("");

  document.querySelectorAll("#overviewChart .overview-row").forEach((btn) => {
    btn.addEventListener("click", () => {
      const center = btn.dataset.center;
      selectedCenter = center;
      selectedFloor = getCenterFloors(center)[0];
      twinCenter = center;
      twinFloor = null;
      selectedZoneId = null;
      selectedRackId = null;
      // 3D 점유도 탭으로 이동 (nav 버튼 클릭 → 탭 전환 + 트윈 렌더)
      document.querySelector('[data-view="mapView"]')?.click();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

function renderOverviewStackedBar(row) {
  const usedShare = Math.min(percent(row.used, row.capacity), 100);
  const freeShare = Math.max(100 - usedShare, 0);
  return `
    <div class="overview-stack-wrap">
      <div class="overview-stack" aria-label="${row.center} 전체 ${formatPlt(row.capacity)} 중 사용 ${formatPlt(row.used)}, 여유 ${formatPlt(row.free)}">
        <i class="used" style="width:${usedShare}%"></i>
        <i class="free" style="width:${freeShare}%"></i>
      </div>
      <strong>${row.rate}%</strong>
    </div>
  `;
}

function renderCenterDetail() {
  const item = centerTotals(selectedCenter);
  const free = item.capacity - item.used;
  const rate = percent(item.used, item.capacity);
  const shippers = aggregateShippers(item.shippers);

  $("#detailCenterName").textContent = selectedCenter;
  $("#aerialCenterName").textContent = selectedCenter;
  const info = normalizeCenterInfo(selectedCenter);
  $("#aerialAddress").textContent =
    info.address || (CENTER_IMAGES[selectedCenter] ? "센터 조감도 이미지 적용" : "센터 조감도 이미지 미등록");
  const aerialCard = document.querySelector(".aerial-card");
  if (CENTER_IMAGES[selectedCenter]) {
    aerialCard.classList.add("has-image");
    aerialCard.style.backgroundImage =
      `linear-gradient(180deg, rgba(20, 33, 58, 0.04), rgba(20, 33, 58, 0.76)), url("${CENTER_IMAGES[selectedCenter]}")`;
  } else {
    aerialCard.classList.remove("has-image");
    aerialCard.style.backgroundImage = "";
  }
  $("#detailFreeBadge").textContent = `여유 ${formatPlt(free)}`;
  $("#detailRateBadge").textContent = `사용률 ${rate}%`;

  $("#detailCategorySummary").innerHTML = Object.entries(state.majors)
    .map(([major, minors]) => {
      const totals = centerTotals(selectedCenter, major);
      const majorFree = totals.capacity - totals.used;
      return `
        <div class="category-stat">
          <div>
            <strong>${major}</strong>
            <span>사용 ${formatPlt(totals.used)} / 가능 ${formatPlt(totals.capacity)}</span>
          </div>
          <b>${formatPlt(majorFree)}</b>
        </div>
      `;
    })
    .join("");

  const totalShipperUsed = shippers.reduce((sum, shipper) => sum + shipper.used, 0);
  $("#detailCustomerBars").innerHTML =
    shippers
      .slice(0, 8)
      .map((shipper) => {
        const share = percent(shipper.used, totalShipperUsed);
        return `
          <div class="customer-bar">
            <div>
              <strong>${shipper.name}</strong>
              <span>${formatPlt(shipper.used)} · ${share}%</span>
            </div>
            <div class="mini-track"><i style="width:${share}%"></i></div>
          </div>
        `;
      })
      .join("") || `<div class="empty">화주사 점유 CAPA를 입력하면 표시됩니다.</div>`;
}

function renderCenterMap() {
  if (!$("#centerMap") || !document.getElementById("mapView").classList.contains("active")) return;
  $("#kakaoApiKeyInput").value = state.kakaoApiKey || "";
  if (state.kakaoApiKey) {
    renderKakaoCenterMap();
    return;
  }
  setKakaoMapStatus("키 미등록", "dirty");
  renderFallbackCenterMap();
}

function renderFallbackCenterMap() {
  $("#centerMap").innerHTML = `
    <div class="korea-map-frame" aria-hidden="true"></div>
    ${state.centers
      .map((center) => {
        const info = normalizeCenterInfo(center);
        if (!info.isHub) return "";
        const pos = CENTER_MAP_POSITIONS[center] || { x: 50, y: 50 };
        const radius = Math.min(Math.max(number(info.coverageRadius) * 1.3, 70), 260);
        return `<div class="fallback-coverage" style="left:${pos.x}%;top:${pos.y}%;width:${radius}px;height:${radius}px;"></div>`;
      })
      .join("")}
    ${state.centers
      .map((center) => {
        const pos = CENTER_MAP_POSITIONS[center] || { x: 50, y: 50 };
        const info = normalizeCenterInfo(center);
        return `
          <button class="map-marker ${center === selectedCenter ? "active" : ""} ${info.isHub ? "hub" : ""}" data-center="${center}" type="button"
            style="left:${pos.x}%;top:${pos.y}%;">
            <i></i>
            <span>${center}</span>
          </button>
        `;
      })
      .join("")}
  `;

  document.querySelectorAll(".map-marker").forEach((button) => {
    button.addEventListener("click", () => {
      selectedCenter = button.dataset.center;
      selectedFloor = getCenterFloors(selectedCenter)[0];
      selectedZoneId = null;
      document.querySelectorAll(".map-marker").forEach((item) =>
        item.classList.toggle("active", item.dataset.center === selectedCenter),
      );
    });
  });

  renderCenterMapInfo();
}

function setKakaoMapStatus(message, type = "") {
  const status = $("#kakaoMapStatus");
  if (!status) return;
  status.textContent = message;
  status.classList.toggle("dirty", type === "dirty");
  status.classList.toggle("saved", type === "saved");
}

function renderKakaoCenterMap() {
  setKakaoMapStatus("지도 로딩 중", "dirty");
  loadKakaoMapSdk()
    .then(() => drawKakaoCenterMap())
    .catch(() => {
      setKakaoMapStatus("카카오맵 로딩 실패", "dirty");
      renderFallbackCenterMap();
    });
}

function loadKakaoMapSdk() {
  if (window.kakao?.maps?.Map) return Promise.resolve();
  if (kakaoScriptLoading) {
    return new Promise((resolve, reject) => {
      const timer = window.setInterval(() => {
        if (window.kakao?.maps?.Map) {
          window.clearInterval(timer);
          resolve();
        }
      }, 100);
      window.setTimeout(() => {
        window.clearInterval(timer);
        reject();
      }, 8000);
    });
  }
  kakaoScriptLoading = true;
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(state.kakaoApiKey)}&autoload=false&libraries=services`;
    script.onload = () => {
      kakaoScriptLoading = false;
      window.kakao.maps.load(resolve);
    };
    script.onerror = () => {
      kakaoScriptLoading = false;
      reject();
    };
    document.head.appendChild(script);
  });
}

function drawKakaoCenterMap() {
  const container = $("#centerMap");
  container.innerHTML = "";
  const kakao = window.kakao;
  kakaoMap = new kakao.maps.Map(container, {
    center: new kakao.maps.LatLng(36.15, 127.85),
    level: 13,
  });
  kakaoMap.setMinLevel(6);
  kakaoMap.setMaxLevel(13);
  const serviceBounds = new kakao.maps.LatLngBounds(
    new kakao.maps.LatLng(KOREA_SERVICE_BOUNDS.sw.lat, KOREA_SERVICE_BOUNDS.sw.lng),
    new kakao.maps.LatLng(KOREA_SERVICE_BOUNDS.ne.lat, KOREA_SERVICE_BOUNDS.ne.lng),
  );
  kakaoMap.setBounds(serviceBounds);
  kakao.maps.event.addListener(kakaoMap, "dragend", () => keepMapInsideServiceBounds(serviceBounds));
  kakao.maps.event.addListener(kakaoMap, "zoom_changed", () => keepMapInsideServiceBounds(serviceBounds));
  kakaoMarkers.forEach((marker) => marker.setMap(null));
  kakaoCoverageCircles.forEach((circle) => circle.setMap(null));
  if (kakaoInfoWindow) kakaoInfoWindow.setMap(null);
  kakaoMarkers = [];
  kakaoCoverageCircles = [];
  kakaoInfoWindow = new kakao.maps.CustomOverlay({ zIndex: 10, yAnchor: 1.15 });

  const geocoder = new kakao.maps.services.Geocoder();
  state.centers.forEach((center) => {
    const info = normalizeCenterInfo(center);
    const fallback = CENTER_MAP_POSITIONS[center] || { x: 50, y: 50 };
    const fallbackLatLng = new kakao.maps.LatLng(36.85 + (100 - fallback.y) * 0.008, 126.7 + fallback.x * 0.012);
    const placeMarker = (latlng) => {
      if (info.isHub) {
        const circle = new kakao.maps.Circle({
          map: kakaoMap,
          center: latlng,
          radius: Math.max(number(info.coverageRadius), 1) * 1000,
          strokeWeight: 2,
          strokeColor: "#2f6f9f",
          strokeOpacity: 0.5,
          fillColor: "#2f6f9f",
          fillOpacity: 0.13,
        });
        kakaoCoverageCircles.push(circle);
      }
      const overlay = new kakao.maps.CustomOverlay({
        map: kakaoMap,
        position: latlng,
        yAnchor: 0.9,
        content: `
          <button class="kakao-center-marker circle ${center === selectedCenter ? "active" : ""} ${info.isHub ? "hub" : ""}" data-map-center="${center}" type="button" title="${center}">
            <i></i>
            <span>${center}</span>
          </button>
        `,
      });
      kakaoMarkers.push(overlay);
      window.setTimeout(bindKakaoCenterMarkerClicks, 0);
    };

    if (info.address) {
      geocoder.addressSearch(info.address, (result, status) => {
        if (status === kakao.maps.services.Status.OK && result[0]) {
          placeMarker(new kakao.maps.LatLng(result[0].y, result[0].x));
        } else {
          placeMarker(fallbackLatLng);
        }
      });
    } else {
      placeMarker(fallbackLatLng);
    }
  });
  setKakaoMapStatus("카카오맵 연동", "saved");
  renderCenterMapInfo();
}

function keepMapInsideServiceBounds(bounds) {
  if (!kakaoMap || bounds.contain(kakaoMap.getCenter())) return;
  kakaoMap.panTo(
    new window.kakao.maps.LatLng(KOREA_SERVICE_BOUNDS.center.lat, KOREA_SERVICE_BOUNDS.center.lng),
  );
}

function bindKakaoCenterMarkerClicks() {
  document.querySelectorAll(".kakao-center-marker").forEach((button) => {
    if (button.dataset.bound) return;
    button.dataset.bound = "true";
    button.addEventListener("click", () => {
      selectedCenter = button.dataset.mapCenter;
      selectedFloor = getCenterFloors(selectedCenter)[0];
      selectedZoneId = null;
      renderCenterSlicer();
      renderCenterDetail();
      document.querySelectorAll(".kakao-center-marker").forEach((item) =>
        item.classList.toggle("active", item.dataset.mapCenter === selectedCenter),
      );
    });
  });
}

function showKakaoCenterInfo(position, center) {
  const totals = centerTotals(center);
  const free = Math.max(totals.capacity - totals.used, 0);
  const info = normalizeCenterInfo(center);
  kakaoInfoWindow.setContent(`
    <div class="kakao-info-window">
      <strong>${center}</strong>
      ${info.isHub ? `<em>${info.coverageName || "거점 권역"} · ${formatKm(info.coverageRadius)}</em>` : ""}
      <span>전체 ${formatPlt(totals.capacity)}</span>
      <span>사용 ${formatPlt(totals.used)}</span>
      <span>여유 ${formatPlt(free)}</span>
    </div>
  `);
  kakaoInfoWindow.setPosition(position);
  kakaoInfoWindow.setMap(kakaoMap);
}

function formatKm(value) {
  return `${number(value).toLocaleString("ko-KR")}km`;
}

function renderCenterMapInfo() {
  if (!$("#centerMapInfo")) return;
  $("#centerMapInfo").innerHTML = "";
}

function renderEntry() {
  renderFloorSelectors();
  renderCapaEntryTable();
  renderShipperRows();
}

function renderCapaEntryTable() {
  const item = floorTotals(selectedCenter, selectedFloor);
  const free = Math.max(item.capacity - item.used, 0);
  $("#entrySummary").innerHTML = `
    <article>
      <span>선택 센터</span>
      <strong>${selectedCenter}</strong>
    </article>
    <article>
      <span>선택 층</span>
      <strong>${selectedFloor}</strong>
    </article>
    <article>
      <span>전체 CAPA</span>
      <strong>${formatPlt(item.capacity)}</strong>
    </article>
    <article>
      <span>사용 CAPA</span>
      <strong>${formatPlt(item.used)}</strong>
    </article>
    <article class="free">
      <span>여유 CAPA</span>
      <strong>${formatPlt(free)}</strong>
    </article>
  `;

  $("#capaEntryTable").innerHTML = `
    <div class="capa-entry-head">
      <span>대분류</span>
      <span>중분류</span>
      <span>가능 CAPA</span>
      <span>사용 CAPA</span>
      <span>여유</span>
      <span>사용률</span>
      <span>비고</span>
    </div>
    ${Object.entries(state.majors)
      .map(([major, minors]) =>
        minors
          .map((minor, index) => {
            const record = getRecord(selectedCenter, major, minor, selectedFloor);
            const capacity = number(record.capacity);
            const used = recordUsed(record);
            const freeValue = Math.max(capacity - used, 0);
            return `
              <div class="capa-entry-row">
                <strong class="${index === 0 ? "" : "muted-major"}">${index === 0 ? major : ""}</strong>
                <span>${minor}</span>
                <input class="capa-entry-input" data-major="${major}" data-minor="${minor}" data-field="capacity" type="number" min="0" step="1" value="${capacity || ""}" />
                <b>${formatPlt(used)}</b>
                <b class="free-value">${formatPlt(freeValue)}</b>
                <em>${percent(used, capacity)}%</em>
                <input class="capa-entry-input memo" data-major="${major}" data-minor="${minor}" data-field="memo" type="text" value="${record.memo || ""}" placeholder="비고" />
              </div>
            `;
          })
          .join(""),
      )
      .join("")}
  `;

  document.querySelectorAll(".capa-entry-input").forEach((input) => {
    input.addEventListener("input", saveCapaEntryInput);
    input.addEventListener("change", renderCapaEntryTable);
  });
}

function saveCapaEntryInput(event) {
  const { major, minor, field } = event.currentTarget.dataset;
  const record = getRecord(selectedCenter, major, minor, selectedFloor);
  if (field === "used") return;
  record[field] = field === "memo" ? event.currentTarget.value : number(event.currentTarget.value);
  saveState();
  markSaveStatus("capa", "dirty");
  renderDashboard();
  renderShipperAnalysis();
}

function centerShipperEntries() {
  return allCategories().flatMap(({ major, minor }) => {
    const record = getRecord(selectedCenter, major, minor, selectedFloor);
    return (record.shippers || []).map((shipper, index) => ({
      ...shipper,
      floor: selectedFloor,
      major,
      minor,
      index,
    }));
  });
}

function renderShipperRows() {
  if ($("#selectAllShipperRows")) $("#selectAllShipperRows").textContent = "전체 선택";
  const shipperOptions = mappedShippersForCenter(selectedCenter);
  const existingRows = centerShipperEntries();
  const existingNames = new Set(existingRows.map((shipper) => shipper.name).filter(Boolean));
  const hiddenMapped = new Set(state.hiddenMappedShippers[selectedCenter] || []);
  const mappedRows = shipperOptions
    .filter((name) => !existingNames.has(name) && !hiddenMapped.has(name))
    .map((name) => ({ name, used: 0, major: "보관공간", minor: "일반", isMappedDraft: true }));
  const rows = existingRows.length || mappedRows.length
    ? [...existingRows, ...mappedRows]
    : [{ name: "", used: 0, major: "보관공간", minor: "일반" }];
  $("#shipperRows").innerHTML = rows
    .map(
      (shipper) => `
        <div class="shipper-row ${shipper.isMappedDraft ? "mapped-draft" : ""}">
          <label class="row-check">
            <input class="shipper-select" type="checkbox" />
          </label>
          <select class="shipper-name">
            <option value="">화주사 선택</option>
            ${shipperOptions
              .concat(shipper.name && !shipperOptions.includes(shipper.name) ? [shipper.name] : [])
              .map(
                (name) =>
                  `<option value="${name}" ${name === shipper.name ? "selected" : ""}>${name}</option>`,
              )
              .join("")}
          </select>
          <select class="shipper-major">
            ${Object.keys(state.majors)
              .map(
                (major) =>
                  `<option value="${major}" ${major === shipper.major ? "selected" : ""}>${major}</option>`,
              )
              .join("")}
          </select>
          <select class="shipper-minor">
            ${state.majors[shipper.major || "보관공간"]
              .map(
                (minor) =>
                  `<option value="${minor}" ${minor === shipper.minor ? "selected" : ""}>${minor}</option>`,
              )
              .join("")}
          </select>
          <input class="shipper-used" type="number" min="0" step="1" value="${shipper.used || ""}" placeholder="점유 CAPA" />
          <button class="icon-button remove-shipper" type="button" title="삭제">×</button>
        </div>
      `,
    )
    .join("");

  document.querySelectorAll(".shipper-row").forEach((row) => {
    row.querySelector(".shipper-name").addEventListener("change", saveShippersFromRows);
    row.querySelector(".shipper-major").addEventListener("change", () => {
      const minorSelect = row.querySelector(".shipper-minor");
      minorSelect.innerHTML = state.majors[row.querySelector(".shipper-major").value]
        .map((minor) => `<option value="${minor}">${minor}</option>`)
        .join("");
      saveShippersFromRows();
    });
    row.querySelector(".shipper-minor").addEventListener("change", saveShippersFromRows);
    row.querySelector(".shipper-used").addEventListener("input", saveShippersFromRows);
    row.querySelector(".remove-shipper").addEventListener("click", (event) => {
      event.preventDefault();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      hideDeletedMappedRows([row]);
      row.remove();
      saveShippersFromRows({ quiet: true });
      markSaveStatus("shipper", "dirty");
      requestAnimationFrame(() => window.scrollTo(scrollX, scrollY));
    });
  });
}

function setAllShipperRowSelection(checked) {
  document.querySelectorAll(".shipper-select").forEach((checkbox) => {
    checkbox.checked = checked;
  });
}

function deleteSelectedShipperRows() {
  const selectedRows = [...document.querySelectorAll(".shipper-row")].filter(
    (row) => row.querySelector(".shipper-select")?.checked,
  );
  if (!selectedRows.length) return;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  hideDeletedMappedRows(selectedRows);
  selectedRows.forEach((row) => row.remove());
  saveShippersFromRows({ quiet: true });
  markSaveStatus("shipper", "dirty");
  requestAnimationFrame(() => window.scrollTo(scrollX, scrollY));
}

function addFloorToSelectedCenter() {
  const floors = getCenterFloors(selectedCenter);
  const nextNumber =
    floors
      .map((floor) => Number(String(floor).replace(/[^0-9]/g, "")))
      .filter(Boolean)
      .reduce((max, value) => Math.max(max, value), 0) + 1;
  const name = window.prompt("추가할 층명을 입력하세요.", `${nextNumber}F`);
  const floorName = name?.trim();
  if (!floorName) return;
  if (!state.centerFloors[selectedCenter]) state.centerFloors[selectedCenter] = ["1F"];
  if (state.centerFloors[selectedCenter].includes(floorName)) {
    selectedFloor = floorName;
  } else {
    state.centerFloors[selectedCenter].push(floorName);
    selectedFloor = floorName;
    saveState();
  }
  selectedZoneId = null;
  renderAll();
}

function hideDeletedMappedRows(rows) {
  if (!Array.isArray(state.hiddenMappedShippers[selectedCenter])) {
    state.hiddenMappedShippers[selectedCenter] = [];
  }
  const mapped = new Set(state.centerShipperMap[selectedCenter] || []);
  rows.forEach((row) => {
    const name = row.querySelector(".shipper-name")?.value;
    if (name && mapped.has(name) && !state.hiddenMappedShippers[selectedCenter].includes(name)) {
      state.hiddenMappedShippers[selectedCenter].push(name);
    }
  });
}

function saveShippersFromRows(options = {}) {
  allCategories().forEach(({ major, minor }) => {
    const record = getRecord(selectedCenter, major, minor, selectedFloor);
    record.shippers = [];
    record.used = 0;
  });
  const shippers = [...document.querySelectorAll(".shipper-row")]
    .map((row) => ({
      name: row.querySelector(".shipper-name").value.trim(),
      major: row.querySelector(".shipper-major").value,
      minor: row.querySelector(".shipper-minor").value,
      used: number(row.querySelector(".shipper-used").value),
    }))
    .filter((shipper) => shipper.name || shipper.used);
  shippers.forEach((shipper) => {
    getRecord(selectedCenter, shipper.major, shipper.minor, selectedFloor).shippers.push({
      name: shipper.name,
      used: shipper.used,
    });
  });
  allCategories().forEach(({ major, minor }) => {
    const record = getRecord(selectedCenter, major, minor, selectedFloor);
    record.used = recordUsed(record);
  });
  saveState();
  if (!options.skipStatus) markSaveStatus("shipper", "dirty");
  if (options.quiet) return;
  renderDashboard();
  renderShipperAnalysis();
}

function markSaveStatus(type, statusType) {
  const status = type === "capa" ? $("#capaSaveStatus") : $("#shipperSaveStatus");
  if (!status) return;
  status.textContent = statusType === "saved" ? "저장 완료" : "수정 중";
  status.classList.toggle("dirty", statusType === "dirty");
  status.classList.toggle("saved", statusType === "saved");
}

function saveCapaEntryChanges() {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  saveState();
  renderDashboard();
  renderShipperAnalysis();
  renderCapaEntryTable();
  markSaveStatus("capa", "saved");
  requestAnimationFrame(() => window.scrollTo(scrollX, scrollY));
}

function saveShipperEntryChanges() {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  saveShippersFromRows({ quiet: true, skipStatus: true });
  saveState();
  renderDashboard();
  renderShipperAnalysis();
  renderCapaEntryTable();
  markSaveStatus("shipper", "saved");
  requestAnimationFrame(() => window.scrollTo(scrollX, scrollY));
}

function renderShipperAnalysis() {
  const names = allShipperNames();
  const search = $("#shipperSearchInput")?.value.trim() || "";
  const isOverall = !search;
  const selectedName =
    isOverall ? "" : names.find((name) => name.toLowerCase().includes(search.toLowerCase())) || "";
  const trend = isOverall ? buildOverallShipperTrend() : buildShipperTrend(selectedName);
  const targetKey = shipperTargetKey(isOverall ? "" : selectedName);
  const targetAverage = number(state.shipperTargetAverages[targetKey]);
  if ($("#shipperTargetAverageInput")) {
    $("#shipperTargetAverageInput").value = targetAverage || "";
    $("#shipperTargetAverageInput").placeholder = isOverall ? "전체 기준 PLT" : `${selectedName || "화주사"} 기준 PLT`;
  }
  const maxValue = Math.max(...trend.map((item) => item.value), targetAverage, 1);
  const total = trend.reduce((sum, item) => sum + item.value, 0);
  const average = Math.round(total / Math.max(trend.length, 1));
  const peak = trend.reduce((best, item) => (item.value > best.value ? item : best), trend[0]);
  const overTargetMonths = targetAverage
    ? trend.filter((item) => item.value > targetAverage).map((item) => item.month)
    : [];
  const matchedNames = search
    ? names.filter((name) => name.toLowerCase().includes(search.toLowerCase())).slice(0, 8)
    : names.slice(0, 8);
  renderShipperSuggestions(matchedNames, selectedName);

  $("#shipperTrendSummary").innerHTML = isOverall || selectedName
    ? `
      <article>
        <span>${isOverall ? "분석 기준" : "검색 화주사"}</span>
        <strong>${isOverall ? "전체 화주사" : selectedName}</strong>
      </article>
      <article>
        <span>월평균 보관량</span>
        <strong>${formatPlt(average)}</strong>
      </article>
      <article>
        <span>최대 보관월</span>
        <strong>${peak.month}월 · ${formatPlt(peak.value)}</strong>
      </article>
      <article>
        <span>기준 초과 월</span>
        <strong>${targetAverage ? `${overTargetMonths.length}개월` : "기준 미입력"}</strong>
      </article>
    `
    : `<div class="empty">화주사 데이터를 입력하면 월별 보관량 추이 화면이 표시됩니다.</div>`;

  $("#shipperTrendChart").innerHTML = isOverall || selectedName
    ? `
      <svg class="trend-line" viewBox="0 0 1200 220" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="trendStroke" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stop-color="#2f6f9f"></stop>
            <stop offset="100%" stop-color="#1f9f8a"></stop>
          </linearGradient>
          <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#2f6f9f" stop-opacity="0.18"></stop>
            <stop offset="100%" stop-color="#2f6f9f" stop-opacity="0"></stop>
          </linearGradient>
        </defs>
        <polyline points="${buildTrendLinePoints(trend, maxValue)}"></polyline>
        ${targetAverage ? buildTargetAverageLine(targetAverage, maxValue) : ""}
        ${trend
          .map((item, index) => {
            const x = 50 + index * 100;
            const y = 204 - (item.value / maxValue) * 180;
            const alertClass = targetAverage && item.value > targetAverage ? " class=\"over-target\"" : "";
            return `<circle${alertClass} cx="${x}" cy="${y}" r="8"></circle>`;
          })
          .join("")}
      </svg>
      ${trend
          .map(
            (item) => `
          <div class="trend-month ${targetAverage && item.value > targetAverage ? "over-target" : ""}">
            <div class="trend-bar-wrap">
              <strong>${formatPlt(item.value)}</strong>
              <i style="height:${Math.max((item.value / maxValue) * 100, item.value ? 5 : 0)}%"></i>
            </div>
            <span>${item.month}월</span>
          </div>
        `,
          )
          .join("")}
    `
    : "";

  $("#shipperAnalysis").innerHTML = "";
}

function buildTrendLinePoints(trend, maxValue) {
  return trend
    .map((item, index) => {
      const x = 50 + index * 100;
      const y = 204 - (item.value / maxValue) * 180;
      return `${x},${y}`;
    })
    .join(" ");
}

function buildTrendAreaPoints(trend, maxValue) {
  return `50,220 ${buildTrendLinePoints(trend, maxValue)} 1150,220`;
}

function buildTargetAverageLine(targetAverage, maxValue) {
  const y = 204 - (targetAverage / maxValue) * 180;
  return `
    <g class="target-average-line">
      <line x1="40" y1="${y}" x2="1160" y2="${y}"></line>
    </g>
  `;
}

function shipperTargetKey(name) {
  return name || "__overall__";
}

function saveShipperTargetAverage() {
  const names = allShipperNames();
  const search = $("#shipperSearchInput")?.value.trim() || "";
  const selectedName = search
    ? names.find((name) => name.toLowerCase().includes(search.toLowerCase())) || ""
    : "";
  const key = shipperTargetKey(selectedName);
  const value = number($("#shipperTargetAverageInput").value);
  if (!state.shipperTargetAverages) state.shipperTargetAverages = {};
  if (value) {
    state.shipperTargetAverages[key] = value;
  } else {
    delete state.shipperTargetAverages[key];
  }
  saveState();
  renderShipperAnalysis();
}

function renderShipperSuggestions(names, selectedName) {
  const panel = $("#shipperSuggestPanel");
  if (!panel) return;
  if (!shipperSuggestOpen || !names.length) {
    panel.innerHTML = "";
    panel.classList.remove("open");
    return;
  }
  panel.classList.add("open");
  panel.innerHTML = names
    .map(
      (name) => `
        <button class="${name === selectedName ? "active" : ""}" data-shipper="${name}" type="button">
          <strong>${name}</strong>
          <span>${formatPlt(currentShipperUsed(name))}</span>
        </button>
      `,
    )
    .join("");
  panel.querySelectorAll("button").forEach((button) => {
    button.addEventListener("mousedown", (event) => {
      event.preventDefault();
      $("#shipperSearchInput").value = button.dataset.shipper;
      shipperSuggestOpen = false;
      renderShipperAnalysis();
    });
  });
}

function handleShipperSearchKeydown(event) {
  const panel = $("#shipperSuggestPanel");
  const buttons = panel ? [...panel.querySelectorAll("button")] : [];
  if (event.key === "ArrowDown") {
    event.preventDefault();
    shipperSuggestOpen = true;
    if (!buttons.length) {
      renderShipperAnalysis();
      return;
    }
    const currentIndex = buttons.findIndex((button) => button.classList.contains("keyboard"));
    buttons.forEach((button) => button.classList.remove("keyboard"));
    buttons[(currentIndex + 1) % buttons.length].classList.add("keyboard");
    buttons[(currentIndex + 1) % buttons.length].scrollIntoView({ block: "nearest" });
  }
  if (event.key === "ArrowUp" && buttons.length) {
    event.preventDefault();
    const currentIndex = buttons.findIndex((button) => button.classList.contains("keyboard"));
    buttons.forEach((button) => button.classList.remove("keyboard"));
    const nextIndex = currentIndex <= 0 ? buttons.length - 1 : currentIndex - 1;
    buttons[nextIndex].classList.add("keyboard");
    buttons[nextIndex].scrollIntoView({ block: "nearest" });
  }
  if (event.key === "Enter") {
    const selected = buttons.find((button) => button.classList.contains("keyboard"));
    if (!selected) return;
    event.preventDefault();
    $("#shipperSearchInput").value = selected.dataset.shipper;
    shipperSuggestOpen = false;
    renderShipperAnalysis();
  }
}

function currentShipperUsed(name) {
  const recordUsed = Object.values(state.records).reduce(
    (sum, record) =>
      sum +
      (record.shippers || []).reduce(
        (shipperSum, shipper) =>
          shipper.name === name ? shipperSum + number(shipper.used) : shipperSum,
        0,
      ),
    0,
  );
  const floorplanUsed = Object.values(state.floorplans).reduce(
    (sum, plan) =>
      sum +
      (plan.zones || []).reduce(
        (zoneSum, zone) => (zone.customer === name ? zoneSum + number(zone.capa) : zoneSum),
        0,
      ),
    0,
  );
  return recordUsed + floorplanUsed;
}

function buildShipperTrend(name) {
  const base = Math.max(currentShipperUsed(name), 0);
  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const seasonal = 0.84 + index * 0.025 + (index % 3) * 0.035;
    const value = base ? Math.round(base * seasonal) : 0;
    return { month, value };
  });
}

function buildOverallShipperTrend() {
  const base = allShipperNames().reduce((sum, name) => sum + currentShipperUsed(name), 0);
  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const seasonal = 0.88 + index * 0.018 + (index % 4) * 0.028;
    const value = base ? Math.round(base * seasonal) : 0;
    return { month, value };
  });
}

function renderCenterManager() {
  $("#centerManager").innerHTML = state.centers
    .map((center) => {
      const item = centerTotals(center);
      return `
        <div class="center-item">
          <div>
            <strong>${center}</strong>
            <span>${formatPlt(item.capacity)} / 사용률 ${percent(item.used, item.capacity)}%</span>
          </div>
          <button class="danger remove-center" data-center="${center}" type="button">삭제</button>
        </div>
      `;
    })
    .join("");

  document.querySelectorAll(".remove-center").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.centers.length <= 1) return;
      state.centers = state.centers.filter((center) => center !== button.dataset.center);
      Object.keys(state.records).forEach((key) => {
        if (key.startsWith(`${button.dataset.center}||`)) delete state.records[key];
      });
      delete state.floorplans[button.dataset.center];
      delete state.centerShipperMap[button.dataset.center];
      delete state.hiddenMappedShippers[button.dataset.center];
      delete state.centerInfo[button.dataset.center];
      selectedCenter = state.centers[0];
      selectedZoneId = null;
      saveState();
      renderAll();
    });
  });
}

function renderShipperMasterManager() {
  $("#shipperMasterManager").innerHTML =
    state.shippers
      .slice()
      .sort((a, b) => a.localeCompare(b, "ko-KR"))
      .map(
        (name) => `
          <div class="center-item">
            <div>
              <strong>${name}</strong>
              <span>${mappedCentersForShipper(name).join(", ") || "센터 맵핑 없음"}</span>
            </div>
            <button class="danger remove-master-shipper" data-shipper="${name}" type="button">삭제</button>
          </div>
        `,
      )
      .join("") || `<div class="empty">화주사를 추가하면 표시됩니다.</div>`;

  document.querySelectorAll(".remove-master-shipper").forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.dataset.shipper;
      state.shippers = state.shippers.filter((shipper) => shipper !== name);
      Object.keys(state.centerShipperMap).forEach((center) => {
        state.centerShipperMap[center] = state.centerShipperMap[center].filter(
          (shipper) => shipper !== name,
        );
      });
      saveState();
      renderAll();
    });
  });
}

function renderCenterInfoManager() {
  $("#centerInfoManager").innerHTML = state.centers
    .map((center) => {
      const info = normalizeCenterInfo(center);
      return `
        <div class="center-info-row">
          <strong>${center}</strong>
          <input class="center-info-input" data-center="${center}" data-field="address" type="text" value="${info.address || ""}" placeholder="센터 주소" />
          <input class="center-info-input" data-center="${center}" data-field="note" type="text" value="${info.note || ""}" placeholder="소개 문구" />
          <input class="center-info-input" data-center="${center}" data-field="manager" type="text" value="${info.manager || ""}" placeholder="담당/문의" />
          <label class="hub-check">
            <input class="center-info-input" data-center="${center}" data-field="isHub" type="checkbox" ${info.isHub ? "checked" : ""} />
            거점
          </label>
          <input class="center-info-input" data-center="${center}" data-field="coverageName" type="text" value="${info.coverageName || ""}" placeholder="커버 권역명" />
          <input class="center-info-input" data-center="${center}" data-field="coverageRadius" type="number" min="1" step="1" value="${info.coverageRadius || 25}" placeholder="반경 km" />
        </div>
      `;
    })
    .join("");
}

function saveCenterInfoManager() {
  document.querySelectorAll(".center-info-input").forEach((input) => {
    const { center, field } = input.dataset;
    if (!state.centerInfo[center]) state.centerInfo[center] = defaultCenterInfo(center);
    if (field === "isHub") {
      state.centerInfo[center][field] = input.checked;
    } else if (field === "coverageRadius") {
      state.centerInfo[center][field] = number(input.value) || 25;
    } else {
      state.centerInfo[center][field] = input.value.trim();
    }
  });
  saveState();
  renderDashboard();
  renderCenterMap();
}

function saveKakaoApiKey() {
  state.kakaoApiKey = $("#kakaoApiKeyInput").value.trim();
  saveState();
  kakaoMap = null;
  kakaoMarkers = [];
  setKakaoMapStatus(state.kakaoApiKey ? "API 키 저장됨" : "키 미등록", state.kakaoApiKey ? "saved" : "dirty");
  renderCenterMap();
}

function mappedCentersForShipper(name) {
  return state.centers.filter((center) => state.centerShipperMap[center]?.includes(name));
}

function openMappingModal() {
  mappingSelectedCenter = mappingSelectedCenter || state.centers[0];
  mappingDraft = structuredClone(state.centerShipperMap || {});
  state.centers.forEach((center) => {
    if (!Array.isArray(mappingDraft[center])) mappingDraft[center] = [];
  });
  $("#mappingModal").classList.add("open");
  $("#mappingModal").setAttribute("aria-hidden", "false");
  renderMappingModal();
}

function closeMappingModal() {
  $("#mappingModal").classList.remove("open");
  $("#mappingModal").setAttribute("aria-hidden", "true");
}

function renderMappingModal() {
  $("#mappingCenterList").innerHTML = state.centers
    .map(
      (center) => `
        <button class="mapping-center ${center === mappingSelectedCenter ? "active" : ""}" data-center="${center}" type="button">
          <strong>${center}</strong>
          <span>${(mappingDraft[center] || []).length}개 화주</span>
        </button>
      `,
    )
    .join("");

  $("#mappingShipperSource").innerHTML =
    state.shippers
      .slice()
      .sort((a, b) => a.localeCompare(b, "ko-KR"))
      .map(
        (name) => `
          <button class="mapping-shipper" draggable="true" data-shipper="${name}" type="button">${name}</button>
        `,
      )
      .join("") || `<div class="empty">화주사를 먼저 추가하세요.</div>`;

  $("#mappingTargetTitle").textContent = `${mappingSelectedCenter} 맵핑 화주`;
  $("#mappingDropzone").innerHTML =
    (mappingDraft[mappingSelectedCenter] || [])
      .map(
        (name) => `
          <button class="mapped-shipper" data-shipper="${name}" type="button">
            <strong>${name}</strong>
            <span>×</span>
          </button>
        `,
      )
      .join("") || `<div class="empty">화주사를 이곳으로 드래그하세요.</div>`;

  document.querySelectorAll(".mapping-center").forEach((button) => {
    button.addEventListener("click", () => {
      mappingSelectedCenter = button.dataset.center;
      renderMappingModal();
    });
  });
  document.querySelectorAll(".mapping-shipper").forEach((button) => {
    button.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", button.dataset.shipper);
    });
    button.addEventListener("dblclick", () => addMappingShipper(button.dataset.shipper));
  });
  document.querySelectorAll(".mapped-shipper").forEach((button) => {
    button.addEventListener("click", () => {
      mappingDraft[mappingSelectedCenter] = mappingDraft[mappingSelectedCenter].filter(
        (name) => name !== button.dataset.shipper,
      );
      renderMappingModal();
    });
  });
}

function addMappingShipper(name) {
  if (!name) return;
  const current = mappingDraft[mappingSelectedCenter] || [];
  if (!current.includes(name)) current.push(name);
  mappingDraft[mappingSelectedCenter] = current;
  renderMappingModal();
}

function saveMappingModal() {
  state.centerShipperMap = mappingDraft;
  state.hiddenMappedShippers = {};
  state.centers.forEach((center) => {
    state.hiddenMappedShippers[center] = [];
  });
  saveState();
  closeMappingModal();
  renderAll();
}

function renderCategoryManager() {
  $("#categoryManager").innerHTML = Object.entries(state.majors)
    .map(
      ([major, minors]) => `
        <div class="category-block">
          <h3 class="category-title">${major}</h3>
          ${minors
            .map(
              (minor) => `
                <div class="category-item">
                  <div>
                    <strong>${minor}</strong>
                    <span>${major}</span>
                  </div>
                  <button class="danger remove-category" data-major="${major}" data-minor="${minor}" type="button">삭제</button>
                </div>
              `,
            )
            .join("")}
        </div>
      `,
    )
    .join("");

  document.querySelectorAll(".remove-category").forEach((button) => {
    button.addEventListener("click", () => {
      const { major, minor } = button.dataset;
      if (state.majors[major].length <= 1) return;
      state.majors[major] = state.majors[major].filter((item) => item !== minor);
      Object.keys(state.records).forEach((key) => {
        if (key.includes(`||${major}||${minor}`)) delete state.records[key];
      });
      selectedCategory = allCategories()[0];
      saveState();
      renderAll();
    });
  });
}

function renderFloorplan() {
  renderFloorSelectors();
  if (!$("#floorplanStage")) return; // 대시보드에서 도면 점유도 패널 제거됨
  const plan = getFloorplan(selectedCenter, selectedFloor);
  plan.zones.forEach((zone, index) => {
    if (!zone.color) zone.color = ZONE_COLORS[index % ZONE_COLORS.length];
    if (!Array.isArray(zone.cells)) zone.cells = [];
    if (!zone.type) zone.type = zone.cells.length ? "cell" : "box";
  });
  const image = $("#floorplanImage");
  image.src = plan.image || "";
  image.style.display = plan.image ? "block" : "none";
  $("#floorplanEmpty").style.display = plan.image ? "none" : "grid";

  $("#cellLayer").innerHTML = renderFloorplanCells(plan);
  $("#cellLayer").classList.toggle("disabled", floorplanMode !== "cell");
  $("#zoneLayer").classList.toggle("disabled", floorplanMode !== "box");

  $("#zoneLayer").innerHTML = plan.zones
    .filter((zone) => zone.type === "box")
    .map(
      (zone) => `
        <button class="floor-zone ${zone.id === selectedZoneId ? "active" : ""}" data-zone-id="${zone.id}" type="button"
          style="left:${zone.x}%;top:${zone.y}%;width:${zone.w}%;height:${zone.h}%;--zone-color:${zone.color};--zone-bg:${hexToRgba(zone.color, 0.26)};">
          <strong>${zone.customer || "고객사"}</strong>
          <span>${zone.name || "구역"} · ${formatPlt(zone.capa)}</span>
        </button>
      `,
    )
    .join("");

  if (floorplanMode === "cell") {
    document.querySelectorAll(".floor-cell").forEach((cell) => {
      cell.addEventListener("pointerdown", startCellPaint);
      cell.addEventListener("pointerenter", continueCellPaint);
      cell.addEventListener("click", selectPaintedCell);
    });
  }

  document.querySelectorAll(".floor-zone").forEach((zoneEl) => {
    zoneEl.addEventListener("click", () => {
      selectedZoneId = zoneEl.dataset.zoneId;
      floorplanMode = selectedZone()?.type || floorplanMode;
      renderFloorplan();
    });
    if (floorplanMode === "box") {
      zoneEl.addEventListener("pointerdown", startZoneDrag);
    }
  });

  renderZoneEditor();
  renderFloorplanMode();
}

function renderFloorplanMode() {
  document.querySelectorAll("[data-floorplan-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.floorplanMode === floorplanMode);
  });
  const hint = $("#floorplanModeHint");
  if (!hint) return;
  hint.textContent =
    floorplanMode === "cell"
      ? "셀 편집 모드입니다. 영역을 선택한 뒤 도면 셀을 클릭하거나 드래그해 비정형 점유 구역을 칠합니다."
      : "박스 편집 모드입니다. 영역 박스를 클릭한 뒤 드래그하거나 X/Y/너비/높이 값을 조정합니다.";
}

function renderFloorplanCells(plan) {
  const zoneByCell = new Map();
  plan.zones
    .filter((zone) => zone.type !== "box")
    .forEach((zone) => {
    zone.cells.forEach((cell) => zoneByCell.set(String(cell), zone));
  });

  return Array.from({ length: FLOORPLAN_COLS * FLOORPLAN_ROWS }, (_, index) => {
    const zone = zoneByCell.get(String(index));
    const title = zone
      ? `${zone.customer || "고객사"} · ${zone.name || "구역"} · ${formatPlt(zone.capa)}`
      : "빈 셀";
    const style = zone
      ? `--cell-color:${zone.color};--cell-bg:${hexToRgba(zone.color, 0.34)};`
      : "";
    return `
      <button class="floor-cell ${zone ? "painted" : ""} ${zone?.id === selectedZoneId ? "active" : ""}"
        data-cell="${index}" data-zone-id="${zone?.id || ""}" type="button" title="${title}" style="${style}"></button>
    `;
  }).join("");
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const value = parseInt(clean, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function selectedZone() {
  const plan = getFloorplan(selectedCenter, selectedFloor);
  return plan.zones.find((zone) => zone.id === selectedZoneId);
}

function renderZoneEditor() {
  const zone = selectedZone();
  const disabled = !zone;
  [
    "#zoneCustomerInput",
    "#zoneNameInput",
    "#zoneCapaInput",
    "#zoneXInput",
    "#zoneYInput",
    "#zoneWInput",
    "#zoneHInput",
    "#clearZoneCellsButton",
    "#deleteZoneButton",
  ].forEach((selector) => {
    $(selector).disabled = disabled;
  });

  $("#zoneCustomerInput").value = zone?.customer || "";
  $("#zoneNameInput").value = zone?.name || "";
  $("#zoneCapaInput").value = zone?.capa || "";
  $("#zoneXInput").value = zone?.x || 10;
  $("#zoneYInput").value = zone?.y || 10;
  $("#zoneWInput").value = zone?.w || 25;
  $("#zoneHInput").value = zone?.h || 18;
  document.querySelector(".range-grid").classList.toggle("muted-control", floorplanMode === "cell");
}

function updateSelectedZone(patch) {
  const zone = selectedZone();
  if (!zone) return;
  Object.assign(zone, patch);
  zone.x = Math.min(number(zone.x), 100 - number(zone.w));
  zone.y = Math.min(number(zone.y), 100 - number(zone.h));
  saveState();
  renderFilters();
  renderFloorplan();
}

function startZoneDrag(event) {
  const zone = getFloorplan(selectedCenter, selectedFloor).zones.find(
    (item) => item.id === event.currentTarget.dataset.zoneId,
  );
  if (!zone) return;
  selectedZoneId = zone.id;
  const stage = $("#floorplanStage").getBoundingClientRect();
  const startX = event.clientX;
  const startY = event.clientY;
  const originX = zone.x;
  const originY = zone.y;
  event.currentTarget.setPointerCapture(event.pointerId);

  function move(pointerEvent) {
    const dx = ((pointerEvent.clientX - startX) / stage.width) * 100;
    const dy = ((pointerEvent.clientY - startY) / stage.height) * 100;
    zone.x = Math.max(0, Math.min(100 - zone.w, Math.round(originX + dx)));
    zone.y = Math.max(0, Math.min(100 - zone.h, Math.round(originY + dy)));
    saveState();
    renderFloorplan();
  }

  function stop() {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", stop);
  }

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", stop);
}

let isPaintingCells = false;
let cellPaintAction = "add";

function startCellPaint(event) {
  event.preventDefault();
  const clickedZoneId = event.currentTarget.dataset.zoneId;
  if (clickedZoneId && clickedZoneId !== selectedZoneId) {
    selectedZoneId = clickedZoneId;
    floorplanMode = selectedZone()?.type || "cell";
    renderFloorplan();
    return;
  }
  let zone = selectedZone();
  if (!zone) {
    addZone();
    zone = selectedZone();
  }
  if (zone.type === "box") {
    addZone();
    zone = selectedZone();
  }
  const cell = event.currentTarget.dataset.cell;
  cellPaintAction = zone.cells.includes(cell) ? "remove" : "add";
  isPaintingCells = true;
  applyCellPaint(cell, cellPaintAction);
}

function continueCellPaint(event) {
  if (!isPaintingCells) return;
  applyCellPaint(event.currentTarget.dataset.cell, cellPaintAction);
}

function selectPaintedCell(event) {
  const zoneId = event.currentTarget.dataset.zoneId;
  if (!zoneId) return;
  selectedZoneId = zoneId;
  floorplanMode = selectedZone()?.type || "cell";
  renderFloorplan();
}

function applyCellPaint(cell, action) {
  const plan = getFloorplan(selectedCenter, selectedFloor);
  const zone = selectedZone();
  if (!zone) return;
  plan.zones.forEach((item) => {
    item.cells = (item.cells || []).filter((storedCell) => String(storedCell) !== String(cell));
  });
  if (action === "add") {
    zone.cells.push(String(cell));
  }
  saveState();
  refreshFloorplanCell(cell);
}

function refreshFloorplanCell(cell) {
  const plan = getFloorplan(selectedCenter, selectedFloor);
  const cellEl = document.querySelector(`.floor-cell[data-cell="${cell}"]`);
  if (!cellEl) return;
  const zone = plan.zones.find((item) =>
    (item.cells || []).some((storedCell) => String(storedCell) === String(cell)),
  );
  cellEl.dataset.zoneId = zone?.id || "";
  cellEl.classList.toggle("painted", Boolean(zone));
  cellEl.classList.toggle("active", zone?.id === selectedZoneId);
  if (zone) {
    cellEl.style.setProperty("--cell-color", zone.color);
    cellEl.style.setProperty("--cell-bg", hexToRgba(zone.color, 0.34));
    cellEl.title = `${zone.customer || "고객사"} · ${zone.name || "구역"} · ${formatPlt(zone.capa)}`;
  } else {
    cellEl.style.removeProperty("--cell-color");
    cellEl.style.removeProperty("--cell-bg");
    cellEl.title = "빈 셀";
  }
}

function exportCsv() {
  const header = ["센터", "층", "대분류", "중분류", "가능CAPA", "실사용CAPA", "여유CAPA", "사용률", "화주사", "화주사점유CAPA", "비고"];
  const rows = [];
  state.centers.forEach((center) => {
    allCategories().forEach(({ major, minor }) => {
      getCenterFloors(center).forEach((floor) => {
        const record = getRecord(center, major, minor, floor);
        const used = recordUsed(record);
        const shippers = record.shippers.length ? record.shippers : [{ name: "", used: "" }];
        shippers.forEach((shipper) => {
          rows.push([
            center,
            `${floor}`,
            major,
            minor,
            record.capacity,
            used,
            number(record.capacity) - used,
            `${percent(used, record.capacity)}%`,
            shipper.name,
            shipper.used,
            record.memo,
          ]);
        });
      });
    });
  });

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "hanexpress_center_capa.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function bindEvents() {
  $("#shipperSearchInput").addEventListener("input", () => {
    shipperSuggestOpen = true;
    renderShipperAnalysis();
  });
  $("#shipperSearchInput").addEventListener("focus", () => {
    shipperSuggestOpen = true;
    renderShipperAnalysis();
  });
  $("#shipperSearchInput").addEventListener("keydown", handleShipperSearchKeydown);
  $("#shipperSearchInput").addEventListener("blur", () => {
    window.setTimeout(() => {
      shipperSuggestOpen = false;
      renderShipperAnalysis();
    }, 120);
  });
  $("#wmsUpload").addEventListener("change", handleWmsUpload);
  $("#saveShipperTargetAverageButton").addEventListener("click", saveShipperTargetAverage);
  $("#shipperTargetAverageInput").addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    saveShipperTargetAverage();
  });
  $("#centerSelect").addEventListener("change", (event) => {
    selectedCenter = event.target.value;
    selectedFloor = getCenterFloors(selectedCenter)[0];
    selectedZoneId = null;
    renderAll();
  });
  $("#floorSelect").addEventListener("change", (event) => {
    selectedFloor = event.target.value;
    selectedZoneId = null;
    renderAll();
  });
  $("#addFloorButton").addEventListener("click", addFloorToSelectedCenter);
  $("#saveCapaEntryButton").addEventListener("click", saveCapaEntryChanges);
  $("#saveShipperEntryButton").addEventListener("click", saveShipperEntryChanges);
  $("#addShipperButton").addEventListener("click", () => {
    const record = getRecord(selectedCenter, "보관공간", "일반", selectedFloor);
    record.shippers.push({ name: "", used: 0 });
    saveState();
    markSaveStatus("shipper", "dirty");
    renderShipperRows();
  });
  $("#selectAllShipperRows").addEventListener("click", () => {
    const checkboxes = [...document.querySelectorAll(".shipper-select")];
    const shouldCheck = checkboxes.some((checkbox) => !checkbox.checked);
    setAllShipperRowSelection(shouldCheck);
    $("#selectAllShipperRows").textContent = shouldCheck ? "전체 해제" : "전체 선택";
  });
  $("#deleteSelectedShipperRows").addEventListener("click", deleteSelectedShipperRows);
  $("#addCenterForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("#newCenterName").value.trim();
    if (!name || state.centers.includes(name)) return;
    state.centers.push(name);
    state.centerShipperMap[name] = [];
    state.hiddenMappedShippers[name] = [];
    state.centerInfo[name] = defaultCenterInfo(name);
    state.centerFloors[name] = ["1F"];
    selectedCenter = name;
    selectedFloor = "1F";
    $("#newCenterName").value = "";
    saveState();
    renderAll();
  });
  $("#addMasterShipperForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("#newMasterShipperName").value.trim();
    if (!name || state.shippers.includes(name)) return;
    state.shippers.push(name);
    $("#newMasterShipperName").value = "";
    saveState();
    renderAll();
  });
  $("#openMappingModal").addEventListener("click", openMappingModal);
  $("#saveCenterInfoButton").addEventListener("click", saveCenterInfoManager);
  if ($("#saveKakaoApiKeyButton")) {
    $("#saveKakaoApiKeyButton").addEventListener("click", saveKakaoApiKey);
  }
  if ($("#twinCenterSelect")) {
    $("#twinCenterSelect").addEventListener("change", (e) => {
      twinCenter = e.target.value;
      twinFloor = null;
      selectedRackId = null;
      renderTwinCurrent();
    });
  }
  if ($("#twinFloorSelect")) {
    $("#twinFloorSelect").addEventListener("change", (e) => {
      twinFloor = e.target.value;
      selectedRackId = null;
      renderTwinCurrent();
    });
  }
  document.querySelectorAll("[data-twin-height]").forEach((btn) => {
    btn.addEventListener("click", () => {
      twinHeightMode = btn.dataset.twinHeight;
      render3DTwin();
    });
  });
  bindRackEditor();
  $("#closeMappingModal").addEventListener("click", closeMappingModal);
  $("#mappingBackdrop").addEventListener("click", closeMappingModal);
  $("#saveMappingModal").addEventListener("click", saveMappingModal);
  $("#mappingDropzone").addEventListener("dragover", (event) => {
    event.preventDefault();
    $("#mappingDropzone").classList.add("drag-over");
  });
  $("#mappingDropzone").addEventListener("dragleave", () => {
    $("#mappingDropzone").classList.remove("drag-over");
  });
  $("#mappingDropzone").addEventListener("drop", (event) => {
    event.preventDefault();
    $("#mappingDropzone").classList.remove("drag-over");
    addMappingShipper(event.dataTransfer.getData("text/plain"));
  });
  $("#addCategoryForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const major = $("#majorSelect").value;
    const minor = $("#newMinorName").value.trim();
    if (!minor || state.majors[major].includes(minor)) return;
    state.majors[major].push(minor);
    selectedCategory = { major, minor };
    $("#newMinorName").value = "";
    saveState();
    renderAll();
  });
  // 도면 점유도 패널(대시보드에서 제거됨) — 요소가 있을 때만 바인딩
  if ($("#floorplanUpload")) {
    $("#floorplanUpload").addEventListener("change", handleFloorplanUpload);
    $("#floorplanFloorSelect").addEventListener("change", (event) => {
      selectedFloor = event.target.value;
      selectedZoneId = null;
      renderAll();
    });
    $("#addFloorplanFloorButton").addEventListener("click", addFloorToSelectedCenter);
    $("#addZoneButton").addEventListener("click", addZone);
    document.querySelectorAll("[data-floorplan-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        floorplanMode = button.dataset.floorplanMode;
        renderFloorplan();
      });
    });
    $("#clearZoneCellsButton").addEventListener("click", clearSelectedZoneCells);
    $("#deleteZoneButton").addEventListener("click", deleteSelectedZone);
    $("#zoneCustomerInput").addEventListener("input", (event) =>
      updateSelectedZone({ customer: event.target.value }),
    );
    $("#zoneNameInput").addEventListener("input", (event) =>
      updateSelectedZone({ name: event.target.value }),
    );
    $("#zoneCapaInput").addEventListener("input", (event) =>
      updateSelectedZone({ capa: number(event.target.value) }),
    );
    $("#zoneXInput").addEventListener("input", (event) =>
      updateSelectedZone({ x: number(event.target.value) }),
    );
    $("#zoneYInput").addEventListener("input", (event) =>
      updateSelectedZone({ y: number(event.target.value) }),
    );
    $("#zoneWInput").addEventListener("input", (event) =>
      updateSelectedZone({ w: number(event.target.value) }),
    );
    $("#zoneHInput").addEventListener("input", (event) =>
      updateSelectedZone({ h: number(event.target.value) }),
    );
  }
  $("#exportButton").addEventListener("click", exportCsv);
  $("#freeCapaCard").addEventListener("click", openFreeCapaModal);
  $("#freeCapaCard").addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFreeCapaModal();
    }
  });
  $("#closeFreeCapaModal").addEventListener("click", closeFreeCapaModal);
  $("#freeCapaBackdrop").addEventListener("click", closeFreeCapaModal);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeFreeCapaModal();
      closeMappingModal();
    }
  });
  window.addEventListener("pointerup", () => {
    if (isPaintingCells) renderFloorplan();
    isPaintingCells = false;
  });
  $("#resetDemoButton").addEventListener("click", () => {
    state = structuredClone(defaultState);
    selectedCenter = state.centers[0];
    selectedFloor = getCenterFloors(selectedCenter)[0];
    selectedCategory = { major: "보관공간", minor: "일반" };
    selectedZoneId = null;
    seedDemoData();
    saveState();
    renderAll();
  });
}

function handleWmsUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const summary = $("#shipperTrendSummary");
  summary.innerHTML = `
    <article class="wide">
      <span>업로드 파일</span>
      <strong>${file.name}</strong>
      <p>현재 화면은 업로드 흐름 초안입니다. 렙실론 WMS 컬럼 양식이 확정되면 월, 화주사, PLT 컬럼을 읽어 추이 데이터로 자동 반영하도록 연결할 수 있습니다.</p>
    </article>
  `;
  event.target.value = "";
}

function handleFloorplanUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  fileToFloorplanImage(file)
    .then((image) => {
      getFloorplan(selectedCenter, selectedFloor).image = image;
      saveState();
      renderFloorplan();
    })
    .catch((err) => alert("도면 변환 실패: " + err.message));
  event.target.value = "";
}

function addZone() {
  const plan = getFloorplan(selectedCenter, selectedFloor);
  const zone = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    customer: "신규 고객사",
    name: "신규 구역",
    capa: 0,
    color: ZONE_COLORS[plan.zones.length % ZONE_COLORS.length],
    type: floorplanMode,
    x: 10,
    y: 10,
    w: 25,
    h: 18,
    cells: [],
  };
  plan.zones.push(zone);
  selectedZoneId = zone.id;
  saveState();
  renderFloorplan();
}

function clearSelectedZoneCells() {
  const zone = selectedZone();
  if (!zone) return;
  zone.cells = [];
  saveState();
  renderFloorplan();
}

function deleteSelectedZone() {
  const plan = getFloorplan(selectedCenter, selectedFloor);
  plan.zones = plan.zones.filter((zone) => zone.id !== selectedZoneId);
  selectedZoneId = null;
  saveState();
  renderFloorplan();
}

function openFreeCapaModal() {
  const rows = state.centers
    .map((center) => {
      const item = centerTotals(center);
      return {
        center,
        capacity: item.capacity,
        used: item.used,
        free: Math.max(item.capacity - item.used, 0),
      };
    })
    .sort((a, b) => b.free - a.free);

  $("#freeCapaList").innerHTML = rows
    .map(
      (row, index) => `
        <button class="free-modal-item" data-center="${row.center}" type="button">
          <span>${index + 1}</span>
          <strong>${row.center}</strong>
          <b>${formatPlt(row.free)} 여유</b>
          <small>전체 ${formatPlt(row.capacity)} / 사용 ${formatPlt(row.used)}</small>
        </button>
      `,
    )
    .join("");

  document.querySelectorAll(".free-modal-item").forEach((button) => {
    button.addEventListener("click", () => {
      selectedCenter = button.dataset.center;
      closeFreeCapaModal();
      selectedZoneId = null;
      renderAll();
      document.getElementById("centerDetail").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  $("#freeCapaModal").classList.add("open");
  $("#freeCapaModal").setAttribute("aria-hidden", "false");
}

function closeFreeCapaModal() {
  $("#freeCapaModal").classList.remove("open");
  $("#freeCapaModal").setAttribute("aria-hidden", "true");
}

function seedDemoData() {
  const sample = {
    남이천1센터: [5200, 4100, "유니클로", 1600],
    남이천2센터: [4600, 3900, "현대글로비스", 1250],
    동이천센터: [4300, 3150, "신규 고객사", 950],
    이천센터: [6100, 5450, "네슬레", 2200],
    이천데포: [3600, 2900, "네슬레", 900],
    북이천센터: [3900, 2600, "쿠팡", 900],
    설성센터: [3300, 2100, "H클럽", 700],
    대월센터: [4800, 3350, "오뚜기", 1050],
    백암센터: [4200, 3000, "동원", 980],
  };
  Object.entries(sample).forEach(([center, values]) => {
    const [capacity, used, shipperName, shipperUsed] = values;
    state.records[recordKey(center, "보관공간", "일반")] = {
      capacity,
      used,
      memo: "초안 확인용 샘플 데이터",
      shippers: [
        { name: shipperName, used: shipperUsed },
        { name: "기타", used: Math.max(used - shipperUsed, 0) },
      ],
    };
    state.records[recordKey(center, "작업공간", "VAS(임가공)")] = {
      capacity: Math.round(capacity * 0.12),
      used: Math.round(used * 0.1),
      memo: "",
      shippers: [],
    };
  });

  getFloorplan("남이천1센터").zones = [
    { id: "demo-zone-1", customer: "유니클로", name: "1F A구역", capa: 900, color: ZONE_COLORS[0], x: 12, y: 18, w: 34, h: 24 },
    { id: "demo-zone-2", customer: "기타", name: "1F B구역", capa: 650, color: ZONE_COLORS[1], x: 52, y: 22, w: 28, h: 22 },
  ];
  state.shippers = allShipperNames(false);
  state.centerShipperMap = {};
  state.hiddenMappedShippers = {};
  state.centerInfo = {};
  state.centerFloors = {};
  Object.keys(sample).forEach((center) => {
    const shipper = sample[center][2];
    state.centerShipperMap[center] = [shipper, "기타"];
    state.hiddenMappedShippers[center] = [];
    state.centerInfo[center] = defaultCenterInfo(center);
    state.centerFloors[center] = (DEFAULT_CENTER_FLOORS[center] || ["1F"]).slice();
  });
}

function renderAll() {
  if (!state.centers.includes(selectedCenter)) selectedCenter = state.centers[0];
  if (!getCenterFloors(selectedCenter).includes(selectedFloor)) {
    selectedFloor = getCenterFloors(selectedCenter)[0];
    selectedZoneId = null;
  }
  const categories = allCategories();
  if (
    !categories.some(
      (item) => item.major === selectedCategory.major && item.minor === selectedCategory.minor,
    )
  ) {
    selectedCategory = categories[0];
  }
  renderFilters();
  renderCenterSlicer();
  renderDashboard();
  renderEntry();
  renderShipperAnalysis();
  renderCenterManager();
  renderShipperMasterManager();
  renderCenterInfoManager();
  renderCategoryManager();
  renderCenterMap();
}

/* =========================================================
   3D 디지털 트윈 점유도 뷰 (mapView 탭)
   ========================================================= */
function twinActiveCenter() {
  if (!twinCenter || !state.centers.includes(twinCenter)) twinCenter = selectedCenter;
  return twinCenter;
}
function twinActiveFloor() {
  const floors = getCenterFloors(twinActiveCenter());
  if (!twinFloor || !floors.includes(twinFloor)) twinFloor = floors[0];
  return twinFloor;
}

function renderTwinSelectors() {
  const centerSel = $("#twinCenterSelect");
  const floorSel = $("#twinFloorSelect");
  if (!centerSel || !floorSel) return;
  const center = twinActiveCenter();
  centerSel.innerHTML = state.centers
    .map((c) => `<option value="${c}" ${c === center ? "selected" : ""}>${c}</option>`)
    .join("");
  const floor = twinActiveFloor();
  floorSel.innerHTML = getCenterFloors(center)
    .map((f) => `<option value="${f}" ${f === floor ? "selected" : ""}>${f}</option>`)
    .join("");
  document.querySelectorAll("[data-twin-height]").forEach((btn) =>
    btn.classList.toggle("active", btn.dataset.twinHeight === twinHeightMode),
  );
  renderTwinPhoto();
}

// 센터 사진 (그리기용 도면과 별개). 업로드본 우선, 없으면 기본 조감도
function getCenterPhoto(center) {
  return state.centerPhotos[center] || CENTER_IMAGES[center] || "";
}
function renderTwinPhoto() {
  const img = $("#twinPhotoImg");
  if (!img) return;
  const src = getCenterPhoto(twinActiveCenter());
  img.src = src;
  img.style.display = src ? "block" : "none";
  const empty = $("#twinPhotoEmpty");
  if (empty) empty.style.display = src ? "none" : "block";
}
function uploadCenterPhoto(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    const image = await downscaleImage(reader.result, 1600, 0.8);
    state.centerPhotos[twinActiveCenter()] = image;
    saveState();
    renderTwinPhoto();
  };
  reader.readAsDataURL(file);
  event.target.value = "";
}

// zone -> {cells:[{col,row}], capa, color, customer, name}
function twinZoneCells(zone) {
  if (zone.type === "box") {
    const colStart = (number(zone.x) / 100) * FLOORPLAN_COLS;
    const rowStart = (number(zone.y) / 100) * FLOORPLAN_ROWS;
    const w = Math.max((number(zone.w) / 100) * FLOORPLAN_COLS, 0.5);
    const d = Math.max((number(zone.h) / 100) * FLOORPLAN_ROWS, 0.5);
    return { rects: [{ x: colStart, z: rowStart, w, d }] };
  }
  const rects = (zone.cells || []).map((i) => {
    const idx = Number(i);
    return { x: idx % FLOORPLAN_COLS, z: Math.floor(idx / FLOORPLAN_COLS), w: 1, d: 1 };
  });
  return { rects };
}

function render3DTwin() {
  const mapView = document.getElementById("mapView");
  if (!mapView || !mapView.classList.contains("active")) return;
  if (typeof THREE === "undefined") return;
  const container = $("#twinCanvas");
  if (!container) return;

  renderTwinSelectors();
  const center = twinActiveCenter();
  const floor = twinActiveFloor();
  const plan = getFloorplan(center, floor);
  const elements = (getRackLayout(center, floor).racks || []).filter((e) =>
    elementTypeInfo(e.type).shape === "area" ? number(e.w) > 0 && number(e.d) > 0 : number(e.len) > 0,
  );

  // 실제 배치가 있으면 그것을, 없으면 도면 zone을 폴백 렌더
  let items = [];
  const byCustomer = new Map();
  const areaLegend = new Map();
  const addLegend = (name, capa, color) => {
    const cur = byCustomer.get(name) || { capa: 0, color };
    cur.capa += number(capa);
    cur.color = color;
    byCustomer.set(name, cur);
  };
  const inv = getInventory(center);
  if (elements.length) {
    const rackEls = elements.filter((e) => elementTypeInfo(e.type).shape !== "area");
    const maxCapa = Math.max(1, ...rackEls.map((r) => number(r.capa)));
    elements.forEach((e) => {
      const info = elementTypeInfo(e.type);
      if (info.shape === "area") {
        items.push({
          type: e.type,
          col: e.col,
          row: e.row,
          w: Math.max(1, Math.round(number(e.w))),
          d: Math.max(1, Math.round(number(e.d))),
          height: Math.max(1, Math.round(number(e.height) || 1)),
          color: e.color || info.color,
          name: e.name || info.label,
        });
        areaLegend.set(info.label, e.color || info.color);
      } else {
        const color = e.color || customerColor(e.customer);
        const capa = number(e.capa);
        const len = Math.max(1, Math.round(number(e.len)));
        const levels = Math.max(1, Math.round(number(e.levels) || TWIN_LEVELS));
        // 재고 연동: 접두+재고파일이 있으면 셀별 화주 색상 배치 사용
        const placement = inv && e.cellPrefix ? rackInventoryPlacement(inv, e) : null;
        const fill = placement
          ? placement.count / (len * levels)
          : twinHeightMode === "flat"
            ? 0.6
            : e.fill != null
              ? clamp01(e.fill)
              : Math.min(1, 0.25 + (capa / maxCapa) * 0.75);
        items.push({
          type: "rack",
          col: e.col,
          row: e.row,
          len,
          dir: e.dir === "v" ? "v" : "h",
          levels,
          color,
          fill,
          placements: placement ? placement.placements : null,
          customer: e.customer || "미지정",
          name: e.name || "랙",
          capa,
          _slots: len * levels,
          _occCount: placement ? placement.count : null,
          _invQty: placement ? placement.qty : null,
          _custCount: placement ? placement.customers.size : null,
        });
        if (placement && placement.customers.size) {
          placement.customers.forEach((col2, name) => areaLegend.set(name, col2));
        } else {
          addLegend(e.customer || "미지정", capa, color);
        }
      }
    });
  } else {
    const zones = (plan.zones || []).filter((z) => twinZoneRuns(z).length > 0);
    const maxCapa = Math.max(1, ...zones.map((z) => number(z.capa)));
    zones.forEach((z) => {
      const color = z.color || customerColor(z.customer);
      const ratio = number(z.capa) / maxCapa;
      const fill = twinHeightMode === "flat" ? 0.6 : Math.min(1, 0.25 + ratio * 0.75);
      twinZoneRuns(z).forEach((run) => {
        items.push({
          type: "rack",
          col: run.col,
          row: run.row,
          len: run.len,
          dir: "h",
          levels: TWIN_LEVELS,
          color,
          fill,
          customer: z.customer || "미지정",
          name: z.name || "구역",
          capa: number(z.capa),
        });
      });
      addLegend(z.customer || "미지정", z.capa, color);
    });
  }

  // KPI (층 기준 CAPA 집계 — 대시보드와 동일)
  const totals = floorTotals(center, floor);
  const free = Math.max(0, totals.capacity - totals.used);
  $("#twinTotal").textContent = number(totals.capacity).toLocaleString("ko-KR");
  $("#twinUsed").textContent = number(totals.used).toLocaleString("ko-KR");
  $("#twinFree").textContent = free.toLocaleString("ko-KR");
  $("#twinRate").textContent = percent(totals.used, totals.capacity) + "%";

  $("#twinLegend").innerHTML = [
    ...Array.from(byCustomer.entries()).map(
      ([name, v]) =>
        `<div class="twin-legend-item"><span class="twin-sw" style="background:${v.color}"></span>${name} · ${formatPlt(v.capa)}</div>`,
    ),
    ...Array.from(areaLegend.entries()).map(
      ([label, color]) =>
        `<div class="twin-legend-item"><span class="twin-sw" style="background:${color}"></span>${label}</div>`,
    ),
  ].join("");
  $("#twinEmpty").style.display = items.length ? "none" : "grid";

  ensureTwinScene(container);
  buildTwinBlocks(items);
  resizeTwin();
}

function ensureTwinScene(container) {
  if (twinState) return;
  const COLS = FLOORPLAN_COLS;
  const ROWS = FLOORPLAN_ROWS;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070a10);
  scene.fog = new THREE.Fog(0x070a10, COLS * 1.2, COLS * 3);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1000);
  camera.position.set(COLS * 0.62, ROWS * 1.25, ROWS * 1.6);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(COLS / 2, 0, ROWS / 2);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.minDistance = COLS * 0.35;
  controls.maxDistance = COLS * 2.4;

  scene.add(new THREE.AmbientLight(0x6b7a99, 0.75));
  const key = new THREE.DirectionalLight(0xcfe4ff, 1.1);
  key.position.set(COLS * 0.7, ROWS * 1.8, ROWS * 0.3);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  const s = COLS;
  key.shadow.camera.left = -s;
  key.shadow.camera.right = s;
  key.shadow.camera.top = s;
  key.shadow.camera.bottom = -s;
  key.shadow.camera.far = COLS * 4;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x5ac8fa, 0.45);
  rim.position.set(-COLS * 0.4, ROWS, -ROWS * 0.5);
  scene.add(rim);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(COLS, ROWS),
    new THREE.MeshStandardMaterial({ color: 0x0d1420, roughness: 0.95, metalness: 0.1 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(COLS / 2, 0, ROWS / 2);
  floor.receiveShadow = true;
  scene.add(floor);

  const grid = new THREE.GridHelper(Math.max(COLS, ROWS), Math.max(COLS, ROWS), 0x1c2a3e, 0x141d2b);
  grid.position.set(COLS / 2, 0.02, ROWS / 2);
  grid.material.opacity = 0.5;
  grid.material.transparent = true;
  scene.add(grid);

  const edge = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(COLS, 0.1, ROWS)),
    new THREE.LineBasicMaterial({ color: 0x2f4a6b }),
  );
  edge.position.set(COLS / 2, 0.05, ROWS / 2);
  scene.add(edge);

  const blocks = new THREE.Group();
  scene.add(blocks);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  renderer.domElement.addEventListener("mousemove", (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(twinState.pick, false)[0];
    const tip = $("#twinTooltip");
    if (hit) {
      const z = hit.object.userData.zone;
      if (tip && z) {
        const stage = container.parentElement.getBoundingClientRect();
        tip.style.display = "block";
        tip.style.left = event.clientX - stage.left + "px";
        tip.style.top = event.clientY - stage.top + "px";
        if (z._area) {
          tip.innerHTML = `<b>${z.name}</b> · ${z.typeLabel}`;
        } else if (z._occCount != null) {
          const custLine = z._custCount > 1 ? ` · 화주 ${z._custCount}곳` : "";
          tip.innerHTML = `<b>${z.name || "랙"}</b>${custLine}<br><span class="twin-cap">실재고 ${z._occCount}/${z._slots}칸</span> (${Math.round((z._fillRate || 0) * 100)}%) · 수량 ${number(z._invQty).toLocaleString("ko-KR")}`;
        } else {
          tip.innerHTML = `<b>${z.customer || "미지정"}</b> · ${z.name || "구역"}<br><span class="twin-cap">${formatPlt(z.capa)}</span> 점유 · 적재율 ${Math.round((z._fillRate || 0) * 100)}%`;
        }
      }
    } else if (tip) {
      tip.style.display = "none";
    }
  });
  renderer.domElement.addEventListener("mouseleave", () => {
    const tip = $("#twinTooltip");
    if (tip) tip.style.display = "none";
  });

  twinState = { scene, camera, renderer, controls, blocks, container, COLS, ROWS, pick: [], res: null };

  (function loop() {
    requestAnimationFrame(loop);
    if (!twinState) return;
    const active = document.getElementById("mapView")?.classList.contains("active");
    if (!active) return;
    twinState.controls.update();
    twinState.renderer.render(twinState.scene, twinState.camera);
  })();

  window.addEventListener("resize", resizeTwin);
}

// 랙 파라미터
// TWIN_LEVELS 는 파일 상단에서 선언됨
const TWIN_LEVEL_H = 1.4; // 한 단 높이(격자 단위)
const TWIN_POST = 0.09; // 기둥 두께
const TWIN_DEPTH = 0.8; // 랙 깊이(1셀 내)

// 요소 타입: rack=선(방향), 나머지=사각 영역
const TWIN_ELEMENT_TYPES = {
  rack: { label: "랙", color: "#f59e0b", shape: "line" },
  office: { label: "사무실", color: "#3b82f6", shape: "area" },
  dock: { label: "도크/출입구", color: "#eab308", shape: "area" },
  work: { label: "임가공/작업장", color: "#10b981", shape: "area" },
  aisle: { label: "통로", color: "#64748b", shape: "area" },
  column: { label: "기둥", color: "#9aa3b2", shape: "area" },
  wall: { label: "벽/챔버", color: "#ef4444", shape: "area" },
  etc: { label: "기타", color: "#94a3b8", shape: "area" },
};
function elementTypeInfo(type) {
  return TWIN_ELEMENT_TYPES[type] || TWIN_ELEMENT_TYPES.rack;
}

// 공유 지오메트리/머티리얼 (씬 재빌드 시 유지)
function twinResources() {
  if (twinState.res) return twinState.res;
  const H = TWIN_LEVELS * TWIN_LEVEL_H;
  const res = {
    H,
    steel: new THREE.MeshStandardMaterial({ color: 0x5b6675, roughness: 0.5, metalness: 0.65 }),
    beam: new THREE.MeshStandardMaterial({ color: 0xff7a2f, roughness: 0.5, metalness: 0.5 }),
    wood: new THREE.MeshStandardMaterial({ color: 0x8a6b45, roughness: 0.9, metalness: 0.05 }),
    palGeo: new THREE.BoxGeometry(0.82, 0.12, TWIN_DEPTH * 0.85),
    boxGeo: new THREE.BoxGeometry(0.72, TWIN_LEVEL_H * 0.6, TWIN_DEPTH * 0.75),
    beamGeoByLen: new Map(),
    postGeoByLevels: new Map(),
    boxMatByColor: new Map(),
    pickMat: new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
  };
  twinState.res = res;
  return res;
}
function twinBeamGeo(res, len) {
  if (!res.beamGeoByLen.has(len)) {
    res.beamGeoByLen.set(len, new THREE.BoxGeometry(len, 0.09, 0.06));
  }
  return res.beamGeoByLen.get(len);
}
function twinPostGeo(res, levels) {
  if (!res.postGeoByLevels.has(levels)) {
    res.postGeoByLevels.set(levels, new THREE.BoxGeometry(TWIN_POST, levels * TWIN_LEVEL_H, TWIN_POST));
  }
  return res.postGeoByLevels.get(levels);
}
function clamp01(v) {
  return Math.max(0, Math.min(1, Number(v) || 0));
}
function twinBoxMat(res, hex) {
  if (!res.boxMatByColor.has(hex)) {
    const c = new THREE.Color(hex);
    res.boxMatByColor.set(
      hex,
      new THREE.MeshStandardMaterial({
        color: c,
        roughness: 0.55,
        metalness: 0.15,
        emissive: c.clone().multiplyScalar(0.12),
      }),
    );
  }
  return res.boxMatByColor.get(hex);
}

// zone -> 점유 셀을 "행별 연속 구간(run)"으로: [{col,row,len}]
function twinZoneRuns(zone) {
  const occupied = new Set();
  if (zone.type === "box") {
    const c0 = Math.round((number(zone.x) / 100) * FLOORPLAN_COLS);
    const r0 = Math.round((number(zone.y) / 100) * FLOORPLAN_ROWS);
    const w = Math.max(1, Math.round((number(zone.w) / 100) * FLOORPLAN_COLS));
    const d = Math.max(1, Math.round((number(zone.h) / 100) * FLOORPLAN_ROWS));
    for (let r = r0; r < r0 + d; r++)
      for (let c = c0; c < c0 + w; c++)
        if (c >= 0 && c < FLOORPLAN_COLS && r >= 0 && r < FLOORPLAN_ROWS) occupied.add(r * FLOORPLAN_COLS + c);
  } else {
    (zone.cells || []).forEach((i) => occupied.add(Number(i)));
  }
  const byRow = new Map();
  occupied.forEach((idx) => {
    const r = Math.floor(idx / FLOORPLAN_COLS);
    const c = idx % FLOORPLAN_COLS;
    if (!byRow.has(r)) byRow.set(r, []);
    byRow.get(r).push(c);
  });
  const runs = [];
  byRow.forEach((cols, r) => {
    cols.sort((a, b) => a - b);
    let start = cols[0];
    let prev = cols[0];
    for (let k = 1; k < cols.length; k++) {
      if (cols[k] !== prev + 1) {
        runs.push({ col: start, row: r, len: prev - start + 1 });
        start = cols[k];
      }
      prev = cols[k];
    }
    runs.push({ col: start, row: r, len: prev - start + 1 });
  });
  return runs;
}

// 랙 유닛 생성 — spec: {col,row,len,dir:'h'|'v',levels,fill}
// dir 'h': 베이가 +col(x)로, dir 'v': 베이가 +row(z)로 진행
function buildTwinRackUnit(group, res, spec, boxMat) {
  const { col, row, len, levels, fill } = spec;
  const horiz = spec.dir !== "v";
  const H = levels * TWIN_LEVEL_H;
  const postGeo = twinPostGeo(res, levels);
  const depthBase = (1 - TWIN_DEPTH) / 2;
  const yRot = horiz ? 0 : Math.PI / 2;
  const place = (mesh, bayOff, depthOff, y) => {
    if (horiz) mesh.position.set(col + bayOff, y, row + depthOff);
    else mesh.position.set(col + depthOff, y, row + bayOff);
  };
  // 기둥 (베이 경계마다 앞/뒤)
  for (let b = 0; b <= len; b++) {
    for (const dOff of [depthBase, depthBase + TWIN_DEPTH]) {
      const p = new THREE.Mesh(postGeo, res.steel);
      place(p, b, dOff, H / 2);
      p.castShadow = true;
      group.add(p);
    }
  }
  // 가로 빔 (단마다 앞/뒤)
  const beamGeo = twinBeamGeo(res, len);
  for (let l = 1; l <= levels; l++) {
    for (const dOff of [depthBase, depthBase + TWIN_DEPTH]) {
      const beam = new THREE.Mesh(beamGeo, res.beam);
      place(beam, len / 2, dOff, l * TWIN_LEVEL_H - 0.12);
      beam.rotation.y = yRot;
      beam.castShadow = true;
      group.add(beam);
    }
  }
  // 팔레트 + 적재 박스
  const addPallet = (b, l, mat) => {
    const y = l * TWIN_LEVEL_H + 0.06;
    const pal = new THREE.Mesh(res.palGeo, res.wood);
    place(pal, b + 0.5, depthBase + TWIN_DEPTH / 2, y);
    pal.rotation.y = yRot;
    pal.castShadow = true;
    group.add(pal);
    const box = new THREE.Mesh(res.boxGeo, mat);
    place(box, b + 0.5, depthBase + TWIN_DEPTH / 2, y + TWIN_LEVEL_H * 0.32);
    box.rotation.y = yRot;
    box.castShadow = true;
    group.add(box);
  };
  if (Array.isArray(spec.placements)) {
    // 재고 연동: 셀별 화주 색상 + 정렬된 위치
    spec.placements.forEach((p) => addPallet(p.b, p.l, twinBoxMat(res, p.color)));
  } else {
    // 적재율만큼 하단부터 채움 (단일 색)
    const slots = len * levels;
    const fillCount = Math.round(fill * slots);
    let placed = 0;
    for (let l = 0; l < levels; l++) {
      for (let b = 0; b < len; b++) {
        if (placed >= fillCount) break;
        placed++;
        addPallet(b, l, boxMat);
      }
    }
  }
}

function buildTwinBlocks(items) {
  if (!twinState) return;
  const group = twinState.blocks;
  twinState.pick.forEach((p) => p.geometry?.dispose?.()); // 픽박스 지오메트리만 정리
  (twinState.labels || []).forEach((s) => {
    s.material?.map?.dispose?.();
    s.material?.dispose?.();
  });
  group.clear(); // 공유 지오/머티리얼은 유지, 인스턴스만 제거
  twinState.pick = [];
  twinState.labels = [];
  if (!items || !items.length) return;

  const res = twinResources();
  items.forEach((spec) => {
    if (elementTypeInfo(spec.type).shape === "area") {
      buildTwinArea(group, res, spec);
      return;
    }
    const boxMat = twinBoxMat(res, spec.color || "#5ac8fa");
    buildTwinRackUnit(group, res, spec, boxMat);
    const horiz = spec.dir !== "v";
    const H = spec.levels * TWIN_LEVEL_H;
    const pickGeo = horiz
      ? new THREE.BoxGeometry(spec.len, H, 1)
      : new THREE.BoxGeometry(1, H, spec.len);
    const pick = new THREE.Mesh(pickGeo, res.pickMat);
    pick.position.set(
      horiz ? spec.col + spec.len / 2 : spec.col + 0.5,
      H / 2,
      horiz ? spec.row + 0.5 : spec.row + spec.len / 2,
    );
    pick.userData.zone = {
      customer: spec.customer,
      name: spec.name,
      capa: spec.capa,
      _fillRate: spec.fill,
      _occCount: spec._occCount,
      _slots: spec._slots,
      _invQty: spec._invQty,
      _custCount: spec._custCount,
    };
    group.add(pick);
    twinState.pick.push(pick);
  });
}

// 사각 영역 요소 (사무실/도크/작업장/통로/기타)
function buildTwinArea(group, res, spec) {
  const { type } = spec;
  const color = new THREE.Color(spec.color || elementTypeInfo(type).color);
  const cx = spec.col + spec.w / 2;
  const cz = spec.row + spec.d / 2;
  let H;
  if (type === "office") H = buildTwinOffice(group, spec, color);
  else if (type === "dock") H = buildTwinDock(group, spec, color);
  else if (type === "work") H = buildTwinWork(group, spec, color);
  else if (type === "aisle") H = buildTwinAisle(group, spec, color);
  else if (type === "column") H = buildTwinColumn(group, spec, color);
  else if (type === "wall") H = buildTwinWall(group, spec, color);
  else H = buildTwinGeneric(group, spec, color);

  const ph = Math.max(H, 0.6);
  const pick = new THREE.Mesh(new THREE.BoxGeometry(spec.w, ph, spec.d), res.pickMat);
  pick.position.set(cx, ph / 2, cz);
  pick.userData.zone = { _area: true, name: spec.name || elementTypeInfo(type).label, typeLabel: elementTypeInfo(type).label };
  group.add(pick);
  twinState.pick.push(pick);

  if (type !== "aisle" && type !== "column" && type !== "wall") {
    const label = makeTwinLabel(spec.name || elementTypeInfo(type).label);
    label.position.set(cx, H + 0.8, cz);
    group.add(label);
    twinState.labels.push(label);
  }
}

function buildTwinOffice(group, spec, color) {
  const w = spec.w * 0.96;
  const d = spec.d * 0.96;
  const cx = spec.col + spec.w / 2;
  const cz = spec.row + spec.d / 2;
  const levels = spec.height || 2;
  const H = levels * TWIN_LEVEL_H;
  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(w, H, d),
    new THREE.MeshStandardMaterial({ color, roughness: 0.25, metalness: 0.3, transparent: true, opacity: 0.72 }),
  );
  glass.position.set(cx, H / 2, cz);
  glass.castShadow = true;
  glass.receiveShadow = true;
  group.add(glass);
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(w * 1.02, 0.12, d * 1.02),
    new THREE.MeshStandardMaterial({ color: 0x1b2536, roughness: 0.8 }),
  );
  roof.position.set(cx, H + 0.06, cz);
  roof.castShadow = true;
  group.add(roof);
  const bandMat = new THREE.MeshStandardMaterial({ color: 0xdff0ff, emissive: 0x9cd4ff, emissiveIntensity: 0.8 });
  for (let l = 1; l <= levels; l++) {
    const band = new THREE.Mesh(new THREE.BoxGeometry(w * 1.004, 0.18, d * 1.004), bandMat);
    band.position.set(cx, l * TWIN_LEVEL_H - TWIN_LEVEL_H * 0.45, cz);
    group.add(band);
  }
  const edge = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(w, H, d)),
    new THREE.LineBasicMaterial({ color: 0x8fb4dd }),
  );
  edge.position.set(cx, H / 2, cz);
  group.add(edge);
  return H;
}

function buildTwinDock(group, spec, color) {
  const { col, row, w, d } = spec;
  const cx = col + w / 2;
  const cz = row + d / 2;
  const apron = new THREE.Mesh(
    new THREE.BoxGeometry(w * 0.98, 0.06, d * 0.98),
    new THREE.MeshStandardMaterial({ color, roughness: 0.85, emissive: color.clone().multiplyScalar(0.15) }),
  );
  apron.position.set(cx, 0.03, cz);
  apron.receiveShadow = true;
  group.add(apron);
  const doorMat = new THREE.MeshStandardMaterial({ color: 0xb8c2cf, roughness: 0.5, metalness: 0.4 });
  const horiz = w >= d;
  const along = horiz ? w : d;
  const count = Math.max(1, Math.floor(along / 2));
  const doorH = 2.0;
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) * (along / count);
    const door = new THREE.Mesh(
      new THREE.BoxGeometry(horiz ? 1.2 : 0.16, doorH, horiz ? 0.16 : 1.2),
      doorMat,
    );
    if (horiz) door.position.set(col + t, doorH / 2, row + 0.2);
    else door.position.set(col + 0.2, doorH / 2, row + t);
    door.castShadow = true;
    group.add(door);
  }
  return doorH;
}

function buildTwinWork(group, spec, color) {
  const { col, row, w, d } = spec;
  const cx = col + w / 2;
  const cz = row + d / 2;
  const floorZone = new THREE.Mesh(
    new THREE.BoxGeometry(w * 0.98, 0.05, d * 0.98),
    new THREE.MeshStandardMaterial({ color, roughness: 0.9, transparent: true, opacity: 0.5 }),
  );
  floorZone.position.set(cx, 0.025, cz);
  floorZone.receiveShadow = true;
  group.add(floorZone);
  const tableMat = new THREE.MeshStandardMaterial({ color: 0x9aa7b6, roughness: 0.6, metalness: 0.2 });
  const tableGeo = new THREE.BoxGeometry(1.2, 0.5, 0.7);
  let tables = 0;
  for (let x = col + 1; x < col + w - 0.5 && tables < 60; x += 2.2) {
    for (let z = row + 0.8; z < row + d - 0.5 && tables < 60; z += 1.8) {
      const t = new THREE.Mesh(tableGeo, tableMat);
      t.position.set(x, 0.3, z);
      t.castShadow = true;
      group.add(t);
      tables++;
    }
  }
  return 0.8;
}

function buildTwinAisle(group, spec, color) {
  const { col, row, w, d } = spec;
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(w * 0.98, 0.04, d * 0.98),
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.9,
      transparent: true,
      opacity: 0.35,
      emissive: color.clone().multiplyScalar(0.12),
    }),
  );
  m.position.set(col + w / 2, 0.02, row + d / 2);
  m.receiveShadow = true;
  group.add(m);
  return 0.04;
}

// 구조 기둥 — 랙보다 높은 가는 콘크리트 기둥
function buildTwinColumn(group, spec, color) {
  const w = spec.w || 1;
  const d = spec.d || 1;
  const cx = spec.col + w / 2;
  const cz = spec.row + d / 2;
  const H = 5.6; // 랙(4.2)보다 높게 — 구조물로 인식
  const t = Math.min(0.85, Math.max(0.42, Math.min(w, d) * 0.6));
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0.08 });
  const post = new THREE.Mesh(new THREE.BoxGeometry(t, H, t), mat);
  post.position.set(cx, H / 2, cz);
  post.castShadow = true;
  post.receiveShadow = true;
  group.add(post);
  const cap = new THREE.Mesh(
    new THREE.BoxGeometry(t * 1.5, 0.22, t * 1.5),
    new THREE.MeshStandardMaterial({ color: 0x5b6472, roughness: 0.85 }),
  );
  cap.position.set(cx, H + 0.11, cz);
  cap.castShadow = true;
  group.add(cap);
  const edge = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(t, H, t)),
    new THREE.LineBasicMaterial({ color: 0x3a4453 }),
  );
  edge.position.set(cx, H / 2, cz);
  group.add(edge);
  return H;
}

// 벽/챔버 — 얇고 높은 벽. w,d 둘 다 크면 방(4면 벽=챔버), 아니면 단일 벽선
function buildTwinWall(group, spec, color) {
  const w = spec.w || 1;
  const d = spec.d || 1;
  const H = spec.height ? spec.height * TWIN_LEVEL_H : 5.0; // 랙(4.2)보다 높고 기둥(5.6)보다 낮게
  const th = 0.35;
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0.05, transparent: true, opacity: 0.9 });
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x2a3340 });
  const panel = (px, pz, pw, pd) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(pw, H, pd), mat);
    m.position.set(px, H / 2, pz);
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(pw, H, pd)), edgeMat);
    e.position.set(px, H / 2, pz);
    group.add(e);
  };
  const c = spec.col, r = spec.row;
  if (w > 2 && d > 2) {
    // 챔버(방) — 네 면 벽
    panel(c + w / 2, r + th / 2, w, th);
    panel(c + w / 2, r + d - th / 2, w, th);
    panel(c + th / 2, r + d / 2, th, d);
    panel(c + w - th / 2, r + d / 2, th, d);
  } else {
    const horiz = w >= d;
    panel(c + w / 2, r + d / 2, horiz ? w : th, horiz ? th : d);
  }
  return H;
}

function buildTwinGeneric(group, spec, color) {
  const { col, row, w, d } = spec;
  const cx = col + w / 2;
  const cz = row + d / 2;
  const H = 1.0;
  const geo = new THREE.BoxGeometry(w * 0.95, H, d * 0.95);
  const box = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.1, transparent: true, opacity: 0.85 }),
  );
  box.position.set(cx, H / 2, cz);
  box.castShadow = true;
  box.receiveShadow = true;
  group.add(box);
  const edge = new THREE.LineSegments(
    new THREE.EdgesGeometry(geo),
    new THREE.LineBasicMaterial({ color: color.clone().multiplyScalar(1.5) }),
  );
  edge.position.set(cx, H / 2, cz);
  group.add(edge);
  return H;
}

function makeTwinLabel(text) {
  const pad = 16;
  const font = 44;
  const measure = document.createElement("canvas").getContext("2d");
  measure.font = `bold ${font}px sans-serif`;
  const tw = Math.ceil(measure.measureText(text).width);
  const canvas = document.createElement("canvas");
  canvas.width = tw + pad * 2;
  canvas.height = font + pad * 2;
  const ctx = canvas.getContext("2d");
  ctx.font = `bold ${font}px sans-serif`;
  ctx.fillStyle = "rgba(10,14,22,0.82)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(120,180,240,0.5)";
  ctx.lineWidth = 3;
  ctx.strokeRect(1.5, 1.5, canvas.width - 3, canvas.height - 3);
  ctx.fillStyle = "#e6edf6";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 2);
  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true });
  const sprite = new THREE.Sprite(mat);
  const scale = 0.045;
  sprite.scale.set(canvas.width * scale, canvas.height * scale, 1);
  return sprite;
}

function resizeTwin() {
  if (!twinState) return;
  const { container, renderer, camera } = twinState;
  const w = container.clientWidth;
  const h = container.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

/* ===== 랙 배치 에디터 ===== */
function renderTwinCurrent() {
  if (twinViewMode === "edit") renderRackEditor();
  else render3DTwin();
}

function setTwinViewMode(mode) {
  twinViewMode = mode === "edit" ? "edit" : "view";
  document.querySelectorAll("[data-twin-view]").forEach((b) =>
    b.classList.toggle("active", b.dataset.twinView === twinViewMode),
  );
  const editing = twinViewMode === "edit";
  const stage = $("#twinStage");
  const editor = $("#rackEditor");
  const heightModes = $("#twinHeightModes");
  if (stage) stage.hidden = editing;
  if (editor) editor.hidden = !editing;
  if (heightModes) heightModes.style.visibility = editing ? "hidden" : "visible";
  if (editing) renderRackEditor();
  else render3DTwin();
}

function isAreaElement(el) {
  return elementTypeInfo(el.type).shape === "area";
}
function elementColor(el) {
  if (isAreaElement(el)) return el.color || elementTypeInfo(el.type).color;
  return el.color || customerColor(el.customer);
}
function elementLabel(el) {
  return isAreaElement(el) ? el.name || elementTypeInfo(el.type).label : el.customer || "랙";
}
function elementStyle(el) {
  const area = isAreaElement(el);
  const horiz = el.dir !== "v";
  const left = (el.col / FLOORPLAN_COLS) * 100;
  const top = (el.row / FLOORPLAN_ROWS) * 100;
  const w = ((area ? el.w : horiz ? el.len : 1) / FLOORPLAN_COLS) * 100;
  const h = ((area ? el.d : horiz ? 1 : el.len) / FLOORPLAN_ROWS) * 100;
  return `left:${left}%;top:${top}%;width:${w}%;height:${h}%;--rc:${elementColor(el)};`;
}

function renderRackTypePicker() {
  const wrap = $("#rackTypePicker");
  if (!wrap) return;
  wrap.innerHTML = Object.entries(TWIN_ELEMENT_TYPES)
    .map(
      ([key, v]) =>
        `<button class="rack-type-btn ${key === twinElementType ? "active" : ""}" data-el-type="${key}" type="button"><span class="sw" style="background:${v.color}"></span>${v.label}</button>`,
    )
    .join("");
  wrap.querySelectorAll("[data-el-type]").forEach((b) =>
    b.addEventListener("click", () => {
      twinElementType = b.dataset.elType;
      renderRackTypePicker();
    }),
  );
}

// 배경 도면 변형(가로/세로 배율·이동) — 사용자가 그린 랙에 도면을 정확히 맞추기 위함
function rackBgView(plan) {
  if (!plan.bgView) plan.bgView = { sx: 100, sy: 100, x: 0, y: 0 };
  const v = plan.bgView;
  if (v.sx == null) {
    // 구버전(단일 scale) 마이그레이션
    v.sx = v.scale || 100;
    v.sy = v.scale || 100;
    delete v.scale;
  }
  return v;
}
function applyRackBgTransform() {
  const img = $("#rackFloorImage");
  if (!img) return;
  const v = rackBgView(getFloorplan(twinActiveCenter(), twinActiveFloor()));
  img.style.transformOrigin = "center center";
  img.style.transform = `translate(${v.x}%, ${v.y}%) scale(${v.sx / 100}, ${v.sy / 100})`;
  const slider = $("#bgScale");
  if (slider && document.activeElement !== slider) slider.value = Math.round((v.sx + v.sy) / 2);
  const val = $("#bgScaleVal");
  if (val) val.textContent = `가로 ${Math.round(v.sx)}% · 세로 ${Math.round(v.sy)}%`;
}
function updateRackBgView(patch) {
  const plan = getFloorplan(twinActiveCenter(), twinActiveFloor());
  const v = rackBgView(plan);
  const clampS = (s) => Math.max(20, Math.min(400, s));
  const clampP = (p) => Math.max(-100, Math.min(100, p));
  if (patch.scale != null) {
    v.sx = clampS(patch.scale);
    v.sy = clampS(patch.scale);
  }
  if (patch.dsx) v.sx = clampS(v.sx + patch.dsx);
  if (patch.dsy) v.sy = clampS(v.sy + patch.dsy);
  if (patch.dx) v.x = clampP(v.x + patch.dx);
  if (patch.dy) v.y = clampP(v.y + patch.dy);
  if (patch.reset) {
    v.sx = 100;
    v.sy = 100;
    v.x = 0;
    v.y = 0;
  }
  saveState();
  applyRackBgTransform();
}

// 자동 맞춤 — 내장 도면은 랙 좌표와 같은 기준으로 만들어져 있어, 보정(identity)으로 되돌리면 정확히 겹침
function autoAlignRackBg() {
  updateRackBgView({ reset: true });
}

function renderRackEditor() {
  const center = twinActiveCenter();
  const floor = twinActiveFloor();
  renderTwinSelectors();
  renderRackTypePicker();
  const plan = getFloorplan(center, floor);
  const img = $("#rackFloorImage");
  if (img) {
    img.src = plan.image || "";
    img.style.display = plan.image ? "block" : "none";
  }
  applyRackBgTransform();
  const empty = $("#rackEditorEmpty");
  if (empty) empty.style.display = plan.image ? "none" : "grid";
  // 고객사 datalist
  const dl = $("#rackCustomerList");
  if (dl) {
    const names = allCustomerNames();
    dl.innerHTML = names.map((n) => `<option value="${n}"></option>`).join("");
  }
  renderInventoryStatus();
  refreshRackLayer();
  refreshRackList();
  renderRackForm();
}

function renderInventoryStatus() {
  const inv = getInventory(twinActiveCenter());
  const status = $("#inventoryStatus");
  if (status) {
    if (inv) {
      status.textContent = `연동됨 · ${inv.cellCount}셀 (${inv.fileName})`;
      status.classList.add("linked");
    } else {
      status.textContent = "재고 미연동";
      status.classList.remove("linked");
    }
  }
  const list = $("#rackPrefixList");
  if (list) {
    list.innerHTML = inventoryPrefixes(inv)
      .map((p) => `<option value="${p}"></option>`)
      .join("");
  }
}

async function uploadInventory(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const status = $("#inventoryStatus");
  if (status) status.textContent = "재고 분석 중…";
  try {
    const parsed = await parseInventoryFile(file);
    state.inventory[twinActiveCenter()] = parsed;
    saveState();
    renderInventoryStatus();
    renderRackForm();
    if (twinViewMode === "view") render3DTwin();
  } catch (err) {
    if (status) status.textContent = "재고 분석 실패: " + err.message;
  } finally {
    event.target.value = "";
  }
}

function allCustomerNames() {
  const names = new Set();
  Object.values(state.floorplans).forEach((p) =>
    (p.zones || []).forEach((z) => z.customer && names.add(z.customer)),
  );
  Object.values(state.rackLayouts).forEach((l) =>
    (l.racks || []).forEach((r) => r.customer && names.add(r.customer)),
  );
  (state.shippers || []).forEach((s) => names.add(s));
  return Array.from(names).filter(Boolean).sort();
}

function refreshRackLayer() {
  const layer = $("#rackLayer");
  if (!layer) return;
  const racks = getRackLayout(twinActiveCenter(), twinActiveFloor()).racks;
  layer.innerHTML = racks
    .map(
      (r) =>
        `<div class="rack-item ${isAreaElement(r) ? "area" : ""} ${r.id === selectedRackId ? "selected" : ""}" data-rack-id="${r.id}" style="${elementStyle(r)}"><span>${elementLabel(r)}</span></div>`,
    )
    .join("");
  layer.querySelectorAll(".rack-item").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      selectRack(el.dataset.rackId);
    }),
  );
}

function refreshRackList() {
  const list = $("#rackList");
  if (!list) return;
  const racks = getRackLayout(twinActiveCenter(), twinActiveFloor()).racks;
  if (!racks.length) {
    list.innerHTML = `<div class="rack-list-empty">아직 배치된 요소가 없습니다. 타입을 고르고 도면 위에서 드래그해 추가하세요.</div>`;
    return;
  }
  list.innerHTML = racks
    .map((r) => {
      const meta = isAreaElement(r)
        ? `${elementTypeInfo(r.type).label} ${r.w}×${r.d}`
        : `${r.dir === "v" ? "세로" : "가로"} ${r.len}칸·${r.levels || TWIN_LEVELS}단`;
      return `<div class="rack-list-item ${r.id === selectedRackId ? "selected" : ""}" data-rack-id="${r.id}">
          <span class="sw" style="background:${elementColor(r)}"></span>
          <span>${elementLabel(r)}${!isAreaElement(r) && r.name ? " · " + r.name : ""}</span>
          <small>${meta}</small>
        </div>`;
    })
    .join("");
  list.querySelectorAll(".rack-list-item").forEach((el) =>
    el.addEventListener("click", () => selectRack(el.dataset.rackId)),
  );
}

function selectedRack() {
  const racks = getRackLayout(twinActiveCenter(), twinActiveFloor()).racks;
  return racks.find((r) => r.id === selectedRackId);
}

function selectRack(id) {
  selectedRackId = id;
  refreshRackLayer();
  refreshRackList();
  renderRackForm();
}

function renderRackForm() {
  const form = $("#rackForm");
  const el = selectedRack();
  if (!form) return;
  form.hidden = !el;
  if (!el) return;
  const area = isAreaElement(el);
  $("#rackFormTitle").textContent = elementTypeInfo(el.type).label + " 속성";
  $("#rackOnlyFields").hidden = area;
  $("#areaOnlyFields").hidden = !area;
  $("#rackName").value = el.name || "";
  if (area) {
    $("#areaW").value = el.w;
    $("#areaD").value = el.d;
    $("#areaHeight").value = el.height || 1;
    $("#areaHeightRow").hidden = el.type !== "office";
    $("#areaColor").value = el.color || elementTypeInfo(el.type).color;
  } else {
    $("#rackCustomer").value = el.customer || "";
    $("#rackCellPrefix").value = el.cellPrefix || "";
    $("#rackLevels").value = el.levels || TWIN_LEVELS;
    $("#rackLen").value = el.len;
    $("#rackDir").value = el.dir === "v" ? "v" : "h";
    $("#rackCapa").value = el.capa || 0;
    const fillPct = Math.round((el.fill != null ? el.fill : 0.6) * 100);
    $("#rackFill").value = fillPct;
    $("#rackFillVal").textContent = fillPct + "%";
    // 재고 연동 상태 힌트
    const inv = getInventory(twinActiveCenter());
    const hint = $("#rackPrefixHint");
    if (hint) {
      if (inv && el.cellPrefix) {
        const occ = occupiedForRack(inv, el);
        hint.textContent = `실재고 ${occ.count}/${el.len * (el.levels || TWIN_LEVELS)}칸`;
      } else {
        hint.textContent = "";
      }
    }
  }
}

function updateSelectedRack(patch) {
  const el = selectedRack();
  if (!el) return;
  Object.assign(el, patch);
  if ("customer" in patch && !isAreaElement(el)) el.color = customerColor(el.customer);
  saveState();
  refreshRackLayer();
  refreshRackList();
}

function cellFromPointer(gridEl, event) {
  const rect = gridEl.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * FLOORPLAN_COLS;
  const y = ((event.clientY - rect.top) / rect.height) * FLOORPLAN_ROWS;
  return {
    col: Math.max(0, Math.min(FLOORPLAN_COLS - 1, Math.floor(x))),
    row: Math.max(0, Math.min(FLOORPLAN_ROWS - 1, Math.floor(y))),
  };
}

function rackDragRect(start, cur) {
  const dcol = cur.col - start.col;
  const drow = cur.row - start.row;
  if (Math.abs(dcol) >= Math.abs(drow)) {
    return { dir: "h", col: Math.min(start.col, cur.col), row: start.row, len: Math.abs(dcol) + 1 };
  }
  return { dir: "v", col: start.col, row: Math.min(start.row, cur.row), len: Math.abs(drow) + 1 };
}

function areaDragRect(start, cur) {
  return {
    col: Math.min(start.col, cur.col),
    row: Math.min(start.row, cur.row),
    w: Math.abs(cur.col - start.col) + 1,
    d: Math.abs(cur.row - start.row) + 1,
  };
}

function startRackDraw(event) {
  if (twinViewMode !== "edit") return;
  const grid = $("#rackGrid");
  if (!grid) return;
  event.preventDefault();
  const start = cellFromPointer(grid, event);
  rackDrag = { start, cur: start };
  try {
    if (event.pointerId != null) grid.setPointerCapture(event.pointerId);
  } catch {
    /* 합성 이벤트 등에서 캡처 실패 무시 */
  }
  updateRackPreview();
}

function moveRackDraw(event) {
  if (!rackDrag) return;
  const grid = $("#rackGrid");
  rackDrag.cur = cellFromPointer(grid, event);
  updateRackPreview();
}

function updateRackPreview() {
  const preview = $("#rackPreview");
  if (!preview) return;
  if (!rackDrag) {
    preview.hidden = true;
    return;
  }
  const info = elementTypeInfo(twinElementType);
  const rect =
    info.shape === "area"
      ? { type: twinElementType, ...areaDragRect(rackDrag.start, rackDrag.cur), color: info.color }
      : { type: "rack", ...rackDragRect(rackDrag.start, rackDrag.cur), color: info.color };
  preview.hidden = false;
  preview.style.cssText = elementStyle(rect);
}

function endRackDraw(event) {
  if (!rackDrag) return;
  const grid = $("#rackGrid");
  const cur = cellFromPointer(grid, event);
  const info = elementTypeInfo(twinElementType);
  const id = "el-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  let el;
  if (info.shape === "area") {
    const a = areaDragRect(rackDrag.start, cur);
    el = {
      id,
      type: twinElementType,
      col: a.col,
      row: a.row,
      w: a.w,
      d: a.d,
      name: info.label,
      color: info.color,
      height: twinElementType === "office" ? 2 : 1,
    };
  } else {
    const r = rackDragRect(rackDrag.start, cur);
    el = {
      id,
      type: "rack",
      col: r.col,
      row: r.row,
      len: r.len,
      dir: r.dir,
      levels: TWIN_LEVELS,
      customer: "",
      name: "",
      capa: 0,
      fill: 0.6,
      color: customerColor(""),
    };
  }
  rackDrag = null;
  $("#rackPreview").hidden = true;
  getRackLayout(twinActiveCenter(), twinActiveFloor()).racks.push(el);
  selectedRackId = el.id;
  saveState();
  refreshRackLayer();
  refreshRackList();
  renderRackForm();
  (info.shape === "area" ? $("#rackName") : $("#rackCustomer"))?.focus();
}

function deleteSelectedRack() {
  const layout = getRackLayout(twinActiveCenter(), twinActiveFloor());
  layout.racks = layout.racks.filter((r) => r.id !== selectedRackId);
  selectedRackId = null;
  saveState();
  refreshRackLayer();
  refreshRackList();
  renderRackForm();
}

function clearAllRacks() {
  const layout = getRackLayout(twinActiveCenter(), twinActiveFloor());
  if (!layout.racks.length) return;
  if (!window.confirm("이 센터·층의 모든 배치 요소를 삭제할까요?")) return;
  layout.racks = [];
  selectedRackId = null;
  saveState();
  refreshRackLayer();
  refreshRackList();
  renderRackForm();
}

function uploadRackFloorplan(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const empty = $("#rackEditorEmpty");
  if (empty) empty.textContent = "도면 변환 중…";
  fileToFloorplanImage(file)
    .then((image) => {
      getFloorplan(twinActiveCenter(), twinActiveFloor()).image = image;
      saveState();
      renderRackEditor();
      renderFloorplan?.();
    })
    .catch((err) => alert("도면 변환 실패: " + err.message));
  event.target.value = "";
}

function bindRackEditor() {
  document.querySelectorAll("[data-twin-view]").forEach((btn) =>
    btn.addEventListener("click", () => setTwinViewMode(btn.dataset.twinView)),
  );
  const grid = $("#rackGrid");
  if (grid) {
    grid.addEventListener("pointerdown", startRackDraw);
    grid.addEventListener("pointermove", moveRackDraw);
    grid.addEventListener("pointerup", endRackDraw);
    grid.addEventListener("pointercancel", () => {
      rackDrag = null;
      $("#rackPreview").hidden = true;
    });
  }
  $("#rackCustomer")?.addEventListener("input", (e) => updateSelectedRack({ customer: e.target.value.trim() }));
  $("#rackCellPrefix")?.addEventListener("input", (e) => {
    updateSelectedRack({ cellPrefix: e.target.value.trim() });
    const el = selectedRack();
    const inv = getInventory(twinActiveCenter());
    const hint = $("#rackPrefixHint");
    if (hint && el) {
      hint.textContent =
        inv && el.cellPrefix ? `실재고 ${occupiedForRack(inv, el).count}/${el.len * (el.levels || TWIN_LEVELS)}칸` : "";
    }
  });
  $("#inventoryUpload")?.addEventListener("change", uploadInventory);
  $("#twinPhotoUpload")?.addEventListener("change", uploadCenterPhoto);
  // 배경 도면 맞춤(전체/가로/세로 배율·이동)
  const curBg = () => rackBgView(getFloorplan(twinActiveCenter(), twinActiveFloor()));
  $("#bgScale")?.addEventListener("input", (e) => updateRackBgView({ scale: Number(e.target.value) }));
  $("#bgZoomIn")?.addEventListener("click", () => updateRackBgView({ scale: (curBg().sx + curBg().sy) / 2 + 3 }));
  $("#bgZoomOut")?.addEventListener("click", () => updateRackBgView({ scale: (curBg().sx + curBg().sy) / 2 - 3 }));
  $("#bgWplus")?.addEventListener("click", () => updateRackBgView({ dsx: 1 }));
  $("#bgWminus")?.addEventListener("click", () => updateRackBgView({ dsx: -1 }));
  $("#bgHplus")?.addEventListener("click", () => updateRackBgView({ dsy: 1 }));
  $("#bgHminus")?.addEventListener("click", () => updateRackBgView({ dsy: -1 }));
  $("#bgAuto")?.addEventListener("click", autoAlignRackBg);
  $("#bgReset")?.addEventListener("click", () => updateRackBgView({ reset: true }));
  document.querySelectorAll("[data-bg-nudge]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const step = 0.5; // 정밀 이동
      const dir = btn.dataset.bgNudge;
      updateRackBgView({
        dx: dir === "left" ? -step : dir === "right" ? step : 0,
        dy: dir === "up" ? -step : dir === "down" ? step : 0,
      });
    }),
  );
  $("#rackName")?.addEventListener("input", (e) => updateSelectedRack({ name: e.target.value }));
  $("#rackLevels")?.addEventListener("change", (e) =>
    updateSelectedRack({ levels: Math.max(1, Math.min(8, Number(e.target.value) || TWIN_LEVELS)) }),
  );
  $("#rackLen")?.addEventListener("change", (e) =>
    updateSelectedRack({ len: Math.max(1, Math.min(FLOORPLAN_COLS, Number(e.target.value) || 1)) }),
  );
  $("#rackDir")?.addEventListener("change", (e) => updateSelectedRack({ dir: e.target.value === "v" ? "v" : "h" }));
  $("#rackCapa")?.addEventListener("change", (e) => updateSelectedRack({ capa: Math.max(0, Number(e.target.value) || 0) }));
  $("#rackFill")?.addEventListener("input", (e) => {
    const pct = Number(e.target.value) || 0;
    $("#rackFillVal").textContent = pct + "%";
    updateSelectedRack({ fill: pct / 100 });
  });
  $("#areaW")?.addEventListener("change", (e) =>
    updateSelectedRack({ w: Math.max(1, Math.min(FLOORPLAN_COLS, Number(e.target.value) || 1)) }),
  );
  $("#areaD")?.addEventListener("change", (e) =>
    updateSelectedRack({ d: Math.max(1, Math.min(FLOORPLAN_ROWS, Number(e.target.value) || 1)) }),
  );
  $("#areaHeight")?.addEventListener("change", (e) =>
    updateSelectedRack({ height: Math.max(1, Math.min(6, Number(e.target.value) || 1)) }),
  );
  $("#areaColor")?.addEventListener("input", (e) => updateSelectedRack({ color: e.target.value }));
  $("#rackDelete")?.addEventListener("click", deleteSelectedRack);
  $("#rackClearAll")?.addEventListener("click", clearAllRacks);
  $("#rackFloorplanUpload")?.addEventListener("change", uploadRackFloorplan);
}

if (!localStorage.getItem(STORAGE_KEY)) {
  seedDemoData();
  saveState();
}

renderNav();
renderFilters();
bindEvents();
renderAll();
