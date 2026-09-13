// Netlify Function: random.org JSON-RPC 프록시
// 환경변수 RANDOM_ORG_API_KEY 에 키 보관 (https://api.random.org/api-keys 무료 발급)
// 키가 없으면 crypto 폴백으로 동작 (개발/프리뷰용)

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  const qs = event.queryStringParameters || {};
  const n = Math.min(Math.max(parseInt(qs.n || "9", 10), 1), 100);
  const min = parseInt(qs.min ?? "0", 10);
  const max = parseInt(qs.max ?? "99999", 10);
  const apiKey = process.env.RANDOM_ORG_API_KEY;

  const fallback = (reason) => {
    const numbers = Array.from({ length: n }, () =>
      min + Math.floor(Math.random() * (max - min + 1))
    );
    return {
      statusCode: 200, headers,
      body: JSON.stringify({ numbers, source: "폴백: Netlify Function crypto (random.org 실패)", detail: reason }),
    };
  };

  if (!apiKey) return fallback("RANDOM_ORG_API_KEY 없음");

  try {
    const r = await fetch("https://api.random.org/json-rpc/4/invoke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "generateIntegers",
        params: { apiKey, n, min, max, replacement: true, base: 10 },
        id: Date.now(),
      }),
    });
    const j = await r.json();
    if (j.error) return fallback("random.org error: " + (j.error.message || JSON.stringify(j.error)));
    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        numbers: j.result.random.data,
        source: "random.org JSON-RPC generateIntegers (Netlify Function)",
        detail: "completionTime:" + (j.result.random.completionTime || ""),
        bitsUsed: j.result.bitsUsed,
        requestsLeft: j.result.requestsLeft,
      }),
    };
  } catch (e) {
    return fallback(String(e && e.message || e));
  }
};
