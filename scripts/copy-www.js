// 웹 파일 4개만 www/ 로 복사 (Capacitor webDir용 빌드 산출물)
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const out = path.join(root, "www");
const files = ["index.html", "styles.css", "app.js", "data.js"];

fs.mkdirSync(out, { recursive: true });
for (const f of files) {
  fs.copyFileSync(path.join(root, f), path.join(out, f));
}
console.log("www/ updated:", files.join(", "));
