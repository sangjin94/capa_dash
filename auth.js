(() => {
  const USERS_KEY = "hanex_capa_auth_users_v1";
  const SESSION_KEY = "hanex_capa_auth_session_v1";
  const MASTER_ID = "MASTER";
  const MASTER_PW = "3897";

  const style = document.createElement("style");
  style.textContent = `
    html.hanex-auth-locked,
    html.hanex-auth-locked body {
      min-height: 100%;
      background: #fff !important;
      overflow: hidden;
    }
    html.hanex-auth-locked body > *:not(#hanex-auth-screen) {
      visibility: hidden !important;
      pointer-events: none !important;
    }
    #hanex-auth-screen {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      display: grid;
      place-items: center;
      background: #fff;
      color: #0f172a;
      font-family: Arial, "Noto Sans KR", sans-serif;
    }
    .hanex-auth-card {
      width: min(420px, calc(100vw - 40px));
      padding: 34px 32px 28px;
      border: 1px solid #d9e2ec;
      border-radius: 18px;
      background: #fff;
      box-shadow: 0 24px 60px rgba(15, 23, 42, 0.16);
    }
    .hanex-auth-logo {
      text-align: center;
      font-weight: 900;
      font-style: italic;
      font-size: 30px;
      letter-spacing: -1.5px;
      margin-bottom: 22px;
      text-shadow: 0 3px 10px rgba(15, 23, 42, 0.15);
    }
    .hanex-auth-logo .han { color: #e60012; }
    .hanex-auth-logo .express { color: #173cba; }
    .hanex-auth-title {
      text-align: center;
      font-size: 22px;
      font-weight: 800;
      margin: 0 0 6px;
    }
    .hanex-auth-subtitle {
      text-align: center;
      margin: 0 0 22px;
      color: #64748b;
      font-size: 13px;
      line-height: 1.45;
    }
    .hanex-auth-tabs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 16px;
    }
    .hanex-auth-tabs button,
    .hanex-auth-card button,
    .hanex-auth-floating button {
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      background: #fff;
      padding: 11px 12px;
      font-weight: 800;
      cursor: pointer;
    }
    .hanex-auth-tabs button.active,
    .hanex-auth-primary {
      background: #102133 !important;
      color: #fff !important;
      border-color: #102133 !important;
    }
    .hanex-auth-field {
      display: grid;
      gap: 7px;
      margin-bottom: 12px;
      font-size: 13px;
      font-weight: 800;
      color: #334155;
    }
    .hanex-auth-field input {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 12px 13px;
      font-size: 15px;
    }
    .hanex-auth-row {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .hanex-auth-row input { flex: 1; }
    .hanex-auth-check { white-space: nowrap; }
    .hanex-auth-message {
      min-height: 20px;
      color: #dc2626;
      font-size: 13px;
      margin: 8px 0 14px;
      line-height: 1.45;
    }
    .hanex-auth-message.ok { color: #047857; }
    .hanex-auth-wide { width: 100%; }
    .hanex-auth-pending {
      display: grid;
      gap: 8px;
      max-height: 240px;
      overflow: auto;
      margin: 16px 0;
    }
    .hanex-auth-user-row {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 8px;
      align-items: center;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 10px;
    }
    .hanex-auth-user-row small {
      color: #64748b;
      display: block;
      margin-top: 2px;
    }
    .hanex-auth-floating {
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 9999;
      display: flex;
      gap: 8px;
      align-items: center;
      background: #fff;
      border: 1px solid #d9e2ec;
      border-radius: 14px;
      padding: 10px 12px;
      box-shadow: 0 14px 36px rgba(15, 23, 42, 0.16);
      font-family: Arial, "Noto Sans KR", sans-serif;
    }
    .hanex-auth-floating strong {
      font-size: 13px;
      color: #334155;
    }
  `;
  (document.head || document.documentElement).appendChild(style);
  document.documentElement.classList.add("hanex-auth-locked");

  const readUsers = () => {
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      return Array.isArray(users) ? users : [];
    } catch {
      return [];
    }
  };
  const writeUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));
  const getUser = (id) => readUsers().find((user) => user.id.toUpperCase() === String(id).toUpperCase());
  const logoHtml = () => `<div class="hanex-auth-logo"><span class="han">Han</span><span class="express">Express</span></div>`;
  const formatDateTime = (value) => new Date(value || Date.now()).toLocaleString("ko-KR", { hour12: false });

  const ensureMaster = () => {
    const users = readUsers().filter((user) => user.id !== MASTER_ID);
    users.unshift({
      id: MASTER_ID,
      pw: MASTER_PW,
      role: "master",
      status: "approved",
      createdAt: new Date().toISOString(),
      approvedAt: new Date().toISOString(),
    });
    writeUsers(users);
  };

  const screen = () => {
    let el = document.getElementById("hanex-auth-screen");
    if (!el) {
      el = document.createElement("div");
      el.id = "hanex-auth-screen";
      document.body.appendChild(el);
    }
    return el;
  };

  const setMessage = (text, ok = false) => {
    const msg = document.getElementById("hanexAuthMessage");
    if (!msg) return;
    msg.textContent = text || "";
    msg.classList.toggle("ok", ok);
  };

  const renderFloating = (user) => {
    const old = document.getElementById("hanex-auth-floating");
    if (old) old.remove();
    const box = document.createElement("div");
    box.id = "hanex-auth-floating";
    box.className = "hanex-auth-floating";
    box.innerHTML = `
      <strong>${user.id}</strong>
      ${user.role === "master" ? `<button id="hanexOpenApproval" type="button">회원 승인</button>` : ""}
      <button id="hanexLogout" type="button">로그아웃</button>
    `;
    document.body.appendChild(box);
    const approve = document.getElementById("hanexOpenApproval");
    if (approve) approve.addEventListener("click", () => renderApproval(user));
    document.getElementById("hanexLogout").addEventListener("click", () => {
      localStorage.removeItem(SESSION_KEY);
      window.location.reload();
    });
  };

  const unlock = (user) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id, loginAt: new Date().toISOString() }));
    document.documentElement.classList.remove("hanex-auth-locked");
    const gate = document.getElementById("hanex-auth-screen");
    if (gate) gate.remove();
    renderFloating(user);
  };

  const sessionUser = () => {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      if (!session?.id) return null;
      const user = getUser(session.id);
      return user && user.status === "approved" ? user : null;
    } catch {
      return null;
    }
  };

  const renderLogin = (mode = "login") => {
    document.documentElement.classList.add("hanex-auth-locked");
    const isSignup = mode === "signup";
    screen().innerHTML = `
      <section class="hanex-auth-card" role="dialog" aria-modal="true" aria-label="로그인">
        ${logoHtml()}
        <h1 class="hanex-auth-title">센터 CAPA 로그인</h1>
        <p class="hanex-auth-subtitle">승인된 계정만 대시보드를 사용할 수 있습니다.</p>
        <div class="hanex-auth-tabs">
          <button type="button" class="${isSignup ? "" : "active"}" data-auth-tab="login">로그인</button>
          <button type="button" class="${isSignup ? "active" : ""}" data-auth-tab="signup">회원가입</button>
        </div>
        <form id="hanexAuthForm">
          <label class="hanex-auth-field">
            ID
            <div class="${isSignup ? "hanex-auth-row" : ""}">
              <input id="hanexAuthId" type="text" autocomplete="username" placeholder="ID 입력" />
              ${isSignup ? `<button class="hanex-auth-check" id="hanexDupCheck" type="button">중복체크</button>` : ""}
            </div>
          </label>
          <label class="hanex-auth-field">
            PW
            <input id="hanexAuthPw" type="password" autocomplete="${isSignup ? "new-password" : "current-password"}" placeholder="비밀번호 입력" />
          </label>
          <div class="hanex-auth-message" id="hanexAuthMessage"></div>
          <button class="hanex-auth-primary hanex-auth-wide" type="submit">${isSignup ? "가입 신청" : "로그인"}</button>
        </form>
      </section>
    `;

    let dupOk = false;
    screen().querySelectorAll("[data-auth-tab]").forEach((button) => {
      button.addEventListener("click", () => renderLogin(button.dataset.authTab));
    });

    const idInput = document.getElementById("hanexAuthId");
    const pwInput = document.getElementById("hanexAuthPw");
    const dupButton = document.getElementById("hanexDupCheck");

    if (dupButton) {
      dupButton.addEventListener("click", () => {
        const id = idInput.value.trim();
        if (!id) return setMessage("먼저 사용할 ID를 입력해주세요.");
        if (getUser(id)) return setMessage("이미 사용 중인 ID입니다.");
        dupOk = true;
        setMessage("사용 가능한 ID입니다.", true);
      });
      idInput.addEventListener("input", () => {
        dupOk = false;
      });
    }

    document.getElementById("hanexAuthForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const id = idInput.value.trim();
      const pw = pwInput.value.trim();
      if (!id || !pw) return setMessage("ID와 비밀번호를 모두 입력해주세요.");

      if (isSignup) {
        if (!dupOk) return setMessage("ID 중복체크를 먼저 진행해주세요.");
        const users = readUsers();
        users.push({ id, pw, role: "user", status: "pending", createdAt: new Date().toISOString() });
        writeUsers(users);
        alert("가입 신청이 접수되었습니다. 관리자 승인 후 접속할 수 있습니다.");
        return renderLogin("login");
      }

      const user = getUser(id);
      if (!user || user.pw !== pw) return setMessage("ID 또는 비밀번호를 확인해주세요.");
      if (user.status !== "approved") return setMessage("관리자 승인 대기 중입니다.");
      if (user.role === "master") return renderApproval(user);
      unlock(user);
    });
  };

  function renderApproval(masterUser) {
    document.documentElement.classList.add("hanex-auth-locked");
    const pending = readUsers().filter((user) => user.status === "pending");
    screen().innerHTML = `
      <section class="hanex-auth-card" role="dialog" aria-modal="true" aria-label="회원 승인">
        ${logoHtml()}
        <h1 class="hanex-auth-title">회원 승인 관리</h1>
        <p class="hanex-auth-subtitle">MASTER 계정입니다. 승인된 사용자만 접속할 수 있습니다.</p>
        <div class="hanex-auth-pending">
          ${
            pending.length
              ? pending.map((user) => `
                <div class="hanex-auth-user-row">
                  <div><strong>${user.id}</strong><small>${formatDateTime(user.createdAt)}</small></div>
                  <button type="button" data-approve="${user.id}">승인</button>
                  <button type="button" data-delete="${user.id}">삭제</button>
                </div>`).join("")
              : `<p class="hanex-auth-subtitle">승인 대기 계정이 없습니다.</p>`
          }
        </div>
        <button class="hanex-auth-primary hanex-auth-wide" id="hanexEnterDashboard" type="button">대시보드 입장</button>
        <button class="hanex-auth-wide" id="hanexMasterLogout" type="button" style="margin-top:8px;">로그아웃</button>
      </section>
    `;

    screen().querySelectorAll("[data-approve]").forEach((button) => {
      button.addEventListener("click", () => {
        const users = readUsers().map((user) =>
          user.id === button.dataset.approve
            ? { ...user, status: "approved", approvedAt: new Date().toISOString() }
            : user
        );
        writeUsers(users);
        renderApproval(masterUser);
      });
    });

    screen().querySelectorAll("[data-delete]").forEach((button) => {
      button.addEventListener("click", () => {
        writeUsers(readUsers().filter((user) => user.id !== button.dataset.delete));
        renderApproval(masterUser);
      });
    });

    document.getElementById("hanexEnterDashboard").addEventListener("click", () => unlock(masterUser));
    document.getElementById("hanexMasterLogout").addEventListener("click", () => {
      localStorage.removeItem(SESSION_KEY);
      renderLogin("login");
    });
  }

  const start = () => {
    ensureMaster();
    const user = sessionUser();
    if (user) unlock(user);
    else renderLogin("login");
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
