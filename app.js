const STORAGE_KEY = "hx-center-capa-v2";
const LEGACY_STORAGE_KEY = "hx-center-capa-v1";
const ALL = "전체";
const FLOORPLAN_COLS = 48;
const FLOORPLAN_ROWS = 28;
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
      centerFloors: parsed.centerFloors || {},
      shippers: parsed.shippers || [],
      centerShipperMap: parsed.centerShipperMap || {},
      hiddenMappedShippers: parsed.hiddenMappedShippers || {},
      centerInfo: parsed.centerInfo || {},
      shipperTargetAverages: parsed.shipperTargetAverages || {},
      kakaoApiKey: parsed.kakaoApiKey || "",
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
      state.centerFloors[center] = ["1F"];
      changed = true;
    }
  });
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

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getCenterFloors(center) {
  const floors = state.centerFloors?.[center];
  return Array.isArray(floors) && floors.length ? floors : ["1F"];
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
  return state.floorplans[key];
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
      if (button.dataset.view === "mapView") renderCenterMap();
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
        <div class="overview-row">
          <strong class="overview-center">${row.center}</strong>
          ${renderOverviewStackedBar(row)}
          <div class="overview-metrics">
            <span><b>전체</b>${formatPlt(row.capacity)}</span>
            <span><b>사용</b>${formatPlt(row.used)}</span>
            <span class="free-value"><b>여유</b>${formatPlt(row.free)}</span>
          </div>
        </div>
      `,
    )
    .join("");
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
  const reader = new FileReader();
  reader.onload = () => {
    const plan = getFloorplan(selectedCenter, selectedFloor);
    plan.image = reader.result;
    saveState();
    renderFloorplan();
  };
  reader.readAsDataURL(file);
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
    state.centerFloors[center] = ["1F"];
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

if (!localStorage.getItem(STORAGE_KEY)) {
  seedDemoData();
  saveState();
}

renderNav();
renderFilters();
bindEvents();
renderAll();
