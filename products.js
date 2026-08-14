/* =========================================================
   명가삼대떡집 시안 · 상품 데이터
   - img: Cafe24 CDN 이미지 해시 (없으면 null → 그라데이션 썸네일)
   - 이미지 URL 규칙:
       https://ecimg.cafe24img.com/pg838b47736579015/rhgurwls1/web/product/{size}/{date}/{hash}
       size: big / medium / small / tiny
   ========================================================= */

var IMG_BASE = 'https://ecimg.cafe24img.com/pg838b47736579015/rhgurwls1/web/product';

// 상품 이미지 URL 생성 (size 기본 medium)
function prodImg(p, size) {
  if (!p || !p.img) return null;
  size = size || 'medium';
  return IMG_BASE + '/' + size + '/' + p.img.date + '/' + p.img.hash;
}

// 그라데이션 색상 팔레트 (이미지 없는 상품용)
var THUMB_TONES = ['corn', 'pumpkin', 'green', 'brown', 'rice'];

var PRODUCTS = [
  { no:190, name:'초당옥수수 설기', full:'옥수수 함량 50% 듬뿍 초당옥수수 설기',
    was:28000, now:18500, tone:'corn', badge:['베스트'],
    slug:'옥수수-함량-50-듬뿍-초당옥수수-설기',
    img:{date:'20260714', hash:'63aa9ec43153a8ce3d11d5b5848fd3ee.jpg'},
    opts:['초당옥수수 설기 100g x 10개입 (1kg)','초당옥수수 설기 100g x 20개입 (2kg)'] },

  { no:192, name:'밤호박 설기', full:'해남 밤호박을 듬뿍 넣은 밤호박 설기',
    was:26900, now:18500, tone:'pumpkin', badge:['베스트'],
    slug:'해남-밤호박을-듬뿍-넣은-밤호박-설기',
    img:{date:'20260722', hash:'a4b45cd52fd0165c1aff6b1ddceda563.png'},
    opts:['밤호박 설기 100g x 10개 (1kg)','밤호박 설기 100g x 20개 (2kg)'] },

  { no:66, name:'쌀 카스테라 호박인절미', full:'명가삼대떡집 쌀 카스테라 호박인절미',
    was:22000, now:16900, tone:'pumpkin', badge:['당일한정'],
    slug:'명가삼대떡집-쌀-카스테라-호박인절미',
    img:{date:'20260729', hash:'f781c51d2153a1fb4a4b7ad2e0e296ef.jpg'},
    opts:['쌀 카스테라 호박인절미 1박스 (800g)','쌀 카스테라 호박인절미 2박스 (1.6kg)'] },

  { no:40, name:'쑥인절미 + 콩고물 증정', full:'명가삼대떡집 쑥인절미 + 콩고물 증정',
    was:17400, now:12500, tone:'green', badge:['베스트'],
    slug:'명가삼대떡집-쑥인절미-콩고물-증정',
    img:{date:'20260427', hash:'c14257c61efb9783bcec70bdb2955e29.jpg'},
    opts:['쑥인절미 1kg + 콩고물 150g 증정','쑥인절미 2kg + 콩고물 150g 증정'] },

  { no:68, name:'포슬포슬 쑥설기', full:'진도 해풍 쑥을 듬뿍 넣은 포슬포슬한 쑥설기',
    was:23000, now:15900, tone:'green', badge:[],
    slug:'진도-해풍-쑥을-듬뿍-넣은-포슬포슬한-쑥설기', img:null,
    opts:['쑥설기 1kg','쑥설기 2kg'] },

  { no:50, name:'쫀득쫀득 콩달떡', full:'통팥 앙금이 듬뿍 들어간 쫀득쫀득 콩달떡',
    was:16500, now:12600, tone:'brown', badge:[],
    slug:'통팥-앙금이-듬뿍-들어간-쫀득쫀득-콩달떡', img:null,
    opts:['콩달떡 10개입','콩달떡 20개입'] },

  { no:61, name:'대추고 수제 약밥', full:'수제로 만들어 더 맛있는 대추고 약밥',
    was:33000, now:16900, tone:'brown', badge:[],
    slug:'수제로-만들어-더-맛있는-대추고-약밥', img:null,
    opts:['약밥 5개입','약밥 10개입'] },

  { no:110, name:'5가지 콩설기', full:'[한정수량] 5가지 콩을 아낌없이 가득 넣은 콩설기',
    was:22000, now:15900, tone:'rice', badge:['한정수량'],
    slug:'한정수량-5가지-콩을-아낌없이-가득-넣은-콩설기', img:null,
    opts:['콩설기 1kg','콩설기 2kg'] },

  { no:111, name:'코코넛 눈꽃 대왕모찌', full:'SNS에서 난리난 코코넛 눈꽃 콩달떡 찹쌀떡 대왕모찌',
    was:28000, now:15900, tone:'rice', badge:['인기'],
    slug:'sns에서-난리난-코코넛-눈꽃-콩달떡-찹쌀떡-대왕모찌', img:null,
    opts:['대왕모찌 6개입','대왕모찌 12개입'] },

  { no:102, name:'모둠녹두볼떡', full:'먹으면 복이 오는 제주송편 굳지 않는 모둠녹두볼떡',
    was:23000, now:14900, tone:'green', badge:[],
    slug:'먹으면-복이-오는-제주송편-굳지-않는-모둠녹두볼떡', img:null,
    opts:['모둠녹두볼떡 1팩','모둠녹두볼떡 2팩'] },

  { no:185, name:'초당옥수수 인절미', full:'옥수수가 톡톡 터지는 쌀 카스테라 초당옥수수 인절미',
    was:26000, now:13900, tone:'corn', badge:['인기'],
    slug:'옥수수가-톡톡-터지는-쌀-카스테라-초당옥수수-인절미', img:null,
    opts:['초당옥수수 인절미 1박스','초당옥수수 인절미 2박스'] },

  { no:196, name:'곤드레약밥', full:'국내산 무농약 곤드레가 듬뿍 들어간 곤드레약밥',
    was:29000, now:17900, tone:'green', badge:[],
    slug:'국내산-무농약-곤드레가-듬뿍-들어간-곤드레약밥', img:null,
    opts:['곤드레약밥 5개입','곤드레약밥 10개입'] },

  { no:191, name:'들깨 절편', full:'고소한 들깨가 듬뿍 들어간 들깨 절편',
    was:21000, now:13900, tone:'brown', badge:[],
    slug:'고소한-들깨가-듬뿍-들어간-들깨-절편', img:null,
    opts:['들깨 절편 1kg','들깨 절편 2kg'] },

  { no:84, name:'단호박 시루떡', full:'단호박이 통째로 들어간 단호박 시루떡',
    was:26500, now:18500, tone:'pumpkin', badge:[], soldout:true,
    slug:'단호박이-통째로-들어간-단호박-시루떡', img:null,
    opts:['단호박 시루떡 1호','단호박 시루떡 2호'] }
];

// 상품번호로 조회
function findProduct(no) {
  no = Number(no);
  for (var i = 0; i < PRODUCTS.length; i++) {
    if (PRODUCTS[i].no === no) return PRODUCTS[i];
  }
  return null;
}

// 할인율 계산
function discountRate(p) {
  if (!p.was || p.was <= p.now) return 0;
  return Math.round((p.was - p.now) / p.was * 100);
}

// 가격 포맷 (11900 → 11,900원)
function won(n) {
  return Number(n).toLocaleString('ko-KR') + '원';
}
