const STORAGE_KEY = "hx-center-capa-v2";
const LEGACY_STORAGE_KEY = "hx-center-capa-v1";
const ALL = "전체";
const FLOORPLAN_COLS = 216;
const FLOORPLAN_ROWS = 126;
const TWIN_LEVELS = 4; // 랙 기본 단수 (파일 상단에서 선언 — 초기 시드에서 참조)
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
const DEFAULT_RACKS_VERSION = 14;
// 남이천1센터 구조 기둥 — 같은 건물이라 전 층 공통(도면의 노란 마커에서 검출)
const NAMI1_COLUMNS = [
  {type:"column",col:166,row:22,w:1,d:1}, {type:"column",col:167,row:22,w:1,d:1}, {type:"column",col:169,row:22,w:1,d:1}, {type:"column",col:172,row:22,w:1,d:1},
  {type:"column",col:121,row:24,w:1,d:1}, {type:"column",col:17,row:38,w:1,d:1}, {type:"column",col:28,row:38,w:1,d:1}, {type:"column",col:39,row:38,w:1,d:1},
  {type:"column",col:61,row:38,w:1,d:1}, {type:"column",col:73,row:38,w:1,d:1}, {type:"column",col:95,row:38,w:1,d:1}, {type:"column",col:106,row:38,w:1,d:1},
  {type:"column",col:128,row:38,w:1,d:1}, {type:"column",col:140,row:38,w:1,d:1}, {type:"column",col:151,row:38,w:1,d:1}, {type:"column",col:41,row:45,w:1,d:1},
  {type:"column",col:49,row:45,w:1,d:1}, {type:"column",col:17,row:49,w:1,d:1}, {type:"column",col:28,row:49,w:1,d:1}, {type:"column",col:39,row:49,w:1,d:1},
  {type:"column",col:61,row:49,w:1,d:1}, {type:"column",col:73,row:49,w:1,d:1}, {type:"column",col:95,row:49,w:1,d:1}, {type:"column",col:106,row:49,w:1,d:1},
  {type:"column",col:117,row:49,w:1,d:1}, {type:"column",col:128,row:49,w:1,d:1}, {type:"column",col:140,row:49,w:1,d:1}, {type:"column",col:151,row:49,w:1,d:1},
  {type:"column",col:162,row:49,w:1,d:1}, {type:"column",col:173,row:49,w:1,d:1}, {type:"column",col:184,row:49,w:1,d:1}, {type:"column",col:95,row:60,w:1,d:1},
  {type:"column",col:106,row:60,w:1,d:1}, {type:"column",col:117,row:60,w:1,d:1}, {type:"column",col:128,row:60,w:1,d:1}, {type:"column",col:140,row:60,w:1,d:1},
  {type:"column",col:151,row:60,w:1,d:1}, {type:"column",col:162,row:60,w:1,d:1}, {type:"column",col:173,row:60,w:1,d:1}, {type:"column",col:184,row:60,w:1,d:1},
  {type:"column",col:17,row:60,w:1,d:1}, {type:"column",col:28,row:60,w:1,d:1}, {type:"column",col:61,row:60,w:1,d:1}, {type:"column",col:73,row:60,w:1,d:1},
  {type:"column",col:41,row:68,w:1,d:1}, {type:"column",col:49,row:68,w:1,d:1}, {type:"column",col:51,row:71,w:1,d:1}, {type:"column",col:17,row:71,w:1,d:1},
  {type:"column",col:28,row:71,w:1,d:1}, {type:"column",col:39,row:71,w:1,d:1}, {type:"column",col:61,row:71,w:1,d:1}, {type:"column",col:95,row:71,w:1,d:1},
  {type:"column",col:128,row:71,w:1,d:1}, {type:"column",col:140,row:71,w:1,d:1}, {type:"column",col:151,row:71,w:1,d:1}, {type:"column",col:162,row:71,w:1,d:1},
  {type:"column",col:173,row:71,w:1,d:1}, {type:"column",col:184,row:71,w:1,d:1}, {type:"column",col:17,row:82,w:1,d:1}, {type:"column",col:28,row:82,w:1,d:1},
  {type:"column",col:39,row:82,w:1,d:1}, {type:"column",col:50,row:82,w:1,d:1}, {type:"column",col:61,row:82,w:1,d:1}, {type:"column",col:73,row:82,w:1,d:1},
  {type:"column",col:106,row:82,w:1,d:1}, {type:"column",col:128,row:82,w:1,d:1}, {type:"column",col:140,row:82,w:1,d:1}, {type:"column",col:162,row:82,w:1,d:1},
  {type:"column",col:173,row:82,w:1,d:1}, {type:"column",col:184,row:82,w:1,d:1}, {type:"column",col:95,row:93,w:1,d:1}, {type:"column",col:106,row:93,w:1,d:1},
  {type:"column",col:128,row:93,w:1,d:1}, {type:"column",col:140,row:93,w:1,d:1}, {type:"column",col:162,row:93,w:1,d:1}, {type:"column",col:173,row:93,w:1,d:1},
  {type:"column",col:17,row:93,w:1,d:1}, {type:"column",col:28,row:93,w:1,d:1}, {type:"column",col:39,row:93,w:1,d:1}, {type:"column",col:50,row:93,w:1,d:1},
  {type:"column",col:61,row:93,w:1,d:1}, {type:"column",col:73,row:93,w:1,d:1}, {type:"column",col:41,row:99,w:1,d:1}, {type:"column",col:39,row:105,w:1,d:1},
  {type:"column",col:50,row:105,w:1,d:1}, {type:"column",col:73,row:105,w:1,d:1}, {type:"column",col:95,row:105,w:1,d:1}, {type:"column",col:106,row:105,w:1,d:1},
  {type:"column",col:117,row:105,w:1,d:1}, {type:"column",col:128,row:105,w:1,d:1}, {type:"column",col:140,row:105,w:1,d:1}, {type:"column",col:17,row:105,w:1,d:1},
  {type:"column",col:28,row:105,w:1,d:1}, {type:"column",col:61,row:105,w:1,d:1}, {type:"column",col:56,row:106,w:1,d:1}, {type:"column",col:140,row:115,w:1,d:1},
  {type:"column",col:117,row:116,w:1,d:1}, {type:"column",col:128,row:116,w:1,d:1},
];
const DEFAULT_RACK_LAYOUTS = {
  // 남이천1센터 지하1층 — 도면 픽셀에서 216x126 객자로 진통 산정
  남이천1센터: [
    {type:"rack",dir:"h",col:7,row:32,len:24},{type:"rack",dir:"h",col:7,row:33,len:24},{type:"rack",dir:"h",col:7,row:37,len:20},
    {type:"rack",dir:"h",col:7,row:38,len:20},{type:"rack",dir:"h",col:7,row:42,len:29},{type:"rack",dir:"h",col:7,row:44,len:29},
    {type:"rack",dir:"h",col:7,row:48,len:20},{type:"rack",dir:"h",col:7,row:49,len:20},{type:"rack",dir:"h",col:7,row:52,len:24},
    {type:"rack",dir:"h",col:7,row:53,len:24},{type:"rack",dir:"h",col:7,row:55,len:24},{type:"rack",dir:"h",col:7,row:56,len:24},
    {type:"rack",dir:"h",col:7,row:59,len:24},{type:"rack",dir:"h",col:7,row:60,len:24},{type:"rack",dir:"h",col:7,row:66,len:24},
    {type:"rack",dir:"h",col:7,row:67,len:24},{type:"rack",dir:"h",col:7,row:69,len:24},{type:"rack",dir:"h",col:7,row:70,len:24},
    {type:"rack",dir:"h",col:7,row:76,len:24},{type:"rack",dir:"h",col:7,row:77,len:24},{type:"rack",dir:"h",col:7,row:83,len:20},
    {type:"rack",dir:"h",col:7,row:84,len:20},{type:"rack",dir:"h",col:7,row:86,len:24},{type:"rack",dir:"h",col:7,row:87,len:24},
    {type:"rack",dir:"h",col:7,row:93,len:24},{type:"rack",dir:"h",col:7,row:94,len:24},{type:"rack",dir:"h",col:7,row:97,len:22},
    {type:"rack",dir:"h",col:7,row:98,len:22},{type:"rack",dir:"h",col:7,row:100,len:22},{type:"rack",dir:"h",col:7,row:101,len:22},
    {type:"rack",dir:"h",col:58,row:26,len:27},{type:"rack",dir:"h",col:58,row:27,len:27},{type:"rack",dir:"h",col:59,row:32,len:25},
    {type:"rack",dir:"h",col:59,row:33,len:25},{type:"rack",dir:"h",col:63,row:37,len:22},{type:"rack",dir:"h",col:63,row:38,len:22},
    {type:"rack",dir:"h",col:59,row:42,len:25},{type:"rack",dir:"h",col:59,row:43,len:25},{type:"rack",dir:"h",col:59,row:44,len:25},
    {type:"rack",dir:"h",col:59,row:45,len:25},{type:"rack",dir:"h",col:63,row:48,len:22},{type:"rack",dir:"h",col:63,row:49,len:22},
    {type:"rack",dir:"h",col:59,row:52,len:25},{type:"rack",dir:"h",col:59,row:53,len:25},{type:"rack",dir:"h",col:59,row:55,len:25},
    {type:"rack",dir:"h",col:59,row:56,len:25},{type:"rack",dir:"h",col:59,row:59,len:26},{type:"rack",dir:"h",col:59,row:60,len:26},
    {type:"rack",dir:"h",col:59,row:66,len:25},{type:"rack",dir:"h",col:59,row:67,len:25},{type:"rack",dir:"h",col:59,row:69,len:26},
    {type:"rack",dir:"h",col:59,row:70,len:26},{type:"rack",dir:"h",col:72,row:71,len:3},{type:"rack",dir:"h",col:72,row:72,len:3},
    {type:"rack",dir:"h",col:59,row:76,len:25},{type:"rack",dir:"h",col:59,row:77,len:25},{type:"rack",dir:"h",col:63,row:82,len:22},
    {type:"rack",dir:"h",col:63,row:83,len:22},{type:"rack",dir:"h",col:59,row:86,len:25},{type:"rack",dir:"h",col:59,row:87,len:25},
    {type:"rack",dir:"h",col:59,row:93,len:25},{type:"rack",dir:"h",col:59,row:94,len:25},{type:"rack",dir:"h",col:62,row:97,len:22},
    {type:"rack",dir:"h",col:62,row:98,len:22},{type:"rack",dir:"h",col:62,row:100,len:22},{type:"rack",dir:"h",col:62,row:101,len:22},
    {type:"rack",dir:"v",col:85,row:26,len:60},{type:"rack",dir:"v",col:86,row:26,len:60},{type:"rack",dir:"v",col:89,row:26,len:60},
    {type:"rack",dir:"v",col:90,row:26,len:60},{type:"rack",dir:"v",col:91,row:26,len:60},{type:"rack",dir:"v",col:92,row:26,len:60},
    {type:"rack",dir:"v",col:94,row:26,len:22},{type:"rack",dir:"v",col:95,row:26,len:22},{type:"rack",dir:"v",col:97,row:25,len:61},
    {type:"rack",dir:"v",col:98,row:25,len:61},{type:"rack",dir:"v",col:100,row:25,len:61},{type:"rack",dir:"v",col:101,row:25,len:61},
    {type:"rack",dir:"v",col:101,row:25,len:61},{type:"rack",dir:"v",col:102,row:25,len:61},{type:"rack",dir:"v",col:105,row:25,len:23},
    {type:"rack",dir:"v",col:106,row:25,len:23},{type:"rack",dir:"v",col:106,row:25,len:61},{type:"rack",dir:"v",col:107,row:25,len:61},
    {type:"rack",dir:"v",col:108,row:25,len:61},{type:"rack",dir:"v",col:109,row:25,len:61},{type:"rack",dir:"v",col:111,row:32,len:54},
    {type:"rack",dir:"v",col:112,row:32,len:54},{type:"rack",dir:"v",col:112,row:32,len:54},{type:"rack",dir:"v",col:113,row:32,len:54},
    {type:"rack",dir:"v",col:113,row:32,len:54},{type:"rack",dir:"v",col:114,row:32,len:54},{type:"rack",dir:"v",col:117,row:50,len:20},
    {type:"rack",dir:"v",col:118,row:50,len:20},{type:"rack",dir:"v",col:117,row:39,len:45},{type:"rack",dir:"v",col:118,row:39,len:45},
    {type:"rack",dir:"v",col:119,row:39,len:45},{type:"rack",dir:"v",col:120,row:39,len:45},{type:"rack",dir:"v",col:122,row:33,len:53},
    {type:"rack",dir:"v",col:123,row:33,len:53},{type:"rack",dir:"v",col:123,row:33,len:53},{type:"rack",dir:"v",col:124,row:33,len:53},
    {type:"rack",dir:"v",col:125,row:33,len:53},{type:"rack",dir:"v",col:126,row:33,len:53},{type:"rack",dir:"v",col:128,row:50,len:20},
    {type:"rack",dir:"v",col:129,row:50,len:20},{type:"rack",dir:"v",col:129,row:33,len:53},{type:"rack",dir:"v",col:130,row:33,len:53},
    {type:"rack",dir:"v",col:130,row:33,len:53},{type:"rack",dir:"v",col:131,row:33,len:53},{type:"rack",dir:"v",col:134,row:33,len:53},
    {type:"rack",dir:"v",col:135,row:33,len:53},{type:"rack",dir:"v",col:136,row:33,len:53},{type:"rack",dir:"v",col:137,row:33,len:53},
    {type:"rack",dir:"v",col:139,row:50,len:20},{type:"rack",dir:"v",col:140,row:50,len:20},{type:"rack",dir:"v",col:140,row:33,len:53},
    {type:"rack",dir:"v",col:141,row:33,len:53},{type:"rack",dir:"v",col:141,row:33,len:53},{type:"rack",dir:"v",col:142,row:33,len:53},
    {type:"rack",dir:"v",col:145,row:33,len:53},{type:"rack",dir:"v",col:146,row:33,len:53},{type:"rack",dir:"v",col:147,row:33,len:53},
    {type:"rack",dir:"v",col:148,row:33,len:53},{type:"rack",dir:"v",col:150,row:50,len:20},{type:"rack",dir:"v",col:151,row:50,len:20},
    {type:"work",col:172,row:84,w:13,d:7,name:"분배대기장",color:"#10b981",height:1},{type:"work",col:186,row:60,w:6,d:12,name:"분배대기장",color:"#10b981",height:1},{type:"wall",col:156,row:24,w:27,d:13,name:"VAS 작업장"},
    {type:"wall",col:187,row:24,w:8,d:12,name:"VAS"},{type:"wall",col:7,row:75,w:33,d:2},{type:"wall",col:51,row:75,w:33,d:2},
    ...NAMI1_COLUMNS,
  ],
  "남이천1센터||지상2층": [
    {type:"rack",dir:"h",col:42,row:38,len:7},{type:"rack",dir:"h",col:42,row:39,len:7},{type:"rack",dir:"h",col:57,row:38,len:24},
    {type:"rack",dir:"h",col:57,row:39,len:24},{type:"rack",dir:"h",col:85,row:38,len:32},{type:"rack",dir:"h",col:85,row:39,len:32},
    {type:"rack",dir:"h",col:119,row:38,len:15},{type:"rack",dir:"h",col:119,row:39,len:15},{type:"rack",dir:"h",col:152,row:38,len:12},
    {type:"rack",dir:"h",col:152,row:39,len:12},{type:"rack",dir:"h",col:57,row:43,len:59},{type:"rack",dir:"h",col:57,row:44,len:59},
    {type:"rack",dir:"h",col:119,row:43,len:15},{type:"rack",dir:"h",col:119,row:44,len:15},{type:"rack",dir:"h",col:152,row:43,len:12},
    {type:"rack",dir:"h",col:152,row:44,len:12},{type:"rack",dir:"h",col:57,row:47,len:60},{type:"rack",dir:"h",col:57,row:48,len:60},
    {type:"rack",dir:"h",col:119,row:47,len:42},{type:"rack",dir:"h",col:119,row:48,len:42},{type:"rack",dir:"h",col:62,row:50,len:10},
    {type:"rack",dir:"h",col:62,row:51,len:10},{type:"rack",dir:"h",col:74,row:50,len:20},{type:"rack",dir:"h",col:74,row:51,len:20},
    {type:"rack",dir:"h",col:97,row:50,len:19},{type:"rack",dir:"h",col:97,row:51,len:19},{type:"rack",dir:"h",col:119,row:50,len:20},
    {type:"rack",dir:"h",col:119,row:51,len:20},{type:"rack",dir:"h",col:141,row:50,len:20},{type:"rack",dir:"h",col:141,row:51,len:20},
    {type:"rack",dir:"h",col:57,row:55,len:59},{type:"rack",dir:"h",col:57,row:56,len:59},{type:"rack",dir:"h",col:119,row:55,len:45},
    {type:"rack",dir:"h",col:119,row:56,len:45},{type:"rack",dir:"h",col:57,row:59,len:59},{type:"rack",dir:"h",col:57,row:60,len:59},
    {type:"rack",dir:"h",col:119,row:59,len:42},{type:"rack",dir:"h",col:119,row:60,len:42},{type:"rack",dir:"h",col:57,row:64,len:59},
    {type:"rack",dir:"h",col:57,row:65,len:59},{type:"rack",dir:"h",col:119,row:64,len:45},{type:"rack",dir:"h",col:119,row:65,len:45},
    {type:"rack",dir:"h",col:62,row:69,len:45},{type:"rack",dir:"h",col:62,row:70,len:45},{type:"rack",dir:"h",col:120,row:69,len:43},
    {type:"rack",dir:"h",col:120,row:70,len:43},{type:"rack",dir:"h",col:62,row:72,len:10},{type:"rack",dir:"h",col:62,row:73,len:10},
    {type:"rack",dir:"h",col:74,row:72,len:20},{type:"rack",dir:"h",col:74,row:73,len:20},{type:"rack",dir:"h",col:97,row:72,len:9},
    {type:"rack",dir:"h",col:97,row:73,len:9},{type:"rack",dir:"h",col:120,row:72,len:19},{type:"rack",dir:"h",col:120,row:73,len:19},
    {type:"rack",dir:"h",col:141,row:72,len:20},{type:"rack",dir:"h",col:141,row:73,len:20},{type:"rack",dir:"h",col:58,row:77,len:48},
    {type:"rack",dir:"h",col:58,row:78,len:48},{type:"rack",dir:"h",col:109,row:77,len:55},{type:"rack",dir:"h",col:109,row:78,len:55},
    {type:"rack",dir:"h",col:58,row:83,len:14},{type:"rack",dir:"h",col:58,row:84,len:14},{type:"rack",dir:"h",col:74,row:83,len:20},
    {type:"rack",dir:"h",col:74,row:84,len:20},{type:"rack",dir:"h",col:97,row:83,len:9},{type:"rack",dir:"h",col:97,row:84,len:9},
    {type:"rack",dir:"h",col:109,row:83,len:7},{type:"rack",dir:"h",col:109,row:84,len:7},{type:"rack",dir:"h",col:119,row:83,len:20},
    {type:"rack",dir:"h",col:119,row:84,len:20},{type:"rack",dir:"h",col:141,row:83,len:20},{type:"rack",dir:"h",col:141,row:84,len:20},
    {type:"rack",dir:"h",col:58,row:86,len:48},{type:"rack",dir:"h",col:58,row:88,len:48},{type:"rack",dir:"h",col:109,row:86,len:55},
    {type:"rack",dir:"h",col:109,row:88,len:55},{type:"rack",dir:"h",col:187,row:86,len:17},{type:"rack",dir:"h",col:187,row:88,len:17},
    {type:"rack",dir:"h",col:37,row:92,len:14},{type:"rack",dir:"h",col:37,row:102,len:14},{type:"rack",dir:"h",col:58,row:92,len:48},
    {type:"rack",dir:"h",col:58,row:102,len:48},{type:"rack",dir:"h",col:109,row:92,len:24},{type:"rack",dir:"h",col:109,row:102,len:24},
    {type:"rack",dir:"h",col:147,row:92,len:57},{type:"rack",dir:"h",col:147,row:102,len:57},{type:"rack",dir:"h",col:35,row:112,len:11},
    {type:"rack",dir:"h",col:35,row:114,len:11},{type:"rack",dir:"h",col:83,row:112,len:23},{type:"rack",dir:"h",col:83,row:114,len:23},
    {type:"rack",dir:"h",col:108,row:112,len:30},{type:"rack",dir:"h",col:108,row:114,len:30},{type:"rack",dir:"h",col:154,row:112,len:12},
    {type:"rack",dir:"h",col:154,row:114,len:12},{type:"rack",dir:"h",col:178,row:112,len:10},{type:"rack",dir:"h",col:178,row:114,len:10},
    ...NAMI1_COLUMNS,
  
  ],
  "남이천1센터||지상4층": [
    {type:"rack",dir:"h",col:51,row:37,len:9},{type:"rack",dir:"h",col:51,row:38,len:9},{type:"rack",dir:"h",col:63,row:37,len:9},
    {type:"rack",dir:"h",col:63,row:38,len:9},{type:"rack",dir:"h",col:74,row:37,len:42},{type:"rack",dir:"h",col:74,row:38,len:42},
    {type:"rack",dir:"h",col:119,row:37,len:9},{type:"rack",dir:"h",col:119,row:38,len:9},{type:"rack",dir:"h",col:146,row:37,len:9},
    {type:"rack",dir:"h",col:146,row:38,len:9},{type:"rack",dir:"h",col:45,row:40,len:7},{type:"rack",dir:"h",col:45,row:41,len:7},
    {type:"rack",dir:"h",col:139,row:40,len:10},{type:"rack",dir:"h",col:139,row:41,len:10},{type:"rack",dir:"h",col:185,row:40,len:8},
    {type:"rack",dir:"h",col:185,row:41,len:8},{type:"rack",dir:"h",col:40,row:42,len:90},{type:"rack",dir:"h",col:40,row:43,len:90},
    {type:"rack",dir:"h",col:185,row:42,len:8},{type:"rack",dir:"h",col:185,row:43,len:8},{type:"rack",dir:"h",col:41,row:47,len:89},
    {type:"rack",dir:"h",col:41,row:48,len:89},{type:"rack",dir:"h",col:40,row:52,len:90},{type:"rack",dir:"h",col:40,row:53,len:90},
    {type:"rack",dir:"h",col:185,row:52,len:8},{type:"rack",dir:"h",col:185,row:53,len:8},{type:"rack",dir:"h",col:40,row:55,len:90},
    {type:"rack",dir:"h",col:40,row:56,len:90},{type:"rack",dir:"h",col:41,row:58,len:87},{type:"rack",dir:"h",col:41,row:59,len:87},
    {type:"rack",dir:"h",col:185,row:58,len:8},{type:"rack",dir:"h",col:185,row:59,len:8},{type:"rack",dir:"h",col:41,row:60,len:20},
    {type:"rack",dir:"h",col:41,row:61,len:20},{type:"rack",dir:"h",col:63,row:60,len:53},{type:"rack",dir:"h",col:63,row:61,len:53},
    {type:"rack",dir:"h",col:119,row:60,len:9},{type:"rack",dir:"h",col:119,row:61,len:9},{type:"rack",dir:"h",col:185,row:60,len:8},
    {type:"rack",dir:"h",col:185,row:61,len:8},{type:"rack",dir:"h",col:40,row:64,len:90},{type:"rack",dir:"h",col:40,row:65,len:90},
    {type:"rack",dir:"h",col:41,row:69,len:89},{type:"rack",dir:"h",col:41,row:70,len:89},{type:"rack",dir:"h",col:185,row:69,len:8},
    {type:"rack",dir:"h",col:185,row:70,len:8},{type:"rack",dir:"h",col:41,row:72,len:89},{type:"rack",dir:"h",col:41,row:73,len:89},
    {type:"rack",dir:"h",col:40,row:75,len:90},{type:"rack",dir:"h",col:40,row:76,len:90},{type:"rack",dir:"h",col:40,row:77,len:90},
    {type:"rack",dir:"h",col:40,row:78,len:90},{type:"rack",dir:"h",col:185,row:77,len:8},{type:"rack",dir:"h",col:185,row:78,len:8},
    {type:"rack",dir:"h",col:41,row:83,len:89},{type:"rack",dir:"h",col:41,row:84,len:89},{type:"rack",dir:"h",col:40,row:87,len:90},
    {type:"rack",dir:"h",col:40,row:88,len:90},{type:"rack",dir:"h",col:185,row:87,len:19},{type:"rack",dir:"h",col:185,row:88,len:19},
    {type:"rack",dir:"h",col:40,row:91,len:88},{type:"rack",dir:"h",col:40,row:93,len:88},{type:"rack",dir:"h",col:152,row:91,len:7},
    {type:"rack",dir:"h",col:152,row:93,len:7},{type:"rack",dir:"h",col:176,row:91,len:28},{type:"rack",dir:"h",col:176,row:93,len:28},
    {type:"rack",dir:"h",col:40,row:97,len:79},{type:"rack",dir:"h",col:40,row:99,len:79},{type:"rack",dir:"h",col:152,row:97,len:42},
    {type:"rack",dir:"h",col:152,row:99,len:42},{type:"rack",dir:"h",col:40,row:103,len:79},{type:"rack",dir:"h",col:40,row:105,len:79},
    {type:"rack",dir:"h",col:143,row:103,len:6},{type:"rack",dir:"h",col:143,row:105,len:6},{type:"rack",dir:"h",col:153,row:103,len:31},
    {type:"rack",dir:"h",col:153,row:105,len:31},{type:"rack",dir:"h",col:198,row:103,len:6},{type:"rack",dir:"h",col:198,row:105,len:6},
    {type:"rack",dir:"h",col:40,row:108,len:29},{type:"rack",dir:"h",col:40,row:110,len:29},{type:"rack",dir:"h",col:81,row:108,len:38},
    {type:"rack",dir:"h",col:81,row:110,len:38},{type:"rack",dir:"h",col:141,row:108,len:32},{type:"rack",dir:"h",col:141,row:110,len:32},
    {type:"rack",dir:"h",col:187,row:108,len:7},{type:"rack",dir:"h",col:187,row:110,len:7},{type:"rack",dir:"h",col:40,row:114,len:9},
    {type:"rack",dir:"h",col:40,row:115,len:9},{type:"rack",dir:"h",col:52,row:114,len:20},{type:"rack",dir:"h",col:52,row:115,len:20},
    {type:"rack",dir:"h",col:75,row:114,len:19},{type:"rack",dir:"h",col:75,row:115,len:19},{type:"rack",dir:"h",col:97,row:114,len:29},
    {type:"rack",dir:"h",col:97,row:115,len:29},{type:"rack",dir:"h",col:155,row:114,len:8},{type:"rack",dir:"h",col:155,row:115,len:8},
    {type:"rack",dir:"h",col:179,row:114,len:9},{type:"rack",dir:"h",col:179,row:115,len:9},
    ...NAMI1_COLUMNS,
  
  ],
};
let _rackSeq = 0;
// 층별 실재고 합계 캐시 — saveState()가 초기화 중에도 부르므로 선언이 그보다 앞서야 한다
// (아래쪽에서 let으로 선언하면 TDZ에 걸려 첫 로드가 통째로 중단된다)
let _floorInvCache = new Map();
// 기본 랙 요소 → 편집 가능한 완전한 요소로 확장(고유 id·기본값 채움)
function materializeDefaultRack(e) {
  const id = "el-def-" + (_rackSeq++).toString(36);
  if (e.type === "rack") {
    return {
      id, type: "rack", col: e.col, row: e.row, len: e.len, dir: e.dir === "v" ? "v" : "h",
      levels: e.levels || TWIN_LEVELS, customer: e.customer || "", name: e.name || "",
      capa: e.capa || 0, fill: e.fill != null ? e.fill : 0.6, color: e.color || "#5ac8fa",
      cat: e.cat || "",
    };
  }
  if (e.x1 != null) {
    // 사선(자유선) 벽 — 두 점으로 정의
    return {
      id, type: e.type, x1: e.x1, y1: e.y1, x2: e.x2, y2: e.y2,
      th: e.th || WALL_TH_DEFAULT, height: e.height || 1, name: e.name || "", color: e.color || "#ef4444",
    };
  }
  const base = {
    id, type: e.type, col: e.col, row: e.row, w: e.w || 1, d: e.d || 1,
    name: e.name || "", color: e.color || (e.type === "column" ? "#9aa3b2" : e.type === "wall" ? "#ef4444" : "#64748b"), height: e.height || 1,
  };
  if (e.type === "bulk") {
    base.stack = e.stack || BULK_STACK_DEFAULT;
    base.rate = e.rate == null ? BULK_RATE_DEFAULT : e.rate;
    base.customer = e.customer || "";
    base.cat = e.cat || "";
    if (!e.color) base.color = "#a16207";
  }
  return base;
}

