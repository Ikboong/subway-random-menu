# 🥪 서브웨이 랜덤 메뉴 (random.org + Netlify)

서브웨이 공식 메뉴(https://www.subway.co.kr/menuList/sandwich) 25종 + 빵/치즈/야채/소스/토핑을
**random.org 진짜 난수**로 뽑아주는 정적 웹사이트입니다. Netlify에 그대로 배포됩니다.

## 기능
- 🎲 샌드위치 25종 랜덤 (공식 이미지/설명 사용)
- 🍞 빵 6종 / 🧀 치즈 4종 / 🥗 야채 / 🧂 소스 14종 중 2개 / ➕ 토핑 / 📏 15cm·30cm / 🔥 굽기까지 풀코스
- 📜 뽑기 기록 (localStorage) + 🔗 공유 링크 (`?menu=번호`)

## random.org 연동 (3단계 폴백)
1. `/.netlify/functions/random` → 서버에서 `generateIntegers` JSON-RPC (API키 서버 보관, 권장)
2. `https://www.random.org/integers/` 공개 API (키 불필요)
3. 전부 실패 → `crypto.getRandomValues()` 폴백 (화면에 표기)

## 로컬 실행
```powershell
cd "C:\Users\lob04\Documents\subway-random-menu"
npx serve .
# 또는 VSCode Live Server로 index.html 열기
# Netlify Function 테스트: netlify dev (netlify-cli 필요)
```

## Netlify 배포 (3가지 중 택1)

### A. 드래그-드롭 (가장 빠름)
1. https://app.netlify.com/drop 접속
2. 이 폴더(`subway-random-menu`) 통째로 드래그 → 즉시 URL 발급

### B. GitHub 연결 (권장)
1. 이 폴더를 GitHub 리포로 푸시
2. Netlify > Add new site > Import from Git
3. Build settings: Publish directory `.` / Functions `netlify/functions` (netlify.toml에 이미 설정됨)
4. Site settings > Environment variables > `RANDOM_ORG_API_KEY` 등록 (https://api.random.org/api-keys 에서 무료 발급)

### C. CLI
```powershell
npm i -g netlify-cli
netlify deploy --prod
```

## 파일 구조
```
index.html                  메인 페이지
styles.css                  서브웨이 그린/옐로 테마
data.js                     메뉴 25종 + 빵/치즈/소스 데이터 (subway.co.kr 기반)
app.js                      random.org 3단계 폴백 + 뽑기 로직
netlify.toml                publish ".", functions "netlify/functions"
netlify/functions/random.js JSON-RPC 프록시 (API키 숨김)
```
