/* =========================================================
   명가삼대떡집 시안 · 공통 스크립트
   ========================================================= */

/* ---------- 주문 배너 롤링 (3초 간격) ---------- */
/* ---------- 주문 배너 (5초 자동 롤링 + 손 드래그) ---------- */
(function () {
  var wrap = document.getElementById('orderBanner');
  if (!wrap) return;
  var slides = wrap.querySelectorAll('.ob-slide');
  if (slides.length < 2) return;

  var cur = 0, timer = null, startX = null, moved = 0;

  function show(i) {
    slides[cur].classList.remove('is-on');
    cur = (i % slides.length + slides.length) % slides.length;
    slides[cur].classList.add('is-on');
  }
  function start() { stop(); timer = setInterval(function () { show(cur + 1); }, 5000); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  start();

  wrap.addEventListener('pointerdown', function (e) {
    startX = e.clientX; moved = 0; stop();
  });
  wrap.addEventListener('pointermove', function (e) {
    if (startX !== null) moved = e.clientX - startX;
  });
  function endDrag() {
    if (startX === null) return;
    if (Math.abs(moved) > 40) show(cur + (moved < 0 ? 1 : -1));
    startX = null;
    start();
  }
  wrap.addEventListener('pointerup', endDrag);
  wrap.addEventListener('pointercancel', endDrag);
  wrap.addEventListener('pointerleave', endDrag);

  // 드래그(8px 초과 이동)면 링크 이동 막기 — 탭은 정상 동작
  wrap.addEventListener('click', function (e) {
    if (Math.abs(moved) > 8) { e.preventDefault(); }
  });
})();


/* ---------- 검색창 토글 (상단 고정 펼침) ---------- */
(function () {
  var bar = document.getElementById('searchbar');
  if (!bar) return;
  var toggles = document.querySelectorAll('.js-search-toggle');
  var input = bar.querySelector('input');
  var closeBtn = document.getElementById('searchClose');

  function open() {
    bar.classList.add('open');
    if (input) setTimeout(function () { input.focus(); }, 60);
  }
  function close() { bar.classList.remove('open'); }

  for (var i = 0; i < toggles.length; i++) {
    toggles[i].addEventListener('click', function (e) {
      e.preventDefault();
      if (bar.classList.contains('open')) close(); else open();
    });
  }
  if (closeBtn) closeBtn.addEventListener('click', close);
  // ESC로 닫기
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();

/* ---------- 햄버거 메뉴 ---------- */
(function () {
  var menu = document.getElementById('menu');
  var openBtn = document.getElementById('openMenu');
  var closeBtn = document.getElementById('closeMenu');
  if (openBtn && menu) {
    openBtn.addEventListener('click', function () {
      menu.classList.add('open');
      menu.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menu-open');
      menu.scrollTop = 0;
    });
  }
  if (closeBtn && menu) {
    closeBtn.addEventListener('click', function () {
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
    });
  }
})();

/* ---------- 특가 카운트다운 ---------- */
function startCountdown(seconds) {
  var hh = document.getElementById('hh');
  var mm = document.getElementById('mm');
  var ss = document.getElementById('ss');
  if (!hh || !mm || !ss) return;
  var reset = seconds;
  var total = seconds;
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function tick() {
    if (total <= 0) total = reset;
    total--;
    hh.textContent = pad(Math.floor(total / 3600));
    mm.textContent = pad(Math.floor((total % 3600) / 60));
    ss.textContent = pad(total % 60);
  }
  tick();
  setInterval(tick, 1000);
}

/* ---------- 상품 카드 HTML ---------- */
function productCardHTML(p) {
  var img = prodImg(p, 'medium');
  var rate = discountRate(p);
  var thumb;
  if (img) {
    thumb = '<div class="thumb"><img src="' + img + '" alt="' + p.full +
            '" loading="lazy" onerror="this.parentNode.classList.add(\'tone-' + p.tone +
            '\');this.remove();"></div>';
  } else {
    thumb = '<div class="thumb tone-' + p.tone + '"><span>' + p.name + '</span></div>';
  }
  var badges = '';
  if (p.soldout) badges = '<span class="tag sold">품절</span>';
  else if (p.badge && p.badge.length) badges = '<span class="tag">' + p.badge[0] + '</span>';

  return '' +
    '<a class="prod' + (p.soldout ? ' is-sold' : '') + '" href="product.html?no=' + p.no + '">' +
      '<div class="thumb-wrap">' + thumb + badges + '</div>' +
      '<div class="info">' +
        '<p class="name">' + p.name + '</p>' +
        '<div class="price">' +
          (rate ? '<span class="off">' + rate + '%</span>' : '') +
          '<span class="now">' + won(p.now) + '</span>' +
          (p.was > p.now ? '<span class="was">' + won(p.was) + '</span>' : '') +
        '</div>' +
      '</div>' +
    '</a>';
}

/* ---------- 특가 그리드 (홈) ---------- */
function renderSpecialGrid(elId, nos) {
  var el = document.getElementById(elId);
  if (!el) return;
  var html = '';
  for (var i = 0; i < nos.length; i++) {
    var p = findProduct(nos[i]);
    if (p) html += productCardHTML(p);
  }
  el.innerHTML = html;
}

/* ---------- 전체 상품 그리드 (목록) ---------- */
function renderProductGrid(elId, list) {
  var el = document.getElementById(elId);
  if (!el) return;
  list = list || PRODUCTS;
  var html = '';
  for (var i = 0; i < list.length; i++) {
    html += productCardHTML(list[i]);
  }
  el.innerHTML = html;
  var countEl = document.getElementById('listCount');
  if (countEl) countEl.textContent = list.length;
}

/* ---------- URL 쿼리 헬퍼 ---------- */
function getQuery(key) {
  var m = new RegExp('[?&]' + key + '=([^&]+)').exec(location.search);
  return m ? decodeURIComponent(m[1]) : null;
}

/* ---------- 상품 상세 렌더 ---------- */
function renderProductDetail() {
  var no = getQuery('no') || 190;
  var p = findProduct(no);
  if (!p) return;

  document.title = p.full + ' · 명가삼대떡집';

  var hero = document.getElementById('pdHero');
  var big = prodImg(p, 'big');
  if (hero) {
    if (big) {
      hero.innerHTML = '<img src="' + big + '" alt="' + p.full +
        '" onerror="this.parentNode.classList.add(\'tone-' + p.tone + '\');this.remove();">';
    } else {
      hero.classList.add('tone-' + p.tone);
      hero.innerHTML = '<span>' + p.name + '</span>';
    }
  }

  setText('pdName', p.full);
  setText('pdWas', won(p.was));
  setText('pdNow', won(p.now));
  var rate = discountRate(p);
  var rateEl = document.getElementById('pdRate');
  if (rateEl) rateEl.textContent = rate ? rate + '%' : '';

  // 옵션 채우기
  var sel = document.getElementById('pdOption');
  if (sel && p.opts) {
    var oh = '<option value="">- 옵션을 선택해 주세요 -</option>';
    for (var i = 0; i < p.opts.length; i++) {
      oh += '<option value="' + i + '">' + p.opts[i] + '</option>';
    }
    sel.innerHTML = oh;
  }

  // 뱃지
  var badgeEl = document.getElementById('pdBadge');
  if (badgeEl) {
    badgeEl.innerHTML = (p.badge || []).map(function (b) {
      return '<span class="tag">' + b + '</span>';
    }).join('');
  }
}

function setText(id, text) {
  var el = document.getElementById(id);
  if (el) el.textContent = text;
}

/* ---------- 수량 조절 ---------- */
function bindQty() {
  var input = document.getElementById('qtyInput');
  var minus = document.getElementById('qtyMinus');
  var plus = document.getElementById('qtyPlus');
  if (!input) return;
  function clamp(v) { return Math.max(1, Math.min(99, v || 1)); }
  if (minus) minus.addEventListener('click', function () {
    input.value = clamp(parseInt(input.value, 10) - 1);
  });
  if (plus) plus.addEventListener('click', function () {
    input.value = clamp(parseInt(input.value, 10) + 1);
  });
  input.addEventListener('change', function () {
    input.value = clamp(parseInt(input.value, 10));
  });
}
