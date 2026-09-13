/* Subway Random Menu + random.org API
 * 우선순위:
 *  1) /.netlify/functions/random (서버에 RANDOM_ORG_API_KEY 보관, JSON-RPC generateIntegers)
 *  2) 사용자가 입력한 API키 -> https://api.random.org/json-rpc/4/invoke 직접 호출
 *  3) 공개 API https://www.random.org/integers/ (키 불필요)
 *  4) crypto.getRandomValues() 폴백
 */
const $ = (id) => document.getElementById(id);
const drawBtn = $("drawBtn"), redrawBtn = $("redrawBtn"), statusEl = $("status");
const resultEl = $("result");

function getSavedKey() {
  return localStorage.getItem("random_org_key") || "";
}
function initKeyInput() {
  $("apiKeyInput").value = getSavedKey();
  $("saveKeyBtn").onclick = () => {
    localStorage.setItem("random_org_key", $("apiKeyInput").value.trim());
    statusEl.textContent = "API 키 저장됨! 다음 뽑기부터 JSON-RPC 직접 호출을 시도합니다.";
  };
}

// --- random.org 호출부 ---

// 1) Netlify Function 경유
async function viaNetlifyFunction(n, min, max) {
  const res = await fetch(`/.netlify/functions/random?n=${n}&min=${min}&max=${max}`);
  if (!res.ok) throw new Error("function http " + res.status);
  const j = await res.json();
  if (!j || !Array.isArray(j.numbers)) throw new Error("function bad payload");
  return { numbers: j.numbers, source: j.source || "random.org via Netlify Function", detail: j.detail || "" };
}