// 남이천1센터 남동측 사선 외벽 — 도면 PNG에서 검출(층별로 끝점이 조금 다름)
const NAMI1_DIAGONAL_WALLS = {
  남이천1센터: { x1: 151.6, y1: 110.6, x2: 203.4, y2: 82.6 },
  "남이천1센터||지상2층": { x1: 151.3, y1: 110.1, x2: 212.2, y2: 77.7 },
  "남이천1센터||지상4층": { x1: 151.4, y1: 110.1, x2: 211.5, y2: 78.1 },
};
function nami1DiagWall(key) {
  const p = NAMI1_DIAGONAL_WALLS[key];
  return p ? { type: "wall", ...p, th: 0.6, height: 4, name: "" } : null;
}
// 기본 배치에도 포함시켜 '기본 배치 다시 불러오기' 때 함께 들어가게 한다
Object.keys(NAMI1_DIAGONAL_WALLS).forEach((key) => {
  if (Array.isArray(DEFAULT_RACK_LAYOUTS[key])) DEFAULT_RACK_LAYOUTS[key].push(nami1DiagWall(key));
});
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
  offbook: {},
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
      bgAdjustOpen: !!parsed.bgAdjustOpen,
      twinLabels: parsed.twinLabels !== false,
      twinTypeVis: parsed.twinTypeVis || {}, // 요소 타입별 3D 표시 여부 (없으면 표시)
      twinTypeLabels: parsed.twinTypeLabels || {}, // 요소 타입별 이름표 (없으면 기존 동작)
      rackLayoutsBackup: parsed.rackLayoutsBackup || {},
      centerWmsCodes: parsed.centerWmsCodes || {},
      lastMarketCode: parsed.lastMarketCode || "",
      layoutToolsOpen: !!parsed.layoutToolsOpen,
      gaonUserId: parsed.gaonUserId || "",
      gaonShippers: parsed.gaonShippers || {},
      photoPanelOpen: !!parsed.photoPanelOpen,
      nami1DiagWalls: !!parsed.nami1DiagWalls,
      offbook: parsed.offbook || {},
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
  // 존재하지 않는 센터의 잔여 배치 정리 (과거 잘못된 키로 저장된 데이터 제거)
  const validKeys = new Set();
  state.centers.forEach((c) => getCenterFloors(c).forEach((f) => validKeys.add(floorplanKey(c, f))));
  ["rackLayouts", "floorplans"].forEach((field) => {
    Object.keys(state[field] || {}).forEach((key) => {
      const center = key.split("||")[0];
      if (!state.centers.includes(center)) {
        delete state[field][key];
        changed = true;
      }
    });
  });
  // 기본 랙/기둥/벽 배치 — 버전이 바뀌면 기본 배치 키를 새로 시드(좌표·도면 갱신 반영)
  if (state.defaultRacksVersion !== DEFAULT_RACKS_VERSION) {
    Object.entries(DEFAULT_RACK_LAYOUTS).forEach(([key, els]) => {
      // 이미 배치가 있는 층은 절대 자동으로 덮어쓰지 않는다 (작업 내용 보호).
      // 새 기본 배치를 쓰려면 편집 화면의 '기본 배치 다시 불러오기'를 누른다.
      const cur = state.rackLayouts[key];
      if (cur && Array.isArray(cur.racks) && cur.racks.length) return;
      state.rackLayouts[key] = { racks: els.map(materializeDefaultRack) };
    });
    state.defaultRacksVersion = DEFAULT_RACKS_VERSION;
    state.defaultRacksSeeded = true;
    changed = true;
  }
  // 요소 id 중복 정리 — id가 겹치면 선택·이동·삭제가 엉뚱한 요소에 적용된다
  Object.values(state.rackLayouts || {}).forEach((layout) => {
    if (!layout || !Array.isArray(layout.racks)) return;
    const seen = new Set();
    layout.racks.forEach((el, i) => {
      if (!el.id || seen.has(el.id)) {
        let uid = `el-fix-${i}`;
        while (seen.has(uid)) uid += "x";
        el.id = uid;
        changed = true;
      }
      seen.add(el.id);
    });
  });
  // 남이천1센터 사선 외벽 1회 추가 — 기존 배치를 덮어쓰지 않고 없을 때만 덧붙인다
  if (!state.nami1DiagWalls) {
    Object.keys(NAMI1_DIAGONAL_WALLS).forEach((key) => {
      const cur = state.rackLayouts[key];
      if (!cur || !Array.isArray(cur.racks)) return;
      if (cur.racks.some(isFreeWall)) return; // 이미 사선 벽이 있으면 건너뜀
      // id는 반드시 고유해야 한다 — materializeDefaultRack의 el-def-N 은 페이지 로드마다
      // 0부터 다시 매겨져 기존 요소와 겹치고, 그러면 선택·편집이 엉뚱한 요소로 간다
      const el = materializeDefaultRack(nami1DiagWall(key));
      const used = new Set(cur.racks.map((r) => r.id));
      let uid = "el-diagwall";
      while (used.has(uid)) uid += "x";
      el.id = uid;
      cur.racks.push(el);
    });
    state.nami1DiagWalls = true;
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
  invalidateCapaCache(); // 배치·재고·미전산이 바뀌면 층별 실재고 합계를 다시 계산
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
  let plt = 0;
  const len = Math.max(1, Math.round(number(rack.len)));
  const levels = Math.max(1, Math.round(number(rack.levels) || TWIN_LEVELS));
  if (!inv || !rack.cellPrefix) return { set, count: 0, qty: 0, plt: 0 };
  for (let b = 0; b < len; b++) {
    for (let l = 0; l < levels; l++) {
      const code = `${rack.cellPrefix}-${pad2(b + 1)}-${pad2((l + 1) * 10)}`;
      const cell = inv.cells[code];
      if (cell) {
        set.add(`${b},${l}`);
        qty += number(cell.q);
        plt += number(cell.plt);
      }
    }
  }
  return { set, count: set.size, qty, plt };
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

/* ===== 미전산재고 — gaon에 안 올라간 실물 재고 =====
   {id, floor, customer, plt, area, reason, createdAt} 를 센터별로 보관하고
   사용 CAPA에 합산한다. */
function offbookList(center) {
  if (!state.offbook) state.offbook = {};
  if (!Array.isArray(state.offbook[center])) state.offbook[center] = [];
  return state.offbook[center];
}
function offbookPlt(center, floor) {
  return offbookList(center).reduce(
    (sum, r) => (floor && r.floor !== floor ? sum : sum + number(r.plt)),
    0,
  );
}

// 보관 분류 — 랙/평치 요소에 붙여 도면에서 분류별 CAPA를 뽑는다
const STORAGE_MAJOR = "보관공간";
function storageCats() {
  const list = state.majors?.[STORAGE_MAJOR];
  return Array.isArray(list) && list.length ? list : ["일반"];
}
function elementCat(el) {
  const cats = storageCats();
  return el?.cat && cats.includes(el.cat) ? el.cat : cats[0];
}
function emptyByCat() {
  const o = {};
  storageCats().forEach((c) => (o[c] = 0));
  return o;
}

function invalidateCapaCache() {
  _floorInvCache = new Map();
}

// 층별 실재고 집계 — 그 층 랙에 맵핑된 셀만 분류·화주별로 나눠 합산한다.
// 매 렌더마다 반복 호출되므로 캐시하고 saveState()에서 무효화한다.
function floorInventoryStats(center, floor) {
  const inv = getInventory(center);
  const empty = { plt: 0, byCat: emptyByCat(), byCustomer: {} };
  if (!inv) return empty;
  const key = `${center}|${floor}|${inv.importedAt || ""}`;
  if (_floorInvCache.has(key)) return _floorInvCache.get(key);

  // 접두 → 랙 (같은 층에 한정). 셀을 한 번만 훑기 위해 먼저 색인한다
  const byPrefix = new Map();
  (getRackLayout(center, floor).racks || []).forEach((r) => {
    if (r.type !== "rack" || !r.cellPrefix) return;
    if (!byPrefix.has(r.cellPrefix)) byPrefix.set(r.cellPrefix, []);
    byPrefix.get(r.cellPrefix).push(r);
  });
  const out = { plt: 0, byCat: emptyByCat(), byCustomer: {} };
  Object.entries(inv.cells || {}).forEach(([code, v]) => {
    const p = parseCellCode(code);
    if (!p) return;
    const hits = byPrefix.get(p.prefix);
    if (!hits) return;
    const rack = hits.find(
      (r) => p.bay >= 1 && p.bay <= number(r.len) && p.level >= 1 && p.level <= (number(r.levels) || TWIN_LEVELS),
    );
    if (!rack) return;
    const plt = number(v.plt);
    out.plt += plt;
    const cat = elementCat(rack);
    out.byCat[cat] = (out.byCat[cat] || 0) + plt;
    const name = v.c || "미지정";
    out.byCustomer[name] = (out.byCustomer[name] || 0) + plt;
  });
  const r1 = (n) => Math.round(n * 10) / 10;
  out.plt = r1(out.plt);
  Object.keys(out.byCat).forEach((k) => (out.byCat[k] = r1(out.byCat[k])));
  Object.keys(out.byCustomer).forEach((k) => (out.byCustomer[k] = r1(out.byCustomer[k])));
  _floorInvCache.set(key, out);
  return out;
}
function floorInventoryPlt(center, floor) {
  return floorInventoryStats(center, floor).plt;
}

// 미전산재고도 같은 형태로 집계 (분류는 항목에 지정한 값)
function offbookStats(center, floor) {
  const out = { plt: 0, byCat: emptyByCat(), byCustomer: {} };
  offbookList(center).forEach((r) => {
    if (floor && r.floor !== floor) return;
    const plt = number(r.plt);
    out.plt += plt;
    const cat = elementCat(r);
    out.byCat[cat] = (out.byCat[cat] || 0) + plt;
    if (r.customer) out.byCustomer[r.customer] = (out.byCustomer[r.customer] || 0) + plt;
  });
  const r1 = (n) => Math.round(n * 10) / 10;
  out.plt = r1(out.plt);
  Object.keys(out.byCat).forEach((k) => (out.byCat[k] = r1(out.byCat[k])));
  Object.keys(out.byCustomer).forEach((k) => (out.byCustomer[k] = r1(out.byCustomer[k])));
  return out;
}

// 층 단위 분류별 실측값 — {중분류: {capacity, used}}
function floorCategoryStats(center, floor) {
  const capa = floorRackCapa(center, floor);
  const inv = floorInventoryStats(center, floor);
  const off = offbookStats(center, floor);
  const out = {};
  storageCats().forEach((c) => {
    out[c] = {
      capacity: capa.byCat[c] || 0,
      used: Math.round(((inv.byCat[c] || 0) + (off.byCat[c] || 0)) * 10) / 10,
    };
  });
  return out;
}

// 화주별 실측 점유 — gaon 재고 + 미전산 (대시보드 점유 고객사 현황용)
function floorMeasuredShippers(center, floor) {
  const inv = floorInventoryStats(center, floor);
  const off = offbookStats(center, floor);
  const map = {};
  [inv.byCustomer, off.byCustomer].forEach((src) =>
    Object.entries(src).forEach(([name, plt]) => (map[name] = (map[name] || 0) + plt)),
  );
  return Object.entries(map).map(([name, used]) => ({
    name, used: Math.round(used * 10) / 10, center, floor, major: STORAGE_MAJOR, minor: "",
  }));
}

// 실측 기준 CAPA — 전체는 도면 랙(베이×단)+평치, 사용은 gaon 실재고 + 미전산재고.
// 도면이나 재고가 없는 층은 기존 수기입력값으로 폴백한다.
function measuredTotals(center, floor, manual) {
  const slots = floorRackCapa(center, floor).slots;
  const invPlt = floorInventoryPlt(center, floor);
  const off = offbookPlt(center, floor);
  const measured = invPlt || off;
  return {
    capacity: slots || manual.capacity,
    used: measured ? Math.round((invPlt + off) * 10) / 10 : manual.used,
    shippers: measured ? floorMeasuredShippers(center, floor) : manual.shippers,
  };
}

function centerTotals(center, filterMajor = ALL) {
  if (filterMajor === ALL || filterMajor === STORAGE_MAJOR) {
    // 센터 합계도 층별 실측값을 더한다 (분류 필터가 걸리면 수기입력 기준 유지)
    return getCenterFloors(center).reduce(
      (total, floor) => {
        const f = floorTotals(center, floor, filterMajor);
        total.capacity += f.capacity;
        total.used += f.used;
        total.shippers.push(...f.shippers);
        return total;
      },
      { capacity: 0, used: 0, shippers: [] },
    );
  }
  return centerTotalsManual(center, filterMajor);
}

function centerTotalsManual(center, filterMajor = ALL) {
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
  const manual = floorTotalsManual(center, floor, filterMajor);
  // 도면 랙·평치는 모두 보관공간이므로 그 분류에 한해서도 실측값을 쓴다.
  // 작업공간·사무실공간은 도면에서 산출할 수 없어 수기입력값을 유지한다.
  if (filterMajor !== ALL && filterMajor !== STORAGE_MAJOR) return manual;
  return { ...manual, ...measuredTotals(center, floor, manual) };
}

function floorTotalsManual(center, floor, filterMajor = ALL) {
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
  const catStats = floorCategoryStats(selectedCenter, selectedFloor);
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
      <span>도면 기준</span>
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
            // 보관공간은 도면에서 산출한 분류별 값이 우선. 수기값은 참고/폴백으로 남긴다
            const meas = major === STORAGE_MAJOR ? catStats[minor] : null;
            const capacity = meas && meas.capacity ? meas.capacity : number(record.capacity);
            const used = meas && (meas.used || meas.capacity) ? meas.used : recordUsed(record);
            const freeValue = Math.max(capacity - used, 0);
            return `
              <div class="capa-entry-row">
                <strong class="${index === 0 ? "" : "muted-major"}">${index === 0 ? major : ""}</strong>
                <span>${minor}</span>
                <em class="drawn-capa">${meas && meas.capacity ? formatPlt(meas.capacity) : "–"}</em>
                <input class="capa-entry-input" data-major="${major}" data-minor="${minor}" data-field="capacity" type="number" min="0" step="1" value="${number(record.capacity) || ""}" />
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
  renderInventoryView();
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
// 이미지 팝업 — 사진·도면을 클릭할 때만 크게 표시
function openImgModal(src, caption) {
  if (!src) {
    alert("표시할 이미지가 없습니다. ‘사진·도면’을 펼쳐 업로드하세요.");
    return;
  }
  const m = $("#imgModal");
  if (!m) return;
  $("#imgModalImg").src = src;
  $("#imgModalCaption").textContent = caption || "";
  m.hidden = false;
}
function closeImgModal() {
  const m = $("#imgModal");
  if (!m) return;
  m.hidden = true;
  $("#imgModalImg").removeAttribute("src");
}

function renderTwinPhoto() {
  const img = $("#twinPhotoImg");
  if (img) {
    const src = getCenterPhoto(twinActiveCenter());
    img.src = src;
    img.style.display = src ? "block" : "none";
    const empty = $("#twinPhotoEmpty");
    if (empty) empty.style.display = src ? "none" : "block";
  }
  // 나란히 보기: 현재 층 PDF 도면
  const plan = $("#twinPlanImg");
  if (plan) {
    const floor = twinActiveFloor();
    const src = getFloorplan(twinActiveCenter(), floor).image || "";
    plan.src = src;
    plan.style.display = src ? "block" : "none";
    const empty = $("#twinPlanEmpty");
    if (empty) empty.style.display = src ? "none" : "block";
    const tag = $("#twinPlanFloor");
    if (tag) tag.textContent = floor ? `· ${floor}` : "";
  }
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
  const elements = (getRackLayout(center, floor).racks || []).filter(
    (e) =>
      twinTypeVisible(e.type || "rack") &&
      (isFreeWall(e)
        ? wallGeom(e).len > 0
        : elementTypeInfo(e.type).shape === "area"
          ? number(e.w) > 0 && number(e.d) > 0
          : number(e.len) > 0),
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
      if (isFreeWall(e)) {
        const g = wallGeom(e);
        items.push({
          type: "wall",
          free: true,
          cx: g.cx,
          cy: g.cy,
          len: g.len,
          deg: g.deg,
          th: g.th,
          height: Math.max(1, Math.round(number(e.height) || 1)),
          color: e.color || info.color,
          name: e.name || "",
        });
        areaLegend.set(info.label, e.color || info.color);
      } else if (info.shape === "area") {
        items.push({
          type: e.type,
          col: e.col,
          row: e.row,
          w: Math.max(1, Math.round(number(e.w))),
          d: Math.max(1, Math.round(number(e.d))),
          height: Math.max(1, Math.round(number(e.height) || 1)),
          color: e.color || info.color,
          name: e.name || "", // 이름을 지정하지 않았으면 빈값 유지 (라벨 표시 판단용)
          stack: e.type === "bulk" ? bulkStack(e) : undefined,
          rate: e.type === "bulk" ? bulkRate(e) : undefined,
          customer: e.customer || "",
          _slots: e.type === "bulk" ? bulkSlots(e) : undefined,
        });
        areaLegend.set(e.type === "bulk" && e.customer ? e.customer : info.label, e.color || info.color);
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
          name: e.name || "", // 이름 미지정 시 빈값 (라벨은 이름 있을 때만 표시)
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
  const rc = floorRackCapa(center, floor);
  const rcEl = $("#twinRackCapa");
  if (rcEl) {
    rcEl.textContent = rc.slots.toLocaleString("ko-KR");
    rcEl.title =
      `랙 ${rc.racks}개 · ${(rc.slots - rc.bulkSlots).toLocaleString("ko-KR")} PLT` +
      (rc.bulks ? `\n평치/벌크 ${rc.bulks}구역 · ${rc.bulkSlots.toLocaleString("ko-KR")} PLT` : "") +
      `\n적재(추정) ${rc.filled.toLocaleString("ko-KR")} PLT`;
  }

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
    // 랙 배치 편집 중에는 3D 렌더 중지 — 편집 조작이 끊기지 않도록 CPU/GPU 확보
    if (twinViewMode === "edit") return;
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
  bulk: { label: "평치/벌크", color: "#a16207", shape: "area" }, // 바닥 직접 적치 — 면적 기반 CAPA
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

// 이름표 기본값: 사용자가 이름을 직접 입력한 경우에만 표시하는 타입
// (벽/챔버·도크/출입구·통로·기둥·랙은 이름을 넣기 전까지 라벨을 띄우지 않는다)
const TWIN_LABEL_NAMED_ONLY = new Set(["rack", "dock", "aisle", "column", "wall"]);
// 3D 보기에서 기본으로 숨기는 타입 (표시 요소 패널에서 켤 수 있음)
const TWIN_HIDDEN_BY_DEFAULT = new Set(["wall"]);

function twinTypeVisible(type) {
  const v = state.twinTypeVis?.[type];
  return v === undefined ? !TWIN_HIDDEN_BY_DEFAULT.has(type) : v !== false;
}
// named = 사용자가 이름을 직접 입력했는지. 패널에서 켜고 끄면 그 설정이 우선한다.
function twinTypeLabelOn(type, named) {
  if (state.twinLabels === false) return false;
  const v = state.twinTypeLabels?.[type];
  if (v !== undefined) return !!v;
  return named || !TWIN_LABEL_NAMED_ONLY.has(type);
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
    // 반복 요소 공유 자원 (인스턴싱 대상)
    doorMat: new THREE.MeshStandardMaterial({ color: 0xb8c2cf, roughness: 0.5, metalness: 0.4 }),
    dockDoorGeoH: new THREE.BoxGeometry(1.2, 2.0, 0.16),
    dockDoorGeoV: new THREE.BoxGeometry(0.16, 2.0, 1.2),
    tableMat: new THREE.MeshStandardMaterial({ color: 0x9aa7b6, roughness: 0.6, metalness: 0.2 }),
    tableGeo: new THREE.BoxGeometry(1.2, 0.5, 0.7),
    colMatByColor: new Map(),
    colCapMat: new THREE.MeshStandardMaterial({ color: 0x5b6472, roughness: 0.85 }),
    colGeoByKey: new Map(),
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

// ── 인스턴싱 배치 — 같은 지오메트리+재질을 InstancedMesh 하나로 묶어 드로우콜 최소화
function twinBatchPush(batch, geo, mat, x, y, z, rotY = 0) {
  const key = geo.uuid + "|" + mat.uuid;
  let e = batch.get(key);
  if (!e) {
    e = { geo, mat, list: [] };
    batch.set(key, e);
  }
  e.list.push(x, y, z, rotY);
}
function twinBatchFlush(batch, group) {
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const eu = new THREE.Euler();
  const pos = new THREE.Vector3();
  const one = new THREE.Vector3(1, 1, 1);
  batch.forEach((e) => {
    const n = e.list.length / 4;
    if (!n) return;
    const im = new THREE.InstancedMesh(e.geo, e.mat, n);
    im.castShadow = true;
    im.receiveShadow = true;
    for (let i = 0; i < n; i++) {
      pos.set(e.list[i * 4], e.list[i * 4 + 1], e.list[i * 4 + 2]);
      eu.set(0, e.list[i * 4 + 3], 0);
      q.setFromEuler(eu);
      m.compose(pos, q, one);
      im.setMatrixAt(i, m);
    }
    im.instanceMatrix.needsUpdate = true;
    group.add(im);
  });
  batch.clear();
}

// 랙 유닛 생성 — spec: {col,row,len,dir:'h'|'v',levels,fill}
// dir 'h': 베이가 +col(x)로, dir 'v': 베이가 +row(z)로 진행
function buildTwinRackUnit(group, res, spec, boxMat, batch) {
  const { col, row, len, levels, fill } = spec;
  const horiz = spec.dir !== "v";
  const H = levels * TWIN_LEVEL_H;
  const postGeo = twinPostGeo(res, levels);
  const depthBase = (1 - TWIN_DEPTH) / 2;
  const yRot = horiz ? 0 : Math.PI / 2;
  const push = (geo, mat, bayOff, depthOff, y, rot = 0) => {
    const x = horiz ? col + bayOff : col + depthOff;
    const z = horiz ? row + depthOff : row + bayOff;
    twinBatchPush(batch, geo, mat, x, y, z, rot);
  };
  // 기둥 (베이 경계마다 앞/뒤)
  for (let b = 0; b <= len; b++) {
    for (const dOff of [depthBase, depthBase + TWIN_DEPTH]) push(postGeo, res.steel, b, dOff, H / 2);
  }
  // 가로 빔 (단마다 앞/뒤)
  const beamGeo = twinBeamGeo(res, len);
  for (let l = 1; l <= levels; l++) {
    for (const dOff of [depthBase, depthBase + TWIN_DEPTH])
      push(beamGeo, res.beam, len / 2, dOff, l * TWIN_LEVEL_H - 0.12, yRot);
  }
  // 팔레트 + 적재 박스
  const addPallet = (b, l, mat) => {
    const y = l * TWIN_LEVEL_H + 0.06;
    push(res.palGeo, res.wood, b + 0.5, depthBase + TWIN_DEPTH / 2, y, yRot);
    push(res.boxGeo, mat, b + 0.5, depthBase + TWIN_DEPTH / 2, y + TWIN_LEVEL_H * 0.32, yRot);
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

// ── 표시 요소 패널 — 타입별로 3D 표시/이름표를 켜고 끈다 ────────────────────
function renderTwinLayerPanel() {
  const rows = $("#twinLayerRows");
  if (!rows) return;
  rows.innerHTML = Object.entries(TWIN_ELEMENT_TYPES)
    .map(([key, v]) => {
      const vis = twinTypeVisible(key);
      // 이름표 체크는 '이름 없는 요소에도 라벨을 띄우는가'를 나타낸다
      const lab = twinTypeLabelOn(key, false);
      return `<label class="twin-layer-row ${vis ? "" : "off"}">
        <span class="twin-layer-name"><i class="sw" style="background:${v.color}"></i>${v.label}</span>
        <input type="checkbox" data-layer-vis="${key}" ${vis ? "checked" : ""} title="3D에 표시" />
        <input type="checkbox" data-layer-label="${key}" ${lab ? "checked" : ""} ${vis ? "" : "disabled"} title="이름표 표시 (이름을 입력한 요소는 항상 표시)" />
      </label>`;
    })
    .join("");
  const btn = $("#twinLayerToggle");
  if (btn) {
    const hidden = Object.keys(TWIN_ELEMENT_TYPES).filter((k) => !twinTypeVisible(k));
    btn.textContent = hidden.length ? `🧩 표시 요소 (${hidden.length} 숨김)` : "🧩 표시 요소";
    btn.classList.toggle("off", !!hidden.length);
  }
}

function bindTwinLayerPanel() {
  const toggle = $("#twinLayerToggle");
  const panel = $("#twinLayerPanel");
  if (!toggle || !panel) return;
  renderTwinLayerPanel();
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    panel.hidden = !panel.hidden;
    toggle.setAttribute("aria-expanded", String(!panel.hidden));
    if (!panel.hidden) renderTwinLayerPanel();
  });
  panel.addEventListener("click", (e) => e.stopPropagation());
  document.addEventListener("click", () => {
    if (!panel.hidden) {
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    }
  });
  panel.addEventListener("change", (e) => {
    const vis = e.target.dataset.layerVis;
    const lab = e.target.dataset.layerLabel;
    if (vis) {
      if (!state.twinTypeVis) state.twinTypeVis = {};
      state.twinTypeVis[vis] = e.target.checked;
    } else if (lab) {
      if (!state.twinTypeLabels) state.twinTypeLabels = {};
      state.twinTypeLabels[lab] = e.target.checked;
    } else return;
    saveState();
    renderTwinLayerPanel();
    if (twinViewMode === "view") render3DTwin();
  });
  $("#twinLayerReset")?.addEventListener("click", () => {
    state.twinTypeVis = {};
    state.twinTypeLabels = {};
    saveState();
    renderTwinLayerPanel();
    if (twinViewMode === "view") render3DTwin();
  });
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
  const batch = new Map();
  items.forEach((spec) => {
    if (spec.free) {
      buildTwinFreeWall(group, res, spec);
      return;
    }
    if (elementTypeInfo(spec.type).shape === "area") {
      buildTwinArea(group, res, spec, batch);
      return;
    }
    const boxMat = twinBoxMat(res, spec.color || "#5ac8fa");
    buildTwinRackUnit(group, res, spec, boxMat, batch);
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
    // 이름을 지정한 랙만 이름 표시 (표시 요소 패널에서 강제로 켜면 고객사명 사용)
    const rackLabel = (spec.name && String(spec.name).trim()) || "";
    if (twinTypeLabelOn("rack", !!rackLabel)) {
      const label = makeTwinLabel(rackLabel || spec.customer || "랙");
      label.position.set(
        horiz ? spec.col + spec.len / 2 : spec.col + 0.5,
        H + 0.8,
        horiz ? spec.row + 0.5 : spec.row + spec.len / 2,
      );
      group.add(label);
      twinState.labels.push(label);
    }
  });
  twinBatchFlush(batch, group);
}

// 사선(자유선) 벽 — 두 점 사이를 y축 회전한 판으로 세운다
function buildTwinFreeWall(group, res, spec) {
  const color = new THREE.Color(spec.color || elementTypeInfo("wall").color);
  const H = spec.height ? spec.height * TWIN_LEVEL_H : 6.2;
  const rotY = (-spec.deg * Math.PI) / 180; // 화면 y축(아래로 +)과 3D z축 방향이 반대
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0.05, transparent: true, opacity: 0.9 });
  const geo = new THREE.BoxGeometry(spec.len, H, spec.th);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(spec.cx, H / 2, spec.cy);
  mesh.rotation.y = rotY;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0x2a3340 }));
  edges.position.copy(mesh.position);
  edges.rotation.y = rotY;
  group.add(edges);

  const pick = new THREE.Mesh(new THREE.BoxGeometry(spec.len, Math.max(H, 0.6), Math.max(spec.th, 0.6)), res.pickMat);
  pick.position.copy(mesh.position);
  pick.rotation.y = rotY;
  pick.userData.zone = { _area: true, name: spec.name || "벽/챔버", typeLabel: "벽/챔버" };
  group.add(pick);
  twinState.pick.push(pick);

  const named = !!(spec.name && String(spec.name).trim());
  if (twinTypeLabelOn("wall", named)) {
    const label = makeTwinLabel(spec.name || "벽/챔버");
    label.position.set(spec.cx, H + 0.8, spec.cy);
    group.add(label);
    twinState.labels.push(label);
  }
}

// 사각 영역 요소 (사무실/도크/작업장/통로/기타)
function buildTwinArea(group, res, spec, batch) {
  const { type } = spec;
  const color = new THREE.Color(spec.color || elementTypeInfo(type).color);
  const cx = spec.col + spec.w / 2;
  const cz = spec.row + spec.d / 2;
  let H;
  if (type === "bulk") H = buildTwinBulk(group, spec, color, batch);
  else if (type === "office") H = buildTwinOffice(group, spec, color);
  else if (type === "dock") H = buildTwinDock(group, spec, color, batch);
  else if (type === "work") H = buildTwinWork(group, spec, color, batch);
  else if (type === "aisle") H = buildTwinAisle(group, spec, color);
  else if (type === "column") H = buildTwinColumn(group, spec, color, batch);
  else if (type === "wall") H = buildTwinWall(group, spec, color);
  else H = buildTwinGeneric(group, spec, color);

  const ph = Math.max(H, 0.6);
  const pick = new THREE.Mesh(new THREE.BoxGeometry(spec.w, ph, spec.d), res.pickMat);
  pick.position.set(cx, ph / 2, cz);
  pick.userData.zone =
    type === "bulk"
      ? {
          _area: true,
          name: spec.name || (spec.customer ? `평치 · ${spec.customer}` : "평치/벌크"),
          typeLabel: `평치/벌크 ${spec.w}×${spec.d}칸 · ${spec.stack}단 · ${spec.rate}%`,
          capa: spec._slots,
        }
      : { _area: true, name: spec.name || elementTypeInfo(type).label, typeLabel: elementTypeInfo(type).label };
  group.add(pick);
  twinState.pick.push(pick);

  // 벽/챔버·도크·통로·기둥은 이름을 직접 입력했을 때만 표시 (패널 설정이 있으면 그쪽이 우선)
  const named = !!(spec.name && String(spec.name).trim());
  if (twinTypeLabelOn(type, named)) {
    const label = makeTwinLabel(spec.name || elementTypeInfo(type).label);
    label.position.set(cx, H + 0.8, cz);
    group.add(label);
    twinState.labels.push(label);
  }
}

// 평치/벌크 적치 — 바닥 구역 위에 파렛트를 격자로 쌓아 보여준다
function buildTwinBulk(group, spec, color, batch) {
  const { col, row, w, d } = spec;
  const stack = Math.max(1, Math.round(spec.stack || BULK_STACK_DEFAULT));
  const rate = Math.max(0, Math.min(100, spec.rate == null ? BULK_RATE_DEFAULT : spec.rate)) / 100;
  const res = twinResources();
  const floorZone = new THREE.Mesh(
    new THREE.BoxGeometry(w * 0.98, 0.05, d * 0.98),
    new THREE.MeshStandardMaterial({ color, roughness: 0.95, transparent: true, opacity: 0.42 }),
  );
  floorZone.position.set(col + w / 2, 0.025, row + d / 2);
  floorZone.receiveShadow = true;
  group.add(floorZone);

  // 유효 적재율만큼만 칸을 채운다 (통로·작업여유는 비움). 과도한 인스턴스는 상한을 둔다
  const mat = twinBoxMat(res, spec.color || elementTypeInfo("bulk").color);
  const cells = [];
  for (let x = 0; x < Math.round(w); x++) {
    for (let z = 0; z < Math.round(d); z++) cells.push([x, z]);
  }
  const want = Math.min(cells.length, Math.round(cells.length * rate));
  const stride = want > 0 ? cells.length / want : 0;
  let placed = 0;
  const MAX = 900;
  for (let i = 0; i < want && placed < MAX; i++) {
    const [x, z] = cells[Math.min(cells.length - 1, Math.floor(i * stride))];
    for (let s = 0; s < stack; s++) {
      const y = 0.06 + s * (TWIN_LEVEL_H * 0.72);
      if (batch) twinBatchPush(batch, res.boxGeo, mat, col + x + 0.5, y, row + z + 0.5, 0);
      else {
        const b = new THREE.Mesh(res.boxGeo, mat);
        b.position.set(col + x + 0.5, y, row + z + 0.5);
        group.add(b);
      }
    }
    placed++;
  }
  return 0.06 + stack * (TWIN_LEVEL_H * 0.72);
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

function buildTwinDock(group, spec, color, batch) {
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
  const res = twinResources();
  const horiz = w >= d;
  const along = horiz ? w : d;
  const count = Math.max(1, Math.floor(along / 2));
  const doorH = 2.0;
  const doorGeo = horiz ? res.dockDoorGeoH : res.dockDoorGeoV;
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) * (along / count);
    const x = horiz ? col + t : col + 0.2;
    const z = horiz ? row + 0.2 : row + t;
    if (batch) twinBatchPush(batch, doorGeo, res.doorMat, x, doorH / 2, z);
    else {
      const door = new THREE.Mesh(doorGeo, res.doorMat);
      door.position.set(x, doorH / 2, z);
      door.castShadow = true;
      group.add(door);
    }
  }
  return doorH;
}

function buildTwinWork(group, spec, color, batch) {
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
  const res = twinResources();
  let tables = 0;
  for (let x = col + 1; x < col + w - 0.5 && tables < 60; x += 2.2) {
    for (let z = row + 0.8; z < row + d - 0.5 && tables < 60; z += 1.8) {
      if (batch) twinBatchPush(batch, res.tableGeo, res.tableMat, x, 0.3, z);
      else {
        const t = new THREE.Mesh(res.tableGeo, res.tableMat);
        t.position.set(x, 0.3, z);
        t.castShadow = true;
        group.add(t);
      }
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

// 구조 기둥 — 랙보다 높은 가는 콘크리트 기둥 (인스턴싱)
function buildTwinColumn(group, spec, color, batch) {
  const res = twinResources();
  const w = spec.w || 1;
  const d = spec.d || 1;
  const cx = spec.col + w / 2;
  const cz = spec.row + d / 2;
  const H = 6.8; // 랙(4단=5.6)·벽(6.2)보다 높게 — 구조물로 인식
  const t = Math.round(Math.min(0.85, Math.max(0.42, Math.min(w, d) * 0.6)) * 100) / 100;
  const hex = "#" + new THREE.Color(color).getHexString();
  if (!res.colMatByColor.has(hex)) {
    res.colMatByColor.set(hex, new THREE.MeshStandardMaterial({ color: new THREE.Color(hex), roughness: 0.9, metalness: 0.08 }));
  }
  const mat = res.colMatByColor.get(hex);
  const kPost = `p${t}`;
  if (!res.colGeoByKey.has(kPost)) res.colGeoByKey.set(kPost, new THREE.BoxGeometry(t, H, t));
  const kCap = `c${t}`;
  if (!res.colGeoByKey.has(kCap)) res.colGeoByKey.set(kCap, new THREE.BoxGeometry(t * 1.5, 0.22, t * 1.5));
  const postGeo = res.colGeoByKey.get(kPost);
  const capGeo = res.colGeoByKey.get(kCap);
  if (batch) {
    twinBatchPush(batch, postGeo, mat, cx, H / 2, cz);
    twinBatchPush(batch, capGeo, res.colCapMat, cx, H + 0.11, cz);
  } else {
    const post = new THREE.Mesh(postGeo, mat);
    post.position.set(cx, H / 2, cz);
    post.castShadow = true;
    group.add(post);
    const cap = new THREE.Mesh(capGeo, res.colCapMat);
    cap.position.set(cx, H + 0.11, cz);
    cap.castShadow = true;
    group.add(cap);
  }
  return H;
}

// 벽/챔버 — 얇고 높은 벽. w,d 둘 다 크면 방(4면 벽=챔버), 아니면 단일 벽선
function buildTwinWall(group, spec, color) {
  const w = spec.w || 1;
  const d = spec.d || 1;
  const H = spec.height ? spec.height * TWIN_LEVEL_H : 6.2; // 랙(4단=5.6)보다 높고 기둥(6.8)보다 낮게
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

// 전체화면 — 3D 보기/랙 배치 편집 모두 패널째 확대 (Esc로 종료)
function twinFullscreenTarget() {
  return $("#mapView")?.querySelector(".twin-panel") || null;
}
function toggleTwinFullscreen() {
  const el = twinFullscreenTarget();
  if (!el) return;
  const native = document.fullscreenElement || document.webkitFullscreenElement;
  if (native) {
    (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
    return;
  }
  if (el.classList.contains("fs")) {
    // 폴백(페이지 내 최대화) 해제
    el.classList.remove("fs");
    syncTwinFullscreenUI();
    return;
  }
  const req = el.requestFullscreen || el.webkitRequestFullscreen;
  const fallback = () => {
    el.classList.add("fs"); // 브라우저가 전체화면을 막는 환경(iframe 등) — 페이지 내 최대화
    syncTwinFullscreenUI();
  };
  if (!req) return fallback();
  try {
    const p = req.call(el);
    if (p && typeof p.catch === "function") p.catch(fallback);
  } catch {
    fallback();
  }
}
function syncTwinFullscreenUI() {
  const el = twinFullscreenTarget();
  const native = !!(document.fullscreenElement || document.webkitFullscreenElement);
  if (native) el?.classList.remove("fs"); // 네이티브 전환 시 폴백 클래스 정리
  const on = native || !!el?.classList.contains("fs");
  const btn = $("#twinFullscreen");
  if (btn) btn.textContent = on ? "⛶ 전체화면 종료" : "⛶ 전체화면";
  // 3D 캔버스는 컨테이너 크기 변경에 맞춰 재계산
  if (twinViewMode === "view") window.setTimeout(resizeTwin, 60);
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

// 사용자가 직접 편집한 층 표시 — 기본 배치 버전이 올라가도 덮어쓰지 않도록 보호
function markLayoutEdited(center, floor) {
  const layout = getRackLayout(center, floor);
  if (!layout.userEdited) layout.userEdited = true;
}

// 배치 교체 전 스냅샷 보관 (층별 1개) — '되돌리기'로 복구 가능
function backupLayout(center, floor) {
  const key = floorplanKey(center, floor);
  const cur = state.rackLayouts[key];
  if (!cur || !Array.isArray(cur.racks) || !cur.racks.length) return;
  if (!state.rackLayoutsBackup) state.rackLayoutsBackup = {};
  state.rackLayoutsBackup[key] = {
    racks: JSON.parse(JSON.stringify(cur.racks)),
    savedAt: new Date().toISOString(),
  };
}
function restoreLayoutBackup() {
  const center = twinActiveCenter();
  const floor = twinActiveFloor();
  const key = floorplanKey(center, floor);
  const b = state.rackLayoutsBackup?.[key];
  if (!b || !b.racks?.length) {
    alert("이 층에는 되돌릴 백업이 없습니다.");
    return;
  }
  const when = b.savedAt ? new Date(b.savedAt).toLocaleString("ko-KR") : "이전";
  if (!window.confirm(`${floor} 배치를 ${when} 상태(${b.racks.length}개)로 되돌릴까요?`)) return;
  const cur = state.rackLayouts[key];
  const prev = cur?.racks?.length ? JSON.parse(JSON.stringify(cur.racks)) : null;
  state.rackLayouts[key] = { racks: b.racks, userEdited: true };
  if (prev) state.rackLayoutsBackup[key] = { racks: prev, savedAt: new Date().toISOString() };
  selectedRackId = null;
  saveState();
  renderTwinCurrent();
}
// 기본 배치 다시 불러오기 — 사용자가 명시적으로 누를 때만 교체(백업 후)
function reloadDefaultLayout() {
  const center = twinActiveCenter();
  const floor = twinActiveFloor();
  const key = floorplanKey(center, floor);
  const els = DEFAULT_RACK_LAYOUTS[key];
  if (!els) {
    alert("이 층에는 내장 기본 배치가 없습니다.");
    return;
  }
  const n = state.rackLayouts[key]?.racks?.length || 0;
  if (!window.confirm(`${floor}의 현재 배치(${n}개)를 기본 배치(${els.length}개)로 교체할까요?\n현재 배치는 백업되어 '되돌리기'로 복구할 수 있습니다.`)) return;
  backupLayout(center, floor);
  state.rackLayouts[key] = { racks: els.map(materializeDefaultRack) };
  selectedRackId = null;
  saveState();
  renderTwinCurrent();
}
// 배치 백업 파일 내보내기/가져오기 — 브라우저 저장이라 기기 이동·초기화 대비
function exportLayouts() {
  const payload = {
    kind: "capa-dash-layouts",
    savedAt: new Date().toISOString(),
    rackLayouts: state.rackLayouts,
    floorplans: state.floorplans,
    centerFloors: state.centerFloors,
  };
  const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `capa_배치백업_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}
function importLayouts(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const p = JSON.parse(reader.result);
      if (p.kind !== "capa-dash-layouts" || !p.rackLayouts) throw new Error("배치 백업 파일이 아닙니다.");
      if (!window.confirm("백업 파일의 배치·도면으로 현재 내용을 교체할까요?")) return;
      state.rackLayouts = p.rackLayouts;
      if (p.floorplans) state.floorplans = p.floorplans;
      if (p.centerFloors) state.centerFloors = p.centerFloors;
      Object.values(state.rackLayouts).forEach((l) => {
        if (l) l.userEdited = true;
      });
      selectedRackId = null;
      saveState();
      renderAll();
      alert("배치를 복원했습니다.");
    } catch (err) {
      alert("복원 실패: " + err.message);
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

// 랙 보관 CAPA — 1칸(베이) × 1단 = 1 PLT
function rackSlots(el) {
  if (!el || el.type !== "rack") return 0;
  const len = Math.max(0, Math.round(number(el.len)));
  const levels = Math.max(1, Math.round(number(el.levels) || TWIN_LEVELS));
  return len * levels;
}
// 평치/벌크 적치 — 랙 없이 바닥에 쌓는 구역.
// 격자 1칸 = 파렛트 1개 자리(랙 1베이와 동일 기준)라 면적 × 단수 × 유효적재율로 환산한다.
const BULK_STACK_DEFAULT = 2; // 기본 적재 단수
const BULK_RATE_DEFAULT = 80; // 기본 유효 적재율(%) — 통로·작업여유 제외
function bulkStack(el) {
  return Math.max(1, Math.round(number(el.stack) || BULK_STACK_DEFAULT));
}
function bulkRate(el) {
  const r = el.rate == null ? BULK_RATE_DEFAULT : number(el.rate);
  return Math.max(0, Math.min(100, r));
}
function bulkSlots(el) {
  if (!el || el.type !== "bulk") return 0;
  const area = Math.max(0, Math.round(number(el.w))) * Math.max(0, Math.round(number(el.d)));
  return Math.round((area * bulkStack(el) * bulkRate(el)) / 100);
}
// 요소 1개가 제공하는 보관 CAPA (랙 + 평치)
function elementSlots(el) {
  return el?.type === "bulk" ? bulkSlots(el) : rackSlots(el);
}
// 층 단위 보관 CAPA 집계 — 랙과 평치/벌크를 함께 센다
function floorRackCapa(center, floor) {
  const all = getRackLayout(center, floor).racks || [];
  const racks = all.filter((e) => e.type === "rack");
  const bulks = all.filter((e) => e.type === "bulk");
  let slots = 0;
  let filled = 0;
  let assigned = 0;
  const byCat = emptyByCat();
  racks.forEach((e) => {
    const s = rackSlots(e);
    slots += s;
    byCat[elementCat(e)] = (byCat[elementCat(e)] || 0) + s;
    filled += Math.round(clamp01(e.fill != null ? e.fill : 0.6) * s);
    assigned += Math.max(0, Math.round(number(e.capa)));
  });
  let bulkTotal = 0;
  bulks.forEach((e) => {
    const s = bulkSlots(e);
    bulkTotal += s;
    slots += s;
    byCat[elementCat(e)] = (byCat[elementCat(e)] || 0) + s;
    filled += Math.round(clamp01(e.fill != null ? e.fill : 0.6) * s);
  });
  return { racks: racks.length, bulks: bulks.length, bulkSlots: bulkTotal, slots, filled, assigned, byCat };
}

function isAreaElement(el) {
  if (isFreeWall(el)) return false; // 자유선 벽은 사각 영역이 아니다
  return elementTypeInfo(el.type).shape === "area";
}

/* ── 사선(자유선) 벽 ────────────────────────────────────────────────────────
   벽은 두께 있는 '선'이라 격자 사각형으로는 사선을 못 그린다.
   두 점(x1,y1)-(x2,y2)를 격자 좌표(소수 허용)로 저장하고 각도는 계산해서 쓴다.
   기존 사각(col/row/w/d) 벽 데이터도 그대로 렌더된다. */
const WALL_TH_DEFAULT = 0.5; // 두께(격자칸)
function isFreeWall(el) {
  return !!el && el.type === "wall" && el.x1 != null && el.x2 != null;
}
function wallGeom(el) {
  const dx = number(el.x2) - number(el.x1);
  const dy = number(el.y2) - number(el.y1);
  return {
    cx: (number(el.x1) + number(el.x2)) / 2,
    cy: (number(el.y1) + number(el.y2)) / 2,
    len: Math.hypot(dx, dy),
    // 화면 좌표계(y 아래로 증가) 기준 각도. 3D에서는 부호를 뒤집어 쓴다.
    deg: (Math.atan2(dy, dx) * 180) / Math.PI,
    th: Math.max(0.1, number(el.th) || WALL_TH_DEFAULT),
  };
}
// 중심·각도·길이로 두 끝점을 다시 계산 (각도/길이를 폼에서 수정할 때)
function setWallFromPolar(el, cx, cy, len, deg) {
  const rad = (deg * Math.PI) / 180;
  const hx = (Math.cos(rad) * len) / 2;
  const hy = (Math.sin(rad) * len) / 2;
  el.x1 = Math.round((cx - hx) * 100) / 100;
  el.y1 = Math.round((cy - hy) * 100) / 100;
  el.x2 = Math.round((cx + hx) * 100) / 100;
  el.y2 = Math.round((cy + hy) * 100) / 100;
}
function elementColor(el) {
  if (isAreaElement(el) || isFreeWall(el)) return el.color || elementTypeInfo(el.type).color;
  return el.color || customerColor(el.customer);
}
function elementLabel(el) {
  if (isFreeWall(el)) return el.name || "";
  return isAreaElement(el) ? el.name || elementTypeInfo(el.type).label : el.customer || "랙";
}
function elementStyle(el) {
  if (isFreeWall(el)) {
    // 격자가 정사각(스테이지 aspect-ratio 216/126)이라 %좌표 그대로 회전해도 안 찌그러진다
    const g = wallGeom(el);
    return (
      `left:${(g.cx / FLOORPLAN_COLS) * 100}%;top:${(g.cy / FLOORPLAN_ROWS) * 100}%;` +
      `width:${(g.len / FLOORPLAN_COLS) * 100}%;height:${(g.th / FLOORPLAN_ROWS) * 100}%;` +
      `transform:translate(-50%,-50%) rotate(${g.deg}deg);--rc:${elementColor(el)};`
    );
  }
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
  const plan = getFloorplan(twinActiveCenter(), twinActiveFloor());
  const v = rackBgView(plan);
  img.style.transformOrigin = "center center";
  img.style.transform = `translate(${v.x}%, ${v.y}%) scale(${v.sx / 100}, ${v.sy / 100})`;
  // 도면 on/off
  if (v.off) img.style.display = "none";
  else if (plan.image) img.style.display = "block";
  const tgl = $("#bgToggle");
  if (tgl) {
    tgl.textContent = v.off ? "도면 OFF" : "도면 ON";
    tgl.classList.toggle("off", !!v.off);
  }
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
  renderGaonShipperButton();
  syncGaonModalCenter();
  refreshRackLayer();
  refreshRackList();
  renderRackForm();
}

// 재고 데이터가 언제 것인지 — gaon은 조회 시점 스냅샷이므로 시각을 함께 보여준다
function inventoryAgeText(inv) {
  if (!inv?.importedAt) return "시각 미상";
  const t = new Date(inv.importedAt);
  const min = Math.max(0, Math.round((Date.now() - t.getTime()) / 60000));
  const when = t.toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
  if (min < 1) return `방금 (${when})`;
  if (min < 60) return `${min}분 전 (${when})`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}시간 전 (${when})`;
  return `${Math.round(hr / 24)}일 전 (${when})`;
}

function renderInventoryStatus() {
  const inv = getInventory(twinActiveCenter());
  const status = $("#inventoryStatus");
  if (status) {
    if (inv) {
      const pltTxt = inv.totalPlt ? ` · ${Number(inv.totalPlt).toLocaleString("ko-KR")} PLT` : "";
      status.textContent = `연동됨 · ${inv.cellCount}셀${pltTxt} · ${inventoryAgeText(inv)}`;
      status.title = inv.fileName || "";
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

// ── gaon(WMS) 재고 직접 연동 — server/serve.py 중계 서버가 켜져 있을 때 사용
// 센터 → WMS 창고코드. 확인된 것만 채우고, 없으면 입력받아 저장한다.
const CENTER_WMS_CODE = { 남이천1센터: "0000200" };
function centerWmsCode(center) {
  return (state.centerWmsCodes && state.centerWmsCodes[center]) || CENTER_WMS_CODE[center] || "";
}
// 센터별 gaon 화주 목록 — 코드+이름을 저장해두고 개별/일괄 조회에 사용
function gaonShipperList(center) {
  if (!state.gaonShippers) state.gaonShippers = {};
  if (!Array.isArray(state.gaonShippers[center])) state.gaonShippers[center] = [];
  return state.gaonShippers[center];
}
// 체크 해제(off)된 화주는 조회에서 뺀다 — 기존 데이터엔 off가 없으므로 기본은 '포함'
function gaonSelectedShippers(center) {
  return gaonShipperList(center).filter((s) => s.code && !s.off);
}
function saveGaonShippers(center, list) {
  if (!state.gaonShippers) state.gaonShippers = {};
  state.gaonShippers[center] = list;
  saveState();
  renderGaonShipperButton();
}
// 화주 관리 버튼 라벨 갱신
function renderGaonShipperButton() {
  const btn = $("#gaonShippers");
  if (!btn) return;
  const center = twinActiveCenter();
  const all = gaonShipperList(center);
  const on = gaonSelectedShippers(center).length;
  btn.textContent = all.length ? `⚙ gaon 화주 ${on}/${all.length}` : "⚙ gaon 연동 설정";
  btn.title = all.length
    ? all.map((x) => `${x.off ? "☐" : "☑"} ${x.code} ${x.name || ""}`.trim()).join("\n")
    : "gaon 로그인 · 창고코드 · 화주 목록을 한 화면에서 관리합니다";
}

// ── gaon 연동 모달 ──────────────────────────────────────────────────────────
// prompt() 연쇄를 대체한다. 로그인·창고코드·화주 목록·조회를 한 화면에서 처리.
let gaonBusy = false;
let gaonLoggedIn = false;
const gaonRowResult = {}; // 화주코드 → {ok, text}

function gaonMsg(text, kind = "") {
  const el = $("#gaonMsg");
  if (!el) return;
  el.textContent = text || "";
  el.hidden = !text;
  el.className = "gaon-msg" + (kind ? " " + kind : "");
}

function openGaonModal(focus) {
  const modal = $("#gaonModal");
  if (!modal) return;
  const center = twinActiveCenter();
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  $("#gaonCenterName").value = center;
  $("#gaonWarehouse").value = centerWmsCode(center);
  $("#gaonId").value = state.gaonUserId || "";
  const d = $("#gaonDate");
  if (!d.value) {
    const t = new Date();
    d.value = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
  }
  $("#gaonBulkBox").hidden = true;
  gaonMsg("");
  renderGaonShipperRows();
  refreshGaonConnection();
  if (focus === "login") setTimeout(() => $("#gaonPw")?.focus(), 60);
}

// 모달이 열린 채 센터가 바뀌면 창고코드·화주 목록을 그 센터 것으로 바꿔준다
function syncGaonModalCenter() {
  const modal = $("#gaonModal");
  if (!modal || !modal.classList.contains("open")) return;
  const center = twinActiveCenter();
  if ($("#gaonCenterName").value === center) return;
  $("#gaonCenterName").value = center;
  $("#gaonWarehouse").value = centerWmsCode(center);
  Object.keys(gaonRowResult).forEach((k) => delete gaonRowResult[k]);
  $("#gaonProgress").hidden = true;
  gaonMsg("");
  renderGaonShipperRows();
}

function closeGaonModal() {
  const modal = $("#gaonModal");
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

// 중계 서버 상태 확인 — 서버가 꺼져 있으면 그 사실을 바로 알려준다
async function refreshGaonConnection() {
  const conn = $("#gaonConn");
  if (conn) {
    conn.textContent = "확인 중…";
    conn.className = "gaon-conn";
  }
  try {
    const res = await fetch("/api/gaon/status", { cache: "no-store" });
    const data = await res.json();
    gaonLoggedIn = !!data.loggedIn;
    if (conn) {
      conn.textContent = data.loggedIn ? `로그인됨 · ${data.userId || ""}` : "로그인 필요";
      conn.className = "gaon-conn " + (data.loggedIn ? "on" : "warn");
    }
    $("#gaonLoggedText").textContent = `gaon 로그인됨 · 사번 ${data.userId || state.gaonUserId || ""}`;
    $("#gaonLoginForm").hidden = data.loggedIn;
    $("#gaonLoggedRow").hidden = !data.loggedIn;
  } catch {
    gaonLoggedIn = false;
    if (conn) {
      conn.textContent = "중계 서버 연결 안 됨";
      conn.className = "gaon-conn off";
    }
    $("#gaonLoginForm").hidden = false;
    $("#gaonLoggedRow").hidden = true;
    gaonMsg("중계 서버가 꺼져 있습니다. 명령창에서 capa_dash 폴더로 이동해 `py server\\serve.py` 실행 후 http://localhost:5180 으로 접속하세요.", "err");
  }
  return gaonLoggedIn;
}

function renderGaonShipperRows() {
  const box = $("#gaonShipperList");
  if (!box) return;
  const center = twinActiveCenter();
  const list = gaonShipperList(center);
  box.innerHTML = list.length
    ? list
        .map((s, i) => {
          const r = gaonRowResult[s.code] || {};
          return `<div class="gaon-shipper-row" data-i="${i}">
            <input type="checkbox" class="gaon-pick" data-i="${i}" ${s.off ? "" : "checked"} title="조회 대상 포함" />
            <input type="text" class="gaon-code" data-i="${i}" value="${escapeAttr(s.code)}" placeholder="코드" />
            <input type="text" class="gaon-name" data-i="${i}" value="${escapeAttr(s.name || "")}" placeholder="화주명" />
            <span class="gaon-res ${r.ok === false ? "err" : r.ok ? "ok" : ""}">${escapeHtml(r.text || "")}</span>
            <button type="button" class="ghost mini gaon-del" data-i="${i}" title="삭제">✕</button>
          </div>`;
        })
        .join("")
    : `<p class="gaon-empty">등록된 화주가 없습니다. 아래에서 코드와 이름을 추가하세요.</p>`;
  const on = gaonSelectedShippers(center).length;
  $("#gaonShipperCount").textContent = list.length ? `${on}/${list.length} 선택` : "";
  renderGaonShipperButton();
}

function escapeAttr(v) {
  return String(v ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
function escapeHtml(v) {
  return String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function gaonLoginFromModal() {
  const id = ($("#gaonId").value || "").trim();
  const pw = $("#gaonPw").value || "";
  if (!id || !pw) {
    gaonMsg("사번과 비밀번호를 입력하세요.", "err");
    return false;
  }
  gaonMsg("로그인 중…");
  try {
    const res = await fetch("/api/gaon/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, pw }),
    });
    const data = await res.json().catch(() => ({ ok: false, error: `HTTP ${res.status}` }));
    if (!data.ok) throw new Error(data.error || `HTTP ${res.status}`);
    state.gaonUserId = id; // 사번만 기억 (비밀번호는 저장하지 않음)
    saveState();
    $("#gaonPw").value = "";
    await refreshGaonConnection();
    gaonMsg("로그인되었습니다.", "ok");
    return true;
  } catch (err) {
    gaonMsg("로그인 실패: " + err.message, "err");
    return false;
  }
}

// 모달의 조회 조건을 state에 반영하고 유효성만 확인한다
function gaonReadForm() {
  const center = twinActiveCenter();
  const wh = ($("#gaonWarehouse").value || "").trim();
  if (wh) {
    if (!state.centerWmsCodes) state.centerWmsCodes = {};
    state.centerWmsCodes[center] = wh;
  }
  const ymd = ($("#gaonDate").value || "").replace(/-/g, "");
  return { center, warehouse: wh, ymd, targets: gaonSelectedShippers(center) };
}

// 실제 조회 — 모달이 열려 있으면 진행률·행별 결과를, 아니면 상태 텍스트만 갱신한다
async function runGaonFetch(opts) {
  const { center, warehouse: wh, ymd, targets } = opts;
  const status = $("#inventoryStatus");
  const modalOpen = $("#gaonModal")?.classList.contains("open");
  const bar = $("#gaonBar");
  const progress = $("#gaonProgress");
  const setProgress = (i, text) => {
    if (!modalOpen || !progress) return;
    progress.hidden = false;
    bar.style.width = `${Math.round((i / targets.length) * 100)}%`;
    $("#gaonProgressText").textContent = text;
  };
  gaonBusy = true;
  $("#gaonRun")?.setAttribute("disabled", "disabled");
  Object.keys(gaonRowResult).forEach((k) => delete gaonRowResult[k]);
  try {
    const merged = { fileName: "", importedAt: new Date().toISOString(), rows: 0, cellCount: 0, totalPlt: 0, cells: {} };
    const done = [];
    const failed = [];
    for (let i = 0; i < targets.length; i++) {
      const t = targets[i];
      const label = t.name || t.code;
      setProgress(i, `조회 중… (${i + 1}/${targets.length}) ${label}`);
      if (status) status.textContent = `gaon 재고 조회 중… (${i + 1}/${targets.length}) ${label}`;
      const url = `/api/gaon/inventory?warehouse=${encodeURIComponent(wh)}&market=${encodeURIComponent(t.code)}&date=${ymd}`;
      let res, data;
      try {
        res = await fetch(url);
        data = await res.json().catch(() => ({ ok: false, error: `응답 오류 (HTTP ${res.status})` }));
      } catch (e) {
        throw new Error("중계 서버에 연결할 수 없습니다 (py server\\serve.py 실행 필요)");
      }
      // 세션이 끊겼으면 로그인 화면으로 되돌린다 (prompt 대신)
      if (!data.ok && data.needLogin) {
        await refreshGaonConnection();
        throw new Error("gaon 로그인이 필요합니다. 위에서 로그인 후 다시 실행하세요.");
      }
      if (!data.ok) {
        gaonRowResult[t.code] = { ok: false, text: data.error || `HTTP ${res.status}` };
        failed.push(label);
        renderGaonShipperRows();
        continue; // 한 화주가 실패해도 나머지는 계속 조회
      }
      // 여러 화주 결과를 셀 단위로 합침
      Object.entries(data.inventory.cells || {}).forEach(([code, v]) => {
        const c = merged.cells[code] || (merged.cells[code] = { q: 0, n: 0, plt: 0, per: v.per || 0, d: v.d, c: v.c });
        c.q += v.q;
        c.n += v.n;
        c.plt = Math.round(((c.plt || 0) + (v.plt || 0)) * 100) / 100;
        if (!c.per && v.per) c.per = v.per;
        if (!c.d && v.d) c.d = v.d;
        if (!c.c && v.c) c.c = v.c;
      });
      merged.rows += data.rowCount || 0;
      merged.totalPlt = Math.round((merged.totalPlt + (data.totalPlt || 0)) * 10) / 10;
      gaonRowResult[t.code] = {
        ok: true,
        text: `${data.cellCount || 0}셀 · ${Number(data.totalPlt || 0).toLocaleString("ko-KR")} PLT`,
      };
      renderGaonShipperRows();
      done.push(label);
    }
    if (!done.length) throw new Error(`조회된 화주가 없습니다. (실패 ${failed.length}곳)`);
    merged.cellCount = Object.keys(merged.cells).length;
    merged.fileName = `gaon ${wh} · ${done.join(", ")} · ${ymd}`;
    state.inventory[center] = merged;
    saveState();
    renderInventoryStatus();
    renderRackForm();
    renderInventoryView();
    if (twinViewMode === "view") render3DTwin();
    const summary = `${merged.cellCount}셀 · ${merged.totalPlt.toLocaleString("ko-KR")} PLT · 화주 ${done.length}곳`;
    if (status) {
      status.textContent = `gaon 연동 ${summary}`;
      status.classList.add("linked");
    }
    setProgress(targets.length, `완료 · ${summary}`);
    gaonMsg(failed.length ? `완료 (실패 ${failed.length}곳: ${failed.join(", ")}) · ${summary}` : `완료 · ${summary}`, failed.length ? "warn" : "ok");
    return true;
  } catch (err) {
    if (status) {
      status.textContent = "gaon 연동 실패: " + err.message;
      status.classList.remove("linked");
    }
    if (progress) progress.hidden = true;
    gaonMsg("실패: " + err.message, "err");
    return false;
  } finally {
    gaonBusy = false;
    $("#gaonRun")?.removeAttribute("disabled");
  }
}

// 모달의 '재고 불러오기'
async function gaonRunFromModal() {
  if (gaonBusy) return;
  const opts = gaonReadForm();
  if (!opts.warehouse) {
    gaonMsg("WMS 창고코드를 입력하세요 (예: 0000200).", "err");
    $("#gaonWarehouse").focus();
    return;
  }
  if (!opts.ymd) {
    gaonMsg("기준일자를 선택하세요.", "err");
    return;
  }
  if (!opts.targets.length) {
    gaonMsg("조회할 화주를 1곳 이상 선택하세요.", "err");
    return;
  }
  if (!(await refreshGaonConnection())) {
    gaonMsg("먼저 gaon에 로그인하세요.", "err");
    setTimeout(() => $("#gaonPw")?.focus(), 60);
    return;
  }
  await runGaonFetch(opts);
}

// 툴바의 '🔄 gaon 재고 전체 갱신' — 준비가 끝났으면 바로 실행, 아니면 설정 모달을 연다
async function fetchGaonInventory() {
  if (gaonBusy) return;
  const center = twinActiveCenter();
  const wh = centerWmsCode(center);
  const targets = gaonSelectedShippers(center);
  if (!wh || !targets.length) {
    openGaonModal();
    gaonMsg(!wh ? "이 센터의 WMS 창고코드를 먼저 입력하세요." : "조회할 화주를 먼저 등록·선택하세요.", "warn");
    return;
  }
  const status = $("#inventoryStatus");
  if (status) status.textContent = "gaon 연결 확인 중…";
  let loggedIn = false;
  try {
    const res = await fetch("/api/gaon/status", { cache: "no-store" });
    loggedIn = !!(await res.json()).loggedIn;
  } catch {
    loggedIn = false;
    if (status) status.textContent = "중계 서버가 꺼져 있습니다";
    openGaonModal();
    return;
  }
  if (!loggedIn) {
    openGaonModal("login");
    gaonMsg("gaon 로그인이 필요합니다.", "warn");
    return;
  }
  const t = new Date();
  const ymd = `${t.getFullYear()}${String(t.getMonth() + 1).padStart(2, "0")}${String(t.getDate()).padStart(2, "0")}`;
  await runGaonFetch({ center, warehouse: wh, ymd, targets });
}

// 모달 이벤트 — 목록은 이벤트 위임으로 처리한다
function bindGaonModal() {
  if (!$("#gaonModal")) return;
  $("#gaonShippers")?.addEventListener("click", () => openGaonModal());
  $("#gaonClose").addEventListener("click", closeGaonModal);
  $("#gaonBackdrop").addEventListener("click", closeGaonModal);
  $("#gaonRun").addEventListener("click", gaonRunFromModal);
  $("#gaonLoginBtn").addEventListener("click", gaonLoginFromModal);
  $("#gaonPw").addEventListener("keydown", (e) => {
    if (e.key === "Enter") gaonLoginFromModal();
  });
  $("#gaonLogoutBtn").addEventListener("click", async () => {
    await fetch("/api/gaon/logout").catch(() => {});
    await refreshGaonConnection();
    gaonMsg("로그아웃했습니다.");
  });
  $("#gaonWarehouse").addEventListener("change", () => gaonReadForm());

  const center = () => twinActiveCenter();
  const addShipper = (code, name) => {
    const list = gaonShipperList(center()).slice();
    const hit = list.find((s) => s.code === code);
    if (hit) hit.name = name || hit.name;
    else list.push({ code, name });
    saveGaonShippers(center(), list);
  };

  $("#gaonAddShipper").addEventListener("click", () => {
    const code = ($("#gaonNewCode").value || "").trim();
    const name = ($("#gaonNewName").value || "").trim();
    if (!code) {
      gaonMsg("화주코드를 입력하세요.", "err");
      return;
    }
    addShipper(code, name);
    $("#gaonNewCode").value = "";
    $("#gaonNewName").value = "";
    renderGaonShipperRows();
    gaonMsg("");
    $("#gaonNewCode").focus();
  });
  $("#gaonNewName").addEventListener("keydown", (e) => {
    if (e.key === "Enter") $("#gaonAddShipper").click();
  });
  $("#gaonNewCode").addEventListener("keydown", (e) => {
    if (e.key === "Enter") $("#gaonNewName").focus();
  });

  $("#gaonSelectAll").addEventListener("click", () => {
    saveGaonShippers(center(), gaonShipperList(center()).map((s) => ({ ...s, off: false })));
    renderGaonShipperRows();
  });
  $("#gaonSelectNone").addEventListener("click", () => {
    saveGaonShippers(center(), gaonShipperList(center()).map((s) => ({ ...s, off: true })));
    renderGaonShipperRows();
  });

  $("#gaonBulk").addEventListener("click", () => {
    const box = $("#gaonBulkBox");
    box.hidden = !box.hidden;
    if (!box.hidden) $("#gaonBulkText").focus();
  });
  $("#gaonBulkCancel").addEventListener("click", () => {
    $("#gaonBulkBox").hidden = true;
  });
  $("#gaonBulkApply").addEventListener("click", () => {
    const raw = $("#gaonBulkText").value || "";
    const rows = raw
      .split(/[\n;]+/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const [code, ...rest] = l.split(/[,\t]/);
        return { code: (code || "").trim(), name: rest.join(",").trim() };
      })
      .filter((s) => s.code);
    if (!rows.length) {
      gaonMsg("추가할 화주를 찾지 못했습니다. `코드,화주명` 형식으로 입력하세요.", "err");
      return;
    }
    const list = gaonShipperList(center()).slice();
    rows.forEach((r) => {
      const hit = list.find((s) => s.code === r.code);
      if (hit) hit.name = r.name || hit.name;
      else list.push(r);
    });
    saveGaonShippers(center(), list);
    $("#gaonBulkText").value = "";
    $("#gaonBulkBox").hidden = true;
    renderGaonShipperRows();
    gaonMsg(`${rows.length}곳을 반영했습니다.`, "ok");
  });

  const list = $("#gaonShipperList");
  list.addEventListener("change", (e) => {
    const i = Number(e.target.dataset.i);
    if (Number.isNaN(i)) return;
    const next = gaonShipperList(center()).slice();
    if (!next[i]) return;
    if (e.target.classList.contains("gaon-pick")) next[i].off = !e.target.checked;
    else if (e.target.classList.contains("gaon-code")) next[i].code = e.target.value.trim();
    else if (e.target.classList.contains("gaon-name")) next[i].name = e.target.value.trim();
    saveGaonShippers(center(), next);
    $("#gaonShipperCount").textContent = `${gaonSelectedShippers(center()).length}/${next.length} 선택`;
  });
  list.addEventListener("click", (e) => {
    const del = e.target.closest(".gaon-del");
    if (!del) return;
    const i = Number(del.dataset.i);
    const next = gaonShipperList(center()).slice();
    next.splice(i, 1);
    saveGaonShippers(center(), next);
    renderGaonShipperRows();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && $("#gaonModal").classList.contains("open")) closeGaonModal();
  });
}

/* =========================================================
   재고 관리 뷰 (inventory 탭) — gaon 셀 재고 ↔ 도면 랙 맵핑 점검
   ========================================================= */
let invCenter = "";
let invTab = "cells";
let invSort = { key: "code", dir: 1 };
let invLimit = 300;
let invLastData = null;

function invActiveCenter() {
  if (!invCenter || !state.centers.includes(invCenter)) invCenter = twinActiveCenter();
  return invCenter;
}
function invRackLabel(el) {
  return el.name || el.customer || (el.cellPrefix ? `랙 ${el.cellPrefix}` : "이름없는 랙");
}
// "02-01-05-30" → {zone:"02", aisle:"01", bay:5, level:3, prefix:"02-01"}
function parseCellCode(code) {
  const p = String(code).split("-");
  if (p.length < 4) return null;
  const lv = Number(p[3]);
  return {
    zone: p[0],
    aisle: p[1],
    bay: Number(p[2]) || 0,
    level: lv >= 10 ? Math.round(lv / 10) : lv || 0,
    prefix: `${p[0]}-${p[1]}`,
  };
}
// 센터의 모든 층 랙(선형 요소)을 한 배열로 — 맵핑 판정은 층을 통틀어 한다
function centerRackElements(center) {
  const out = [];
  getCenterFloors(center).forEach((floor) => {
    getRackLayout(center, floor).racks.forEach((el) => {
      if (!isAreaElement(el) && !isFreeWall(el)) out.push({ floor, el });
    });
  });
  return out;
}
// 평치/벌크 구역 — 셀코드 맵핑 대상은 아니고 CAPA·점유 집계에만 쓴다
function centerBulkElements(center) {
  const out = [];
  getCenterFloors(center).forEach((floor) => {
    getRackLayout(center, floor).racks.forEach((el) => {
      if (el.type === "bulk") out.push({ floor, el });
    });
  });
  return out;
}

// 재고 ↔ 랙 대조 결과. 셀/접두/랙 세 관점 + KPI·이슈 카운트
function analyzeInventory(center) {
  const inv = getInventory(center);
  const rackList = centerRackElements(center);
  const byPrefix = new Map(); // 접두 → [{floor, el}]
  rackList.forEach((r) => {
    const p = (r.el.cellPrefix || "").trim();
    if (!p) return;
    if (!byPrefix.has(p)) byPrefix.set(p, []);
    byPrefix.get(p).push(r);
  });

  const cells = [];
  Object.entries(inv?.cells || {}).forEach(([code, v]) => {
    const parsed = parseCellCode(code) || { zone: "", aisle: "", bay: 0, level: 0, prefix: code };
    const hits = byPrefix.get(parsed.prefix) || [];
    // 베이·단이 랙 정의 안에 들어오는 것을 우선 채택. 접두는 맞는데 벗어나면 '범위 초과'
    const fit = hits.find(
      (h) => parsed.bay >= 1 && parsed.bay <= number(h.el.len) && parsed.level >= 1 && parsed.level <= (number(h.el.levels) || TWIN_LEVELS),
    );
    const ref = fit || hits[0] || null;
    cells.push({
      code,
      ...parsed,
      q: number(v.q),
      plt: number(v.plt),
      per: number(v.per),
      d: v.d || "",
      c: v.c || "미지정",
      status: fit ? "mapped" : hits.length ? "overflow" : "unmapped",
      floor: ref ? ref.floor : "",
      rackId: ref ? ref.el.id : "",
      rackLabel: ref ? invRackLabel(ref.el) : "",
      capacity: ref ? `${number(ref.el.len)}베이 × ${number(ref.el.levels) || TWIN_LEVELS}단` : "",
    });
  });

  // 접두(랙열) 단위 집계
  const prefMap = new Map();
  cells.forEach((c) => {
    const p = prefMap.get(c.prefix) || {
      prefix: c.prefix, cells: 0, qty: 0, plt: 0, customers: new Set(),
      racks: byPrefix.get(c.prefix) || [], mapped: 0, overflow: 0,
    };
    p.cells += 1;
    p.qty += c.q;
    p.plt += c.plt;
    p.customers.add(c.c);
    if (c.status === "mapped") p.mapped += 1;
    if (c.status === "overflow") p.overflow += 1;
    prefMap.set(c.prefix, p);
  });
  const prefixes = Array.from(prefMap.values()).map((p) => ({
    ...p,
    plt: Math.round(p.plt * 10) / 10,
    customerList: Array.from(p.customers).sort(),
    status: !p.racks.length ? "unmapped" : p.overflow ? "overflow" : "mapped",
    rackText: p.racks.map((r) => `${r.floor} ${invRackLabel(r.el)}`).join(", "),
  }));

  // 랙 단위 집계 (접두 미지정·빈 랙도 포함)
  const racks = rackList.map(({ floor, el }) => {
    const len = number(el.len);
    const levels = number(el.levels) || TWIN_LEVELS;
    const slots = Math.max(0, len * levels);
    const occ = el.cellPrefix ? occupiedForRack(inv, el) : { count: 0, qty: 0, plt: 0 };
    const custs = new Set();
    if (el.cellPrefix) cells.forEach((c) => c.rackId === el.id && c.status === "mapped" && custs.add(c.c));
    return {
      floor, id: el.id, label: invRackLabel(el), prefix: el.cellPrefix || "",
      len, levels, slots, used: occ.count, qty: occ.qty, plt: Math.round(occ.plt * 10) / 10,
      rate: slots ? Math.round((occ.count / slots) * 1000) / 10 : 0,
      customerList: Array.from(custs).sort(),
      status: !el.cellPrefix ? "noprefix" : occ.count ? "mapped" : "empty",
      dupe: el.cellPrefix ? (byPrefix.get(el.cellPrefix) || []).length > 1 : false,
    };
  });

  // 평치/벌크 구역도 '랙별 점유' 목록에 함께 보여준다.
  // 미전산재고의 '위치'가 구역명(또는 화주)과 맞으면 그만큼 점유로 잡는다.
  const off = offbookList(center);
  centerBulkElements(center).forEach(({ floor, el }) => {
    const slots = bulkSlots(el);
    const label = el.name || (el.customer ? `평치 · ${el.customer}` : "평치/벌크");
    const matched = off.filter(
      (o) => o.floor === floor && ((o.area && (o.area === el.name || o.area === el.customer)) || (!o.area && el.customer && o.customer === el.customer)),
    );
    const plt = Math.round(matched.reduce((a, o) => a + number(o.plt), 0) * 10) / 10;
    racks.push({
      floor, id: el.id, label, prefix: "", bulk: true,
      len: number(el.w), levels: bulkStack(el), slots,
      used: Math.min(slots, Math.round(plt)), qty: 0, plt,
      rate: slots ? Math.round((Math.min(slots, plt) / slots) * 1000) / 10 : 0,
      customerList: Array.from(new Set(matched.map((o) => o.customer).concat(el.customer ? [el.customer] : []))).filter(Boolean).sort(),
      status: plt ? "mapped" : "empty",
      dupe: false,
    });
  });

  const sum = (arr, f) => arr.reduce((a, x) => a + f(x), 0);
  const unmappedCells = cells.filter((c) => c.status === "unmapped");
  const overflowCells = cells.filter((c) => c.status === "overflow");
  const mappedCells = cells.filter((c) => c.status === "mapped");
  const kpi = {
    total: cells.length,
    mapped: mappedCells.length,
    unmapped: unmappedCells.length,
    overflow: overflowCells.length,
    totalPlt: Math.round(sum(cells, (c) => c.plt) * 10) / 10,
    unmappedPlt: Math.round(sum(unmappedCells.concat(overflowCells), (c) => c.plt) * 10) / 10,
    totalQty: sum(cells, (c) => c.q),
    slots: sum(racks, (r) => r.slots),
    usedSlots: sum(racks, (r) => r.used),
    customers: new Set(cells.map((c) => c.c)).size,
  };
  kpi.rate = kpi.slots ? Math.round((kpi.usedSlots / kpi.slots) * 1000) / 10 : 0;
  kpi.mapRate = kpi.total ? Math.round((kpi.mapped / kpi.total) * 1000) / 10 : 0;
  const offbook = offbookList(center);
  kpi.offbookPlt = Math.round(offbookPlt(center) * 10) / 10;
  kpi.offbookCount = offbook.length;

  const issues = {
    unmapped: unmappedCells.length,
    unmappedPrefixes: prefixes.filter((p) => p.status === "unmapped").length,
    overflow: overflowCells.length,
    noprefix: racks.filter((r) => r.status === "noprefix").length,
    empty: racks.filter((r) => r.status === "empty" && !r.bulk).length,
    dupe: new Set(racks.filter((r) => r.dupe).map((r) => r.prefix)).size,
  };
  return { inv, cells, prefixes, racks, offbook, kpi, issues };
}

const INV_STATUS_TEXT = {
  mapped: "맵핑됨", unmapped: "미맵핑", overflow: "범위 초과",
  noprefix: "접두 미지정", empty: "빈 랙",
};
function invBadge(status, extra) {
  return `<span class="inv-badge ${status}">${INV_STATUS_TEXT[status] || status}${extra ? ` · ${extra}` : ""}</span>`;
}
function invNum(n) {
  return Number(n || 0).toLocaleString("ko-KR");
}

// 현재 탭·필터를 통과한 행 (CSV 내보내기와 표가 같은 데이터를 쓴다)
function invFilteredRows(data) {
  const q = ($("#invSearch")?.value || "").trim().toLowerCase();
  const st = $("#invStatusFilter")?.value || "all";
  const cu = $("#invCustomerFilter")?.value || "";
  const fl = $("#invFloorFilter")?.value || "";
  let rows =
    invTab === "cells"
      ? data.cells
      : invTab === "prefixes"
        ? data.prefixes
        : invTab === "offbook"
          ? data.offbook
          : data.racks;
  rows = rows.filter((r) => {
    if (invTab === "offbook") {
      // 미전산은 맵핑 상태 개념이 없어 층·화주·검색만 적용
      if (cu && r.customer !== cu) return false;
      if (fl && r.floor !== fl) return false;
      if (q && !`${r.customer} ${r.area} ${r.reason} ${r.floor}`.toLowerCase().includes(q)) return false;
      return true;
    }
    if (st !== "all") {
      if (invTab === "racks") {
        if (st === "mapped" && r.status !== "mapped") return false;
        if (st === "unmapped" && r.status !== "noprefix") return false;
        if (st === "overflow" && r.status !== "empty") return false;
      } else if (r.status !== st) return false;
    }
    if (cu) {
      const list = invTab === "cells" ? [r.c] : r.customerList || [];
      if (!list.includes(cu)) return false;
    }
    if (fl) {
      const f = invTab === "prefixes" ? (r.racks || []).map((x) => x.floor) : [r.floor];
      if (!f.includes(fl)) return false;
    }
    if (q) {
      const hay =
        invTab === "cells"
          ? `${r.code} ${r.c} ${r.d} ${r.rackLabel}`
          : invTab === "prefixes"
            ? `${r.prefix} ${r.customerList.join(" ")} ${r.rackText}`
            : `${r.label} ${r.prefix} ${r.floor} ${r.customerList.join(" ")}`;
      if (!hay.toLowerCase().includes(q)) return false;
    }
    return true;
  });
  const k = invSort.key;
  rows = rows.slice().sort((a, b) => {
    const x = a[k], y = b[k];
    if (typeof x === "number" && typeof y === "number") return (x - y) * invSort.dir;
    return String(x ?? "").localeCompare(String(y ?? ""), "ko") * invSort.dir;
  });
  return rows;
}

const INV_COLUMNS = {
  cells: [
    { key: "code", label: "셀코드" },
    { key: "bay", label: "베이", num: true },
    { key: "level", label: "단", num: true },
    { key: "c", label: "화주" },
    { key: "d", label: "품목" },
    { key: "q", label: "수량", num: true },
    { key: "plt", label: "PLT", num: true },
    { key: "floor", label: "층" },
    { key: "rackLabel", label: "랙" },
    { key: "status", label: "맵핑" },
  ],
  prefixes: [
    { key: "prefix", label: "랙열(접두)" },
    { key: "cells", label: "셀", num: true },
    { key: "qty", label: "수량", num: true },
    { key: "plt", label: "PLT", num: true },
    { key: "customerList", label: "화주" },
    { key: "rackText", label: "연결된 랙" },
    { key: "status", label: "맵핑" },
    { key: "assign", label: "랙 배정", noSort: true },
  ],
  offbook: [
    { key: "floor", label: "층" },
    { key: "cat", label: "분류" },
    { key: "customer", label: "화주" },
    { key: "plt", label: "PLT", num: true },
    { key: "area", label: "위치" },
    { key: "reason", label: "사유" },
    { key: "createdAt", label: "등록일" },
    { key: "del", label: "", noSort: true },
  ],
  racks: [
    { key: "floor", label: "층" },
    { key: "label", label: "랙" },
    { key: "prefix", label: "접두" },
    { key: "slots", label: "슬롯", num: true },
    { key: "used", label: "점유", num: true },
    { key: "rate", label: "점유율", num: true },
    { key: "plt", label: "PLT", num: true },
    { key: "customerList", label: "화주" },
    { key: "status", label: "상태" },
  ],
};

function renderInventoryView() {
  // 탭이 열려 있을 때만 계산·렌더 (랙 수백 개 × 셀 수천 개를 매 렌더마다 훑지 않도록)
  if (!$("#invBody") || !$("#inventory")?.classList.contains("active")) return;
  const center = invActiveCenter();
  const sel = $("#invCenterSelect");
  sel.innerHTML = state.centers
    .map((c) => `<option value="${c}" ${c === center ? "selected" : ""}>${c}</option>`)
    .join("");

  const data = analyzeInventory(center);
  invLastData = data;

  const snap = $("#invSnapshot");
  if (data.inv) {
    snap.textContent = `${data.inv.fileName || "재고"} · ${inventoryAgeText(data.inv)}`;
    snap.classList.add("linked");
  } else {
    snap.textContent = "재고 미연동";
    snap.classList.remove("linked");
  }

  const k = data.kpi;
  $("#invKpis").innerHTML = [
    { label: "재고 셀", value: invNum(k.total), sub: `화주 ${k.customers}곳` },
    { label: "맵핑됨", value: invNum(k.mapped), sub: `${k.mapRate}%`, tone: k.mapped ? "ok" : "" },
    { label: "미맵핑", value: invNum(k.unmapped + k.overflow), sub: `${invNum(k.unmappedPlt)} PLT`, tone: k.unmapped + k.overflow ? "bad" : "" },
    { label: "총 재고", value: invNum(k.totalPlt), sub: "PLT (gaon)" },
    { label: "미전산재고", value: invNum(k.offbookPlt), sub: `PLT · ${k.offbookCount}건`, tone: k.offbookPlt ? "warn" : "" },
    { label: "랙 슬롯 점유", value: `${k.rate}%`, sub: `${invNum(k.usedSlots)} / ${invNum(k.slots)}칸` },
  ]
    .map(
      (c) =>
        `<div class="inv-kpi ${c.tone || ""}"><span>${c.label}</span><strong>${c.value}</strong><em>${c.sub}</em></div>`,
    )
    .join("");

  const iss = data.issues;
  const chips = [
    { n: iss.unmapped, text: `랙에 연결 안 된 셀 ${invNum(iss.unmapped)}개`, tab: "cells", status: "unmapped", tone: "bad" },
    { n: iss.unmappedPrefixes, text: `배정 안 된 랙열 ${iss.unmappedPrefixes}개`, tab: "prefixes", status: "unmapped", tone: "bad" },
    { n: iss.overflow, text: `랙 범위를 벗어난 셀 ${invNum(iss.overflow)}개`, tab: "cells", status: "overflow", tone: "warn" },
    { n: iss.noprefix, text: `접두 미지정 랙 ${iss.noprefix}개`, tab: "racks", status: "unmapped", tone: "warn" },
    { n: iss.empty, text: `재고 없는 랙 ${iss.empty}개`, tab: "racks", status: "overflow", tone: "" },
    { n: iss.dupe, text: `접두가 겹치는 랙열 ${iss.dupe}개`, tab: "racks", status: "all", tone: "warn" },
  ].filter((c) => c.n && data.inv); // 재고를 아직 안 불러왔으면 진단 대신 안내만 보여준다
  $("#invIssues").innerHTML = chips.length
    ? chips
        .map(
          (c) =>
            `<button type="button" class="inv-issue ${c.tone}" data-issue-tab="${c.tab}" data-issue-status="${c.status}">${c.text}</button>`,
        )
        .join("")
    : data.inv
      ? `<p class="inv-clean">✔ 모든 재고 셀이 도면 랙에 연결돼 있습니다.</p>`
      : `<p class="inv-clean">gaon 재고를 먼저 불러오세요. 3D 점유도 탭의 <strong>⚙ gaon 연동 설정</strong>에서 조회할 수 있습니다.</p>`;

  // 필터 옵션 (선택값 유지)
  const cuSel = $("#invCustomerFilter");
  const cuVal = cuSel.value;
  const customers = Array.from(new Set(data.cells.map((c) => c.c))).sort((a, b) => a.localeCompare(b, "ko"));
  cuSel.innerHTML = `<option value="">전체</option>` + customers.map((c) => `<option value="${escapeAttr(c)}">${escapeHtml(c)}</option>`).join("");
  cuSel.value = customers.includes(cuVal) ? cuVal : "";
  const flSel = $("#invFloorFilter");
  const flVal = flSel.value;
  const floors = getCenterFloors(center);
  flSel.innerHTML = `<option value="">전체</option>` + floors.map((f) => `<option value="${escapeAttr(f)}">${escapeHtml(f)}</option>`).join("");
  flSel.value = floors.includes(flVal) ? flVal : "";

  document.querySelectorAll(".inv-tab").forEach((b) => b.classList.toggle("active", b.dataset.invTab === invTab));
  // 미전산재고 탭에서만 입력줄 노출 + 상태 필터 비활성
  const isOb = invTab === "offbook";
  $("#invOffbookAdd").hidden = !isOb;
  $("#invStatusFilter").disabled = isOb;
  if (isOb) {
    const ob = $("#obFloor");
    const keep = ob.value;
    ob.innerHTML = floors.map((f) => `<option value="${escapeAttr(f)}">${escapeHtml(f)}</option>`).join("");
    ob.value = floors.includes(keep) ? keep : floors[0];
    const oc = $("#obCat");
    const keepCat = oc.value;
    oc.innerHTML = storageCats().map((c) => `<option value="${escapeAttr(c)}">${escapeHtml(c)}</option>`).join("");
    oc.value = storageCats().includes(keepCat) ? keepCat : storageCats()[0];
  }
  renderInventoryTable(data);
}

function renderInventoryTable(data) {
  const cols = INV_COLUMNS[invTab];
  $("#invHead").innerHTML = `<tr>${cols
    .map(
      (c) =>
        `<th class="${c.num ? "num" : ""} ${c.noSort ? "" : "sortable"} ${invSort.key === c.key ? "sorted" : ""}" ${c.noSort ? "" : `data-sort="${c.key}"`}>${c.label}${invSort.key === c.key ? (invSort.dir > 0 ? " ▲" : " ▼") : ""}</th>`,
    )
    .join("")}</tr>`;

  const rows = invFilteredRows(data);
  const shown = rows.slice(0, invLimit);
  $("#invResultCount").textContent = rows.length
    ? `${invNum(rows.length)}건${rows.length > shown.length ? ` (${invNum(shown.length)}건 표시)` : ""}`
    : "결과 없음";
  $("#invMore").hidden = rows.length <= shown.length;

  // 접두 배정 셀렉트에 쓸 랙 목록 — 접두가 비어 있는 랙을 우선 노출
  const rackOptions = data.racks
    .slice()
    .sort((a, b) => (a.prefix ? 1 : 0) - (b.prefix ? 1 : 0) || String(a.floor).localeCompare(String(b.floor), "ko"))
    .map(
      (r) =>
        `<option value="${escapeAttr(r.id)}">${escapeHtml(r.floor)} · ${escapeHtml(r.label)} (${r.len}×${r.levels}${r.prefix ? ` · ${escapeHtml(r.prefix)}` : ""})</option>`,
    )
    .join("");

  $("#invBody").innerHTML = shown
    .map((r) => {
      if (invTab === "cells") {
        return `<tr class="${r.status}" data-rack-id="${escapeAttr(r.rackId)}" data-floor="${escapeAttr(r.floor)}">
          <td class="mono">${escapeHtml(r.code)}</td>
          <td class="num">${r.bay || ""}</td>
          <td class="num">${r.level || ""}</td>
          <td>${escapeHtml(r.c)}</td>
          <td class="dim">${escapeHtml(r.d)}</td>
          <td class="num">${invNum(r.q)}</td>
          <td class="num">${r.plt ? r.plt.toFixed(2) : ""}</td>
          <td>${escapeHtml(r.floor)}</td>
          <td>${escapeHtml(r.rackLabel)}${r.capacity ? `<em class="dim"> ${r.capacity}</em>` : ""}</td>
          <td>${invBadge(r.status)}</td>
        </tr>`;
      }
      if (invTab === "offbook") {
        return `<tr class="offbook-row">
          <td>${escapeHtml(r.floor)}</td>
          <td>${escapeHtml(elementCat(r))}</td>
          <td>${escapeHtml(r.customer)}</td>
          <td class="num">${invNum(r.plt)}</td>
          <td>${escapeHtml(r.area)}</td>
          <td class="dim">${escapeHtml(r.reason)}</td>
          <td class="dim">${escapeHtml((r.createdAt || "").slice(0, 10))}</td>
          <td><button type="button" class="ghost mini ob-del" data-ob-id="${escapeAttr(r.id)}" title="삭제">✕</button></td>
        </tr>`;
      }
      if (invTab === "prefixes") {
        return `<tr class="${r.status}">
          <td class="mono">${escapeHtml(r.prefix)}</td>
          <td class="num">${invNum(r.cells)}</td>
          <td class="num">${invNum(r.qty)}</td>
          <td class="num">${r.plt}</td>
          <td class="dim">${escapeHtml(r.customerList.join(", "))}</td>
          <td>${escapeHtml(r.rackText) || "<em class='dim'>없음</em>"}</td>
          <td>${invBadge(r.status, r.overflow ? `${r.overflow}셀 초과` : "")}</td>
          <td><select class="inv-assign" data-prefix="${escapeAttr(r.prefix)}"><option value="">랙 선택…</option>${rackOptions}</select></td>
        </tr>`;
      }
      return `<tr class="${r.status}" data-rack-id="${escapeAttr(r.id)}" data-floor="${escapeAttr(r.floor)}">
        <td>${escapeHtml(r.floor)}</td>
        <td>${escapeHtml(r.label)}</td>
        <td>${r.bulk ? `<span class="inv-badge">평치</span>` : `<input class="inv-prefix-input mono" data-rack-id="${escapeAttr(r.id)}" data-floor="${escapeAttr(r.floor)}" value="${escapeAttr(r.prefix)}" list="invPrefixList" placeholder="예: 02-01" />`}</td>
        <td class="num">${invNum(r.slots)}<em class="dim"> ${r.len}×${r.levels}${r.bulk ? "단" : ""}</em></td>
        <td class="num">${invNum(r.used)}</td>
        <td class="num"><span class="inv-rate"><i style="width:${Math.min(100, r.rate)}%"></i></span>${r.rate}%</td>
        <td class="num">${r.plt}</td>
        <td class="dim">${escapeHtml(r.customerList.join(", "))}</td>
        <td>${invBadge(r.status)}${r.dupe ? `<span class="inv-badge overflow">접두 중복</span>` : ""}</td>
      </tr>`;
    })
    .join("");

  let dl = $("#invPrefixList");
  if (!dl) {
    dl = document.createElement("datalist");
    dl.id = "invPrefixList";
    document.body.appendChild(dl);
  }
  dl.innerHTML = data.prefixes.map((p) => `<option value="${escapeAttr(p.prefix)}"></option>`).join("");
}

// 접두를 랙에 배정 — 랙의 cellPrefix를 채우고 3D·재고 표시를 함께 갱신
function invAssignPrefix(rackId, prefix) {
  const center = invActiveCenter();
  for (const floor of getCenterFloors(center)) {
    const layout = getRackLayout(center, floor);
    const el = layout.racks.find((r) => r.id === rackId);
    if (!el) continue;
    el.cellPrefix = prefix;
    markLayoutEdited(center, floor);
    saveState();
    renderInventoryView();
    if (center === twinActiveCenter()) {
      renderRackForm();
      if (twinViewMode === "view") render3DTwin();
    }
    return true;
  }
  return false;
}

function invExportCsv() {
  const data = invLastData || analyzeInventory(invActiveCenter());
  const rows = invFilteredRows(data);
  const cols = INV_COLUMNS[invTab].filter((c) => c.key !== "assign" && c.key !== "del");
  const cell = (r, c) => {
    const v = r[c.key];
    if (c.key === "status") return INV_STATUS_TEXT[v] || v;
    return Array.isArray(v) ? v.join(" / ") : v ?? "";
  };
  const csv = [cols.map((c) => c.label).join(",")]
    .concat(rows.map((r) => cols.map((c) => `"${String(cell(r, c)).replace(/"/g, '""')}"`).join(",")))
    .join("\r\n");
  const tabName = { cells: "셀목록", prefixes: "랙열맵핑", racks: "랙점유", offbook: "미전산재고" }[invTab];
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `재고관리_${invActiveCenter()}_${tabName}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function bindInventoryView() {
  if (!$("#invBody")) return;
  $("#invCenterSelect").addEventListener("change", (e) => {
    invCenter = e.target.value;
    invLimit = 300;
    renderInventoryView();
  });
  $("#invRefresh").addEventListener("click", () => {
    twinCenter = invActiveCenter();
    openGaonModal();
  });
  $("#invExport").addEventListener("click", invExportCsv);
  document.querySelectorAll(".inv-tab").forEach((b) =>
    b.addEventListener("click", () => {
      invTab = b.dataset.invTab;
      invSort = { key: INV_COLUMNS[invTab][0].key, dir: 1 };
      invLimit = 300;
      renderInventoryView();
    }),
  );
  ["#invSearch", "#invStatusFilter", "#invCustomerFilter", "#invFloorFilter"].forEach((sel) =>
    $(sel).addEventListener("input", () => {
      invLimit = 300;
      renderInventoryTable(invLastData || analyzeInventory(invActiveCenter()));
    }),
  );
  $("#invMore").addEventListener("click", () => {
    invLimit += 500;
    renderInventoryTable(invLastData || analyzeInventory(invActiveCenter()));
  });
  $("#invIssues").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-issue-tab]");
    if (!btn) return;
    invTab = btn.dataset.issueTab;
    invSort = { key: INV_COLUMNS[invTab][0].key, dir: 1 };
    $("#invStatusFilter").value = btn.dataset.issueStatus;
    invLimit = 300;
    renderInventoryView();
  });
  $("#invHead").addEventListener("click", (e) => {
    const th = e.target.closest("[data-sort]");
    if (!th) return;
    const key = th.dataset.sort;
    invSort = { key, dir: invSort.key === key ? -invSort.dir : 1 };
    renderInventoryTable(invLastData || analyzeInventory(invActiveCenter()));
  });
  // 미전산재고 등록 — 실물은 있는데 gaon에 안 올라간 재고
  $("#obAdd")?.addEventListener("click", () => {
    const center = invActiveCenter();
    const customer = ($("#obCustomer").value || "").trim();
    const plt = Number($("#obPlt").value) || 0;
    if (!customer || plt <= 0) {
      alert("화주와 수량(PLT)을 입력하세요.");
      return;
    }
    offbookList(center).push({
      id: "ob-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      floor: $("#obFloor").value,
      cat: $("#obCat").value,
      customer,
      plt,
      area: ($("#obArea").value || "").trim(),
      reason: ($("#obReason").value || "").trim(),
      createdAt: new Date().toISOString(),
    });
    saveState();
    ["#obCustomer", "#obPlt", "#obArea", "#obReason"].forEach((s) => ($(s).value = ""));
    renderAll();
    $("#obCustomer").focus();
  });

  const body = $("#invBody");
  body.addEventListener("click", (e) => {
    const del = e.target.closest(".ob-del");
    if (!del) return;
    e.stopPropagation();
    const center = invActiveCenter();
    state.offbook[center] = offbookList(center).filter((r) => r.id !== del.dataset.obId);
    saveState();
    renderAll();
  });
  body.addEventListener("change", (e) => {
    if (e.target.classList.contains("inv-assign")) {
      const prefix = e.target.dataset.prefix;
      if (e.target.value) invAssignPrefix(e.target.value, prefix);
      return;
    }
    if (e.target.classList.contains("inv-prefix-input")) {
      invAssignPrefix(e.target.dataset.rackId, e.target.value.trim());
    }
  });
  // 셀·랙 행을 누르면 해당 층의 3D 점유도로 이동해 그 랙을 선택한다
  body.addEventListener("click", (e) => {
    if (e.target.closest("select, input")) return;
    const tr = e.target.closest("tr[data-rack-id]");
    if (!tr || !tr.dataset.rackId) return;
    twinCenter = invActiveCenter();
    twinFloor = tr.dataset.floor || twinFloor;
    document.querySelector('[data-view="mapView"]')?.click();
    setTimeout(() => selectRack(tr.dataset.rackId), 60);
  });
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
    renderInventoryView();
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
        `<div class="rack-item ${isAreaElement(r) ? "area" : ""} ${isFreeWall(r) ? "wall-free" : ""} ${r.id === selectedRackId ? "selected" : ""}" data-rack-id="${r.id}" style="${elementStyle(r)}"><span>${elementLabel(r)}</span></div>`,
    )
    .join("");
  // 이벤트 위임 — 요소가 수백 개여도 리스너는 레이어 1개만 (재렌더 비용 절감)
  if (!layer.dataset.bound) {
    layer.dataset.bound = "1";
    layer.addEventListener("click", (e) => {
      const item = e.target.closest(".rack-item");
      if (!item) return;
      e.stopPropagation();
      selectRack(item.dataset.rackId);
    });
    layer.addEventListener("pointerdown", (e) => {
      const item = e.target.closest(".rack-item");
      if (!item) return;
      startElementMove(e, item.dataset.rackId);
    });
  }
}

// 배치된 요소를 드래그로 이동 (격자 단위 스냅)
let elementMove = null;
function startElementMove(event, id) {
  if (twinViewMode !== "edit") return;
  const grid = $("#rackGrid");
  if (!grid) return;
  const el = getRackLayout(twinActiveCenter(), twinActiveFloor()).racks.find((r) => r.id === id);
  if (!el) return;
  event.preventDefault();
  event.stopPropagation(); // 그리드의 '새로 그리기' 드래그와 충돌 방지
  selectRack(id);
  const start = cellFromPointer(grid, event);
  elementMove = { id, start, col0: el.col, row0: el.row, moved: false, pts0: isFreeWall(el) ? { x1: el.x1, y1: el.y1, x2: el.x2, y2: el.y2 } : null };
  const dom = $("#rackLayer")?.querySelector(`[data-rack-id="${id}"]`);
  try {
    if (event.pointerId != null && dom) dom.setPointerCapture(event.pointerId);
  } catch {
    /* 캡처 실패 무시 */
  }
  let raf = 0;
  const onMove = (e) => {
    if (!elementMove) return;
    elementMove.ev = e;
    if (raf) return; // 프레임당 1회만 처리 — 드래그가 무거워지지 않도록
    raf = requestAnimationFrame(() => {
      raf = 0;
      if (!elementMove) return;
      const cur = cellFromPointer(grid, elementMove.ev);
      const dCol = cur.col - elementMove.start.col;
      const dRow = cur.row - elementMove.start.row;
      if (!dCol && !dRow && !elementMove.moved) return;
      const target = getRackLayout(twinActiveCenter(), twinActiveFloor()).racks.find((r) => r.id === elementMove.id);
      if (!target) return;
      if (elementMove.pts0) {
        // 자유선 벽은 두 끝점을 함께 평행이동
        const p = elementMove.pts0;
        target.x1 = p.x1 + dCol;
        target.y1 = p.y1 + dRow;
        target.x2 = p.x2 + dCol;
        target.y2 = p.y2 + dRow;
      } else {
        const area = isAreaElement(target);
        const w = area ? target.w : target.dir === "h" ? target.len : 1;
        const h = area ? target.d : target.dir === "v" ? target.len : 1;
        target.col = Math.max(0, Math.min(FLOORPLAN_COLS - w, elementMove.col0 + dCol));
        target.row = Math.max(0, Math.min(FLOORPLAN_ROWS - h, elementMove.row0 + dRow));
      }
      elementMove.moved = true;
      // 전체 레이어를 다시 그리지 않고 끌고 있는 요소만 갱신
      if (dom) dom.style.cssText = elementStyle(target);
    });
  };
  const onUp = () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (elementMove?.moved) {
      markLayoutEdited(twinActiveCenter(), twinActiveFloor());
      saveState();
      refreshRackList();
      renderRackForm();
    }
    elementMove = null;
  };
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
}

// 선택 요소를 화살표 키로 1칸씩 이동
function nudgeSelectedElement(dCol, dRow) {
  const el = selectedRack();
  if (!el) return false;
  if (isFreeWall(el)) {
    el.x1 += dCol;
    el.y1 += dRow;
    el.x2 += dCol;
    el.y2 += dRow;
  } else {
    const area = isAreaElement(el);
    const w = area ? el.w : el.dir === "h" ? el.len : 1;
    const h = area ? el.d : el.dir === "v" ? el.len : 1;
    el.col = Math.max(0, Math.min(FLOORPLAN_COLS - w, el.col + dCol));
    el.row = Math.max(0, Math.min(FLOORPLAN_ROWS - h, el.row + dRow));
  }
  markLayoutEdited(twinActiveCenter(), twinActiveFloor());
  saveState();
  refreshRackLayer();
  renderRackForm();
  return true;
}

function refreshRackList() {
  const list = $("#rackList");
  const sum = $("#rackCapaSummary");
  if (sum) {
    const rc = floorRackCapa(twinActiveCenter(), twinActiveFloor());
    sum.innerHTML = `보관 CAPA <strong>${rc.slots.toLocaleString("ko-KR")} PLT</strong>
      <span>랙 ${rc.racks}개 · 적재(추정) ${rc.filled.toLocaleString("ko-KR")} PLT</span>`;
  }
  if (!list) return;
  const racks = getRackLayout(twinActiveCenter(), twinActiveFloor()).racks;
  if (!racks.length) {
    list.innerHTML = `<div class="rack-list-empty">아직 배치된 요소가 없습니다. 타입을 고르고 도면 위에서 드래그해 추가하세요.</div>`;
    return;
  }
  list.innerHTML = racks
    .map((r) => {
      const meta = isFreeWall(r)
        ? `벽(사선) ${Math.round(wallGeom(r).len * 10) / 10}칸 · ${Math.round(wallGeom(r).deg)}°`
        : r.type === "bulk"
          ? `평치 ${r.w}×${r.d}칸 · ${bulkStack(r)}단 · ${bulkSlots(r)} PLT`
          : isAreaElement(r)
            ? `${elementTypeInfo(r.type).label} ${r.w}×${r.d}`
            : `${r.dir === "v" ? "세로" : "가로"} ${r.len}칸·${r.levels || TWIN_LEVELS}단 · ${rackSlots(r)} PLT`;
      return `<div class="rack-list-item ${r.id === selectedRackId ? "selected" : ""}" data-rack-id="${r.id}">
          <span class="sw" style="background:${elementColor(r)}"></span>
          <span>${isFreeWall(r) ? r.name || "벽/챔버" : elementLabel(r)}${!isAreaElement(r) && !isFreeWall(r) && r.name ? " · " + r.name : ""}</span>
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
  // 입력창에 포커스가 남아 있으면 Del·화살표 단축키가 막히므로 해제한다
  const ae = document.activeElement;
  if (ae && ["INPUT", "SELECT", "TEXTAREA"].includes(ae.tagName)) ae.blur();
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
  const freeWall = isFreeWall(el);
  const bulk = el.type === "bulk";
  const area = isAreaElement(el) && !bulk;
  $("#rackFormTitle").textContent = elementTypeInfo(el.type).label + " 속성" + (freeWall ? " (사선)" : "");
  $("#rackOnlyFields").hidden = area || freeWall || bulk;
  $("#areaOnlyFields").hidden = !area;
  $("#wallOnlyFields").hidden = !freeWall;
  $("#bulkOnlyFields").hidden = !bulk;
  $("#rackName").value = el.name || "";
  // 보관 분류 셀렉트는 마스터의 보관공간 중분류를 그대로 따른다
  const catOpts = (sel, cur) => {
    const box = $(sel);
    if (!box) return;
    box.innerHTML = storageCats().map((c) => `<option value="${escapeAttr(c)}">${escapeHtml(c)}</option>`).join("");
    box.value = cur;
  };
  if (bulk) {
    catOpts("#bulkCat", elementCat(el));
    $("#bulkW").value = el.w;
    $("#bulkD").value = el.d;
    $("#bulkStack").value = bulkStack(el);
    $("#bulkRate").value = bulkRate(el);
    $("#bulkCustomer").value = el.customer || "";
    $("#bulkColor").value = el.color || elementTypeInfo("bulk").color;
    const area2 = Math.max(0, Math.round(number(el.w))) * Math.max(0, Math.round(number(el.d)));
    $("#bulkSlotsVal").textContent = `${bulkSlots(el).toLocaleString("ko-KR")} PLT (${area2}칸 × ${bulkStack(el)}단 × ${bulkRate(el)}%)`;
  } else if (freeWall) {
    const g = wallGeom(el);
    $("#wallDeg").value = Math.round(g.deg * 10) / 10;
    $("#wallLen").value = Math.round(g.len * 10) / 10;
    $("#wallTh").value = g.th;
    $("#wallHeight").value = el.height || 1;
    $("#wallColor").value = el.color || elementTypeInfo("wall").color;
    $("#wallPts").textContent = `(${el.x1}, ${el.y1}) → (${el.x2}, ${el.y2})`;
  } else if (area) {
    $("#areaW").value = el.w;
    $("#areaD").value = el.d;
    $("#areaHeight").value = el.height || 1;
    $("#areaHeightRow").hidden = el.type !== "office";
    $("#areaColor").value = el.color || elementTypeInfo(el.type).color;
  } else {
    catOpts("#rackCat", elementCat(el));
    $("#rackCustomer").value = el.customer || "";
    $("#rackCellPrefix").value = el.cellPrefix || "";
    $("#rackLevels").value = el.levels || TWIN_LEVELS;
    $("#rackLen").value = el.len;
    $("#rackDir").value = el.dir === "v" ? "v" : "h";
    $("#rackCapa").value = el.capa || 0;
    // 보관 CAPA = 베이 × 단 (1칸·1단 = 1 PLT)
    const slotsEl = $("#rackSlots");
    if (slotsEl) {
      const s = rackSlots(el);
      const lv = el.levels || TWIN_LEVELS;
      slotsEl.textContent = `${s.toLocaleString("ko-KR")} PLT (${el.len}칸 × ${lv}단)`;
    }
    const fillPct = Math.round((el.fill != null ? el.fill : 0.6) * 100);
    $("#rackFill").value = fillPct;
    $("#rackFillVal").textContent = fillPct + "%";
    // 재고 연동 상태 힌트
    const inv = getInventory(twinActiveCenter());
    const hint = $("#rackPrefixHint");
    if (hint) {
      if (inv && el.cellPrefix) {
        const occ = occupiedForRack(inv, el);
        const plt = Math.round(occ.plt * 10) / 10;
        hint.textContent = `실재고 ${occ.count}/${el.len * (el.levels || TWIN_LEVELS)}칸` + (plt ? ` · ${plt} PLT` : "");
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
  markLayoutEdited(twinActiveCenter(), twinActiveFloor());
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

// 자유선 벽용 — 격자에 스냅하지 않은 소수 좌표 (Shift를 누르면 15도 단위로 스냅)
function pointFromPointer(gridEl, event) {
  const rect = gridEl.getBoundingClientRect();
  const round = (v) => Math.round(v * 100) / 100;
  return {
    x: round(Math.max(0, Math.min(FLOORPLAN_COLS, ((event.clientX - rect.left) / rect.width) * FLOORPLAN_COLS))),
    y: round(Math.max(0, Math.min(FLOORPLAN_ROWS, ((event.clientY - rect.top) / rect.height) * FLOORPLAN_ROWS))),
  };
}
function snapWallEnd(start, cur, shift) {
  if (!shift) return cur;
  const dx = cur.x - start.x;
  const dy = cur.y - start.y;
  const len = Math.hypot(dx, dy);
  const step = 15;
  const deg = Math.round((Math.atan2(dy, dx) * 180) / Math.PI / step) * step;
  const rad = (deg * Math.PI) / 180;
  return { x: Math.round((start.x + Math.cos(rad) * len) * 100) / 100, y: Math.round((start.y + Math.sin(rad) * len) * 100) / 100 };
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
  const startPt = pointFromPointer(grid, event);
  rackDrag = { start, cur: start, startPt, curPt: startPt, shift: !!event.shiftKey };
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
  rackDrag.curPt = pointFromPointer(grid, event);
  rackDrag.shift = !!event.shiftKey;
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
  let rect;
  if (twinElementType === "wall") {
    const end = snapWallEnd(rackDrag.startPt, rackDrag.curPt, rackDrag.shift);
    rect = { type: "wall", x1: rackDrag.startPt.x, y1: rackDrag.startPt.y, x2: end.x, y2: end.y, color: info.color };
  } else if (info.shape === "area") {
    rect = { type: twinElementType, ...areaDragRect(rackDrag.start, rackDrag.cur), color: info.color };
  } else {
    rect = { type: "rack", ...rackDragRect(rackDrag.start, rackDrag.cur), color: info.color };
  }
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
  if (twinElementType === "wall") {
    // 벽은 두 점 자유선 — 각도 제한 없이 사선으로 그린다 (Shift = 15도 스냅)
    const end = snapWallEnd(rackDrag.startPt, pointFromPointer(grid, event), !!event.shiftKey);
    const p = rackDrag.startPt;
    if (Math.hypot(end.x - p.x, end.y - p.y) < 0.6) {
      rackDrag = null; // 클릭만 한 경우 생성하지 않음
      $("#rackPreview").hidden = true;
      return;
    }
    el = { id, type: "wall", x1: p.x, y1: p.y, x2: end.x, y2: end.y, th: WALL_TH_DEFAULT, height: 1, name: "", color: info.color };
  } else if (info.shape === "area") {
    const a = areaDragRect(rackDrag.start, cur);
    el = {
      id,
      type: twinElementType,
      col: a.col,
      row: a.row,
      w: a.w,
      d: a.d,
      name: twinElementType === "bulk" ? "" : info.label,
      color: info.color,
      height: twinElementType === "office" ? 2 : 1,
    };
    if (twinElementType === "bulk") {
      el.stack = BULK_STACK_DEFAULT;
      el.rate = BULK_RATE_DEFAULT;
      el.customer = "";
    }
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
  markLayoutEdited(twinActiveCenter(), twinActiveFloor());
  saveState();
  refreshRackLayer();
  refreshRackList();
  renderRackForm();
  // 입력창으로 포커스를 옮기지 않는다 — 그린 직후 Del·화살표 단축키를 쓸 수 있도록
}

function deleteSelectedRack() {
  const layout = getRackLayout(twinActiveCenter(), twinActiveFloor());
  layout.racks = layout.racks.filter((r) => r.id !== selectedRackId);
  selectedRackId = null;
  markLayoutEdited(twinActiveCenter(), twinActiveFloor());
  saveState();
  refreshRackLayer();
  refreshRackList();
  renderRackForm();
}

function clearAllRacks() {
  const center = twinActiveCenter();
  const floor = twinActiveFloor();
  const layout = getRackLayout(center, floor);
  if (!layout.racks.length) {
    alert("삭제할 배치가 없습니다.");
    return;
  }
  // 실수 삭제 방지 — 개수를 보여주고 확인 문구를 직접 입력받는다
  const n = layout.racks.length;
  const racks = layout.racks.filter((e) => e.type === "rack").length;
  const answer = window.prompt(
    `⚠ ${center} ${floor}의 배치 ${n}개(랙 ${racks}개)를 모두 삭제합니다.\n` +
      `이 작업은 백업되며 '↩ 되돌리기'로 복구할 수 있습니다.\n\n` +
      `계속하려면 아래에 삭제 를 입력하세요.`,
    "",
  );
  if (answer === null) return;
  if (answer.trim() !== "삭제") {
    alert("입력이 일치하지 않아 취소했습니다.");
    return;
  }
  backupLayout(center, floor);
  layout.racks = [];
  selectedRackId = null;
  markLayoutEdited(twinActiveCenter(), twinActiveFloor());
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
  $("#gaonFetch")?.addEventListener("click", fetchGaonInventory);
  bindGaonModal();
  bindInventoryView();
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
  // 도면 맞춤 도구 접기/펼치기 (자주 안 쓰는 기능 — 기본 접힘, 선택 상태 저장)
  const applyBgFold = () => {
    const body = $("#bgAdjustBody");
    const btn = $("#bgAdjustToggle");
    if (!body || !btn) return;
    const open = !!state.bgAdjustOpen;
    body.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
    btn.textContent = open ? "도면 맞춤 ▴" : "도면 맞춤 ▾";
    btn.classList.toggle("open", open);
  };
  $("#bgAdjustToggle")?.addEventListener("click", () => {
    state.bgAdjustOpen = !state.bgAdjustOpen;
    saveState();
    applyBgFold();
  });
  applyBgFold();
  // 배치 관리(백업·되돌리기) 접기/펼치기 — 기본 접힘
  const applyLayoutFold = () => {
    const body = $("#layoutToolsBody");
    const btn = $("#layoutToolsToggle");
    if (!body || !btn) return;
    const open = !!state.layoutToolsOpen;
    body.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
    btn.textContent = open ? "배치 관리 ▴" : "배치 관리 ▾";
    btn.classList.toggle("open", open);
  };
  $("#layoutToolsToggle")?.addEventListener("click", () => {
    state.layoutToolsOpen = !state.layoutToolsOpen;
    saveState();
    applyLayoutFold();
  });
  applyLayoutFold();
  $("#bgToggle")?.addEventListener("click", () => {
    const v = rackBgView(getFloorplan(twinActiveCenter(), twinActiveFloor()));
    v.off = !v.off;
    saveState();
    applyRackBgTransform();
  });
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
  // 사선 벽 — 각도·길이는 중심을 고정한 채 두 끝점을 다시 계산한다
  const reshapeWall = (patch) => {
    const el = selectedRack();
    if (!isFreeWall(el)) return;
    const g = wallGeom(el);
    setWallFromPolar(el, g.cx, g.cy, patch.len ?? g.len, patch.deg ?? g.deg);
    updateSelectedRack({});
    renderRackForm(); // 각도·길이·좌표 표시를 계산 결과로 되돌려 보여준다
  };
  $("#wallDeg")?.addEventListener("change", (e) => reshapeWall({ deg: Number(e.target.value) || 0 }));
  $("#wallLen")?.addEventListener("change", (e) => reshapeWall({ len: Math.max(0.5, Number(e.target.value) || 1) }));
  $("#wallSnap45")?.addEventListener("click", () => {
    const el = selectedRack();
    if (!isFreeWall(el)) return;
    reshapeWall({ deg: Math.round(wallGeom(el).deg / 15) * 15 });
  });
  $("#wallTh")?.addEventListener("change", (e) =>
    updateSelectedRack({ th: Math.max(0.1, Math.min(5, Number(e.target.value) || WALL_TH_DEFAULT)) }),
  );
  $("#wallHeight")?.addEventListener("change", (e) =>
    updateSelectedRack({ height: Math.max(1, Math.min(6, Number(e.target.value) || 1)) }),
  );
  $("#wallColor")?.addEventListener("input", (e) => updateSelectedRack({ color: e.target.value }));
  // 평치/벌크 — 면적·단수·유효적재율을 바꾸면 보관 CAPA가 바로 다시 계산된다
  const bulkPatch = (patch) => {
    updateSelectedRack(patch);
    renderRackForm();
    renderAll();
  };
  $("#bulkW")?.addEventListener("change", (e) =>
    bulkPatch({ w: Math.max(1, Math.min(FLOORPLAN_COLS, Number(e.target.value) || 1)) }),
  );
  $("#bulkD")?.addEventListener("change", (e) =>
    bulkPatch({ d: Math.max(1, Math.min(FLOORPLAN_ROWS, Number(e.target.value) || 1)) }),
  );
  $("#bulkStack")?.addEventListener("change", (e) =>
    bulkPatch({ stack: Math.max(1, Math.min(10, Number(e.target.value) || BULK_STACK_DEFAULT)) }),
  );
  $("#bulkRate")?.addEventListener("change", (e) =>
    bulkPatch({ rate: Math.max(0, Math.min(100, Number(e.target.value))) }),
  );
  $("#bulkCustomer")?.addEventListener("change", (e) => bulkPatch({ customer: e.target.value.trim() }));
  $("#bulkColor")?.addEventListener("input", (e) => updateSelectedRack({ color: e.target.value }));
  // 보관 분류 — 바꾸면 분류별 CAPA 집계가 즉시 갱신된다
  const catPatch = (e) => {
    updateSelectedRack({ cat: e.target.value });
    renderAll();
  };
  $("#rackCat")?.addEventListener("change", catPatch);
  $("#bulkCat")?.addEventListener("change", catPatch);
  $("#rackDelete")?.addEventListener("click", deleteSelectedRack);
  $("#rackClearAll")?.addEventListener("click", clearAllRacks);
  $("#layoutUndoBackup")?.addEventListener("click", restoreLayoutBackup);
  $("#layoutReloadDefault")?.addEventListener("click", reloadDefaultLayout);
  $("#layoutExport")?.addEventListener("click", exportLayouts);
  $("#layoutImport")?.addEventListener("change", importLayouts);
  $("#rackFloorplanUpload")?.addEventListener("change", uploadRackFloorplan);
  bindTwinLayerPanel();
  // 3D 이름 표시 토글
  const syncLabelToggle = () => {
    const btn = $("#twinLabelToggle");
    if (!btn) return;
    const on = state.twinLabels !== false;
    btn.textContent = on ? "🏷 이름 표시" : "🏷 이름 숨김";
    btn.classList.toggle("off", !on);
  };
  $("#twinLabelToggle")?.addEventListener("click", () => {
    state.twinLabels = state.twinLabels === false;
    saveState();
    syncLabelToggle();
    if (twinViewMode === "view") render3DTwin();
  });
  syncLabelToggle();
  // 사진·도면 패널 접기/펼치기 (자주 안 쓰는 업로드류)
  const applyPhotoFold = () => {
    const body = $("#photoPanelBody");
    const btn = $("#photoPanelToggle");
    if (!body || !btn) return;
    const open = !!state.photoPanelOpen;
    body.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
    btn.textContent = open ? "사진·도면 ▴" : "사진·도면 ▾";
    btn.classList.toggle("open", open);
  };
  $("#photoPanelToggle")?.addEventListener("click", () => {
    state.photoPanelOpen = !state.photoPanelOpen;
    saveState();
    applyPhotoFold();
  });
  applyPhotoFold();
  // 썸네일 클릭 → 팝업으로 크게 보기
  $("#twinPhotoThumb")?.addEventListener("click", () => openImgModal($("#twinPhotoImg")?.src, "센터 사진"));
  $("#twinPlanThumb")?.addEventListener("click", () =>
    openImgModal($("#twinPlanImg")?.src, `PDF 도면 · ${twinActiveFloor()}`),
  );
  $("#imgModalClose")?.addEventListener("click", closeImgModal);
  $("#imgModal")?.addEventListener("click", (e) => {
    if (e.target.id === "imgModal") closeImgModal();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$("#imgModal")?.hidden) closeImgModal();
  });
  $("#twinFullscreen")?.addEventListener("click", toggleTwinFullscreen);
  document.addEventListener("fullscreenchange", syncTwinFullscreenUI);
  document.addEventListener("webkitfullscreenchange", syncTwinFullscreenUI);
  // 화살표 키로 선택 요소 미세 이동 (편집 모드, 입력창 포커스가 아닐 때)
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const el = twinFullscreenTarget();
      if (el?.classList.contains("fs")) {
        el.classList.remove("fs");
        syncTwinFullscreenUI();
        return;
      }
    }
    if (twinViewMode !== "edit" || !selectedRackId) return;
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
    // Del / Backspace → 선택 요소 삭제
    if (e.key === "Delete" || e.key === "Backspace") {
      const el = selectedRack();
      if (!el) return;
      e.preventDefault();
      deleteSelectedRack();
      return;
    }
    // 화살표 → 1칸 이동 (Shift 함께 누르면 5칸)
    const map = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const d = map[e.key];
    if (!d) return;
    const step = e.shiftKey ? 5 : 1;
    if (nudgeSelectedElement(d[0] * step, d[1] * step)) e.preventDefault();
  });
}

if (!localStorage.getItem(STORAGE_KEY)) {
  seedDemoData();
  saveState();
}

// 화면에 현재 배치 버전 표기 — 캐시된 옛 파일이 떠 있는지 바로 확인용
{
  const tag = $("#buildTag");
  if (tag) tag.textContent = `배치 v${DEFAULT_RACKS_VERSION} · 격자 ${FLOORPLAN_COLS}×${FLOORPLAN_ROWS}`;
}

renderNav();
renderFilters();
bindEvents();
renderAll();
