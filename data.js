const SUBWAY_MENUS = [
  { ko: "로스트 치킨 아보카도", en: "Roasted Chicken Avocado", desc: "오븐에 구운 촉촉한 닭가슴살에 부드러운 아보카도를 더해, 맛과 영양을 모두 잡은 든든한 메뉴", img: "https://www.subway.co.kr/upload/menu/1785741671083_TyCRBr.png", tag: "NEW" },
  { ko: "아기맹새우", en: "Little Tiger's Shrimp", desc: "쉬림프 7마리(담백4+매콤3)와 부드러운 아보카도, 고소상큼 소스의 맹렬한 조합! (고정레시피)", img: "https://www.subway.co.kr/upload/menu/1784523876481_AJ8csx.png", tag: "NEW" },
  { ko: "피자썹", en: "Pizza Sub", desc: "토마토살사에 모차렐라치즈가 듬뿍, 간편하고 맛있게 즐기는 피자썹 (고정레시피)", img: "https://www.subway.co.kr/upload/menu/1781152604561_TA6XRx.png", tag: "NEW" },
  { ko: "안창 비프 & 머쉬룸", en: "Beef & Mushroom", desc: "부드럽고 풍미 넘치는 안창살과 담백하고 건강한 머쉬룸의 맛있는 조합", img: "https://www.subway.co.kr/upload/menu/안창-비프&머쉬룸_20240912031749239.png", tag: "SUBPICK" },
  { ko: "스테이크 & 치즈", en: "Steak & Cheese", desc: "육즙이 쫙~ 풍부한 비프 스테이크의 풍미가 입안 한가득", img: "https://www.subway.co.kr/upload/menu/Steak-&-Cheese_20211231095455613.png", tag: "SUBPICK" },
  { ko: "이탈리안 비엠티", en: "Italian B.M.T.", desc: "페퍼로니, 살라미, 햄의 최상의 조화. 전세계가 사랑하는 베스트셀러", img: "https://www.subway.co.kr/upload/menu/Italian_B.M.T_20211231094910899.png", tag: "SUBPICK" },
  { ko: "로티세리 바비큐 치킨", en: "Rotisserie Barbecue Chicken", desc: "촉촉한 바비큐 치킨의 풍미가득. 손으로 찢어 더욱 부드러운 치킨의 혁명", img: "https://www.subway.co.kr/upload/menu/Rotisserie-Barbecue-Chicken_20211231023137878.png", tag: "SUBPICK" },
  { ko: "에그마요", en: "Egg Mayo", desc: "부드러운 달걀과 고소한 마요네즈가 만나 더 부드러운 스테디셀러", img: "https://www.subway.co.kr/upload/menu/Egg-Mayo_20211231094817112.png", tag: "SUBPICK" },
  { ko: "안창 비프", en: "Beef", desc: "써브웨이만의 특제 시즈닝을 더해 더 부드럽고 풍미있게 즐기는 프리미엄 샌드위치", img: "https://www.subway.co.kr/upload/menu/안창-비프_20240912031758775.png", tag: "SUBPICK" },
  { ko: "잠봉 플러스", en: "Jambon Plus", desc: "깊게 번지는 잠봉의 풍미를 더욱 풍성하게", img: "https://www.subway.co.kr/upload/menu/1775028694110_UEczXJ.png", tag: "NEW" },
  { ko: "치킨 베이컨 아보카도", en: "Chicken Bacon Avocado", desc: "담백한 치킨 슬라이스에 고소한 베이컨과 아보카도까지 건강하고 든든하게", img: "https://www.subway.co.kr/upload/menu/1775029949721_F6B8G2.png", tag: "SUBPICK" },
  { ko: "스파이시 쉬림프", en: "Spicy Shrimp", desc: "탱글한 쉬림프에 이국적인 시즈닝을 더해 색다른 매콤함을 만나보세요", img: "https://www.subway.co.kr/upload/menu/Spicy_Shrimp_front_20230703125534663.png", tag: "SUBPICK" },
  { ko: "쉬림프", en: "Shrimp", desc: "탱글한 쉬림프 5마리가 그대로, 신선하고 담백한 쉬림프의 맛", img: "https://www.subway.co.kr/upload/menu/Shrimp_front_20230703123439107.png", tag: "SUBPICK" },
  { ko: "로스트 치킨", en: "Roasted Chicken", desc: "오븐에 구워 담백한 저칼로리 닭가슴살의 건강한 풍미", img: "https://www.subway.co.kr/upload/menu/Roasted-Chicken_20211231095032718.png", tag: "SUBPICK" },
  { ko: "풀드포크 바비큐", en: "Pulled Pork Barbecue", desc: "미국 스타일의 풀드 포크 바비큐가 가득 들어간 샌드위치", img: "https://www.subway.co.kr/upload/menu/Pulled-Pork+cheese_20211231095012512.png", tag: "SUBPICK" },
  { ko: "써브웨이 클럽", en: "Subway Club", desc: "고소한 베이컨, 담백한 터키에 햄까지 더해 완벽해진 조화", img: "https://www.subway.co.kr/upload/menu/써브웨이 클럽(치킨)_20241107120457089.png", tag: "SUBPICK" },
  { ko: "치킨 데리야끼", en: "Chicken Teriyaki", desc: "담백한 치킨 스트립에 달콤짭쪼름한 특제 데리야끼 소스와의 환상적인 만남", img: "https://www.subway.co.kr/upload/menu/Chicken-Teriyaki_20211231094803381.png", tag: "SUBPICK" },
  { ko: "스파이시 이탈리안", en: "Spicy Italian", desc: "페퍼로니 & 살라미가 입안 가득, 부드러운 매콤함을 만나보세요", img: "https://www.subway.co.kr/upload/menu/spicy_italian_20211231095435532.png", tag: "SUBPICK" },
  { ko: "잠봉", en: "Jambon", desc: "깊게 번지는 잠봉의 풍미를 느껴보세요", img: "https://www.subway.co.kr/upload/menu/1775028649948_aR4ERo.png", tag: "NEW" },
  { ko: "비엘티", en: "B.L.T.", desc: "오리지널 아메리칸 스타일 베이컨의 풍미와 바삭함 그대로", img: "https://www.subway.co.kr/upload/menu/B.L.T_20211231094744175.png", tag: "SUBPICK" },
  { ko: "치킨 슬라이스", en: "Chicken Slice", desc: "담백한 치킨 슬라이스로 맛과 건강까지 한입에", img: "https://www.subway.co.kr/upload/menu/1775029900211_BC6sgL.png", tag: "SUBPICK" },
  { ko: "머쉬룸", en: "Mushroom", desc: "버섯의 건강함을 그대로 담아 신선한 야채와 함께 담백하게", img: "https://www.subway.co.kr/upload/menu/1757375591323_zQLUtM.png", tag: "SUBPICK" },
  { ko: "참치", en: "Tuna", desc: "남녀노소 누구나 좋아하는 담백한 참치와 고소한 마요네즈의 완벽한 조화", img: "https://www.subway.co.kr/upload/menu/Tuna_20211231095535268.png", tag: "SUBPICK" },
  { ko: "에그 슬라이스", en: "Egg Slice", desc: "달걀의 신선함과 담백함을 그대로 담아 맛도, 영양도 사로잡은 샌드위치", img: "https://www.subway.co.kr/upload/menu/subway-img01_20240304112313322.png", tag: "SUBPICK" },
  { ko: "베지", en: "Veggie Delite", desc: "갓 구운 빵과 신선한 8가지 야채로 즐기는 깔끔한 한끼", img: "https://www.subway.co.kr/upload/menu/Veggie-Delite_20211231095658375.png", tag: "SUBPICK" },
];

const BREADS = ["화이트", "위트", "허니오트", "파마산 오레가노", "하티", "플랫브레드"];
const CHEESES = ["아메리칸 치즈", "슈레드 치즈", "모차렐라 치즈", "치즈 제외"];
const VEGGIES = ["양상추", "토마토", "오이", "피망", "양파", "피클", "올리브", "할라피뇨"];
const SAUCES = ["스위트 어니언", "스위트 칠리", "랜치", "허니 머스타드", "옐로우 머스타드", "마요네즈", "스모크 바비큐", "핫 칠리", "사우스웨스트 치폴레", "홀스래디시", "올리브오일", "레드와인식초", "소금", "후추"];
const TOPPINGS = ["추가 없음", "미트 추가", "에그마요 추가", "오믈렛 추가", "아보카도 추가", "베이컨 추가", "페퍼로니 추가", "치즈 추가", "에그 슬라이스 추가"];
const SIZES = ["15cm", "30cm"];