// 2) 브라우저 -> random.org JSON-RPC 직접 (사용자 키 필요)
async function viaJsonRpcDirect(n, min, max, apiKey) {
  const body = {
    jsonrpc: "2.0",
    method: "generateIntegers",
    params: { apiKey, n, min, max, replacement: true, base: 10 },
    id: Date.now(),
  };
  const res = await fetch("https://api.random.org/json-rpc/4/invoke", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("json-rpc http " + res.status);
  const j = await res.json();
  if (j.error) throw new Error("random.org: " + (j.error.message || JSON.stringify(j.error)));
  return { numbers: j.result.random.data, source: "random.org JSON-RPC (브라우저 직접)", detail: `completionTime:${j.result.random.completionTime || ""}` };
}

// 3) 공개 integers API (키 불필요, CORS 허용됨)
async function viaPublicIntegers(n, min, max) {
  const url = `https://www.random.org/integers/?num=${n}&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("public api http " + res.status);
  const text = (await res.text()).trim().split(/\s+/).map(Number);
  if (text.length < n || text.some(isNaN)) throw new Error("public api parse fail: " + text);
  return { numbers: text.slice(0, n), source: "random.org 공개 API (integers)", detail: url };
}

// 4) 최종 폴백
function viaCrypto(n, min, max) {
  const arr = new Uint32Array(n);
  crypto.getRandomValues(arr);
  const numbers = [...arr].map((v) => min + (v % (max - min + 1)));
  return { numbers, source: "폴백: crypto.getRandomValues (random.org 실패)", detail: "" };
}

// n개의 0~99999 베이스 난수를 받아 각 옵션 길이에 맞게 매핑
async function getBaseRandoms(count) {
  const N = count, MIN = 0, MAX = 99999;
  const savedKey = getSavedKey().trim() || $("apiKeyInput").value.trim();

  // 1) Netlify Function (로컬 file:// 에서는 실패 -> 다음 단계로)
  try {
    if (location.protocol.startsWith("http")) {
      return await viaNetlifyFunction(N, MIN, MAX);
    }
    throw new Error("skip function on file://");
  } catch (e) { console.warn("function fail:", e); }

  // 2) 직접 JSON-RPC
  if (savedKey) {
    try { return await viaJsonRpcDirect(N, MIN, MAX, savedKey); }
    catch (e) { console.warn("jsonrpc fail:", e); }
  }

  // 3) 공개 API
  try { return await viaPublicIntegers(N, MIN, MAX); }
  catch (e) { console.warn("public fail:", e); }

  // 4) 폴백
  return viaCrypto(N, MIN, MAX);
}

const pick = (arr, r) => arr[r % arr.length];

async function draw(sharedIdx = null) {
  drawBtn.disabled = true;
  if (redrawBtn) redrawBtn.disabled = true;
  statusEl.textContent = "🎲 random.org에서 진짜 난수 요청 중…";
  try {
    // 메뉴 1 + 빵 + 치즈 + 소스2 + 토핑 + 사이즈 + 굽기 + 할라피뇨여부 = 9개
    const { numbers, source, detail } = await getBaseRandoms(9);
    const [r0, r1, r2, r3, r4, r5, r6, r7, r8] = numbers;

    const full = $("optFull").checked;
    const menuIdx = sharedIdx !== null ? sharedIdx : r0 % SUBWAY_MENUS.length;
    const menu = SUBWAY_MENUS[menuIdx];

    const size = full ? pick(SIZES, r6) : "15cm";
    const bread = full ? pick(BREADS, r1) : "추천빵";
    const cheese = full ? pick(CHEESES, r2) : "추천치즈";
    let sauce;
    if (!full) sauce = "추천소스";
    else {
      const s1 = pick(SAUCES, r3), s2 = pick(SAUCES, r4);
      sauce = s1 === s2 ? s1 : `${s1} + ${s2}`;
    }
    const topping = full ? pick(TOPPINGS, r5) : "추가 없음";
    const toast = r7 % 2 === 0 ? "토스팅 O" : "토스팅 X";
    let veggie = "전부 다 (기본)";
    if ($("optVeggieAll").checked) {
      veggie = r8 % 3 === 0 ? "전부 다 + 할라피뇨 많이" : r8 % 3 === 1 ? "할라피뇨만 제외하고 전부" : "전부 다";
    } else {
      const vcount = 3 + (r8 % 4); // 3~6개
      const shuffled = [...VEGGIES].sort(() => 0); // 순서고정 후 난수픽
      const chosen = [];
      let seed = r8;
      while (chosen.length < vcount) {
        const c = shuffled[seed % shuffled.length];
        if (!chosen.includes(c)) chosen.push(c);
        seed = (seed * 9301 + 49297) % 233280;
      }
      veggie = chosen.join(", ");
    }

    $("rTag").textContent = menu.tag;
    $("rImg").src = menu.img;
    $("rImg").alt = menu.ko;
    $("rImg").onerror = () => { $("rImg").src = "https://www.subway.co.kr/images/common/logo.png"; };
    $("rName").textContent = menu.ko;
    $("rEn").textContent = menu.en;
    $("rDesc").textContent = menu.desc;
    $("rSize").textContent = size;
    $("rBread").textContent = bread;
    $("rCheese").textContent = cheese;
    $("rVeggie").textContent = veggie;
    $("rSauce").textContent = sauce;
    $("rTopping").textContent = topping;
    $("rToast").textContent = toast;
    $("rSource").textContent = "난수 소스: " + source;
    $("rNumbers").textContent = "난수 [" + numbers.join(", ") + "]";

    const script = `"${menu.ko} ${size}로 주세요. 빵은 ${bread}, 치즈는 ${cheese}, 야채는 ${veggie}, 소스는 ${sauce}${topping !== "추가 없음" ? ", " + topping + " 추가" : ""}해 주세요. ${toast === "토스팅 O" ? "빵은 데워주세요!" : "빵은 그냥 주세요!"}"`;
    $("rScript").textContent = script;

    resultEl.classList.remove("hidden");
    resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
    statusEl.textContent = "✅ 뽑기 완료! (" + source + ")";
    if (detail) console.log("[random]", detail);

    saveHistory({ menuIdx, name: menu.ko, size, bread, sauce, at: new Date().toLocaleString() });
    history.replaceState(null, "", location.pathname + "?menu=" + menuIdx);
  } catch (e) {
    console.error(e);
    statusEl.textContent = "❌ 난수 요청 실패: " + e.message;
  } finally {
    drawBtn.disabled = false;
    if (redrawBtn) redrawBtn.disabled = false;
  }
}

function saveHistory(item) {
  try {
    const h = JSON.parse(localStorage.getItem("subway_history") || "[]");
    h.unshift(item);
    localStorage.setItem("subway_history", JSON.stringify(h.slice(0, 20)));
    renderHistory();
  } catch {}
}
function renderHistory() {
  const ul = $("history");
  ul.innerHTML = "";
  let h = [];
  try { h = JSON.parse(localStorage.getItem("subway_history") || "[]"); } catch {}
  if (!h.length) { ul.innerHTML = "<li>아직 기록이 없어요. 첫 메뉴를 뽑아보세요!</li>"; return; }
  h.forEach((it) => {
    const li = document.createElement("li");
    li.textContent = `${it.at} — ${it.name} (${it.size} / ${it.bread} / ${it.sauce})`;
    li.onclick = () => draw(it.menuIdx);
    ul.appendChild(li);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  initKeyInput();
  renderHistory();
  drawBtn.onclick = () => draw();
  redrawBtn.onclick = () => draw();
  $("clearHistoryBtn").onclick = () => { localStorage.removeItem("subway_history"); renderHistory(); };
  $("copyBtn").onclick = async () => {
    try { await navigator.clipboard.writeText($("rScript").textContent); statusEl.textContent = "📋 주문 멘트 복사됨!"; }
    catch { statusEl.textContent = "복사 실패 — 직접 드래그해서 복사해주세요."; }
  };
  $("shareBtn").onclick = async () => {
    try { await navigator.clipboard.writeText(location.href); statusEl.textContent = "🔗 공유 링크 복사됨!"; }
    catch { statusEl.textContent = "복사 실패 — 주소창 URL을 복사해주세요."; }
  };
  // 공유 링크 (?menu=3) 로 들어오면 해당 메뉴 표시
  const q = new URLSearchParams(location.search).get("menu");
  if (q !== null && SUBWAY_MENUS[Number(q)]) draw(Number(q));
});
