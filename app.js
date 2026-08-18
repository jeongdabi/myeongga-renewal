/* =========================================================
   명가삼대떡집 시안 · 공통 스크립트
   ========================================================= */

/* ---------- 주문 배너 (자동 롤링 + 손 드래그/스와이프) ---------- */
(function () {
  var wrap = document.getElementById('orderBanner');
  if (!wrap) return;
  var slides = wrap.querySelectorAll('.ob-slide');
  if (slides.length < 2) return;
  var idx = 0, timer = null, st = null;
  var down = false, moved = false, startX = 0, startScroll = 0;
  function go(n) {
    idx = (n % slides.length + slides.length) % slides.length;
    wrap.scrollTo({ left: idx * wrap.clientWidth, behavior: 'smooth' });
  }
  function start() { stop(); timer = setInterval(function () { go(idx + 1); }, 5000); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function snap() { idx = Math.round(wrap.scrollLeft / wrap.clientWidth); go(idx); }
  wrap.addEventListener('scroll', function () {
    stop(); clearTimeout(st);
    st = setTimeout(function () { idx = Math.round(wrap.scrollLeft / wrap.clientWidth); start(); }, 700);
  }, { passive: true });
  // 마우스로 잡아끌어 넘기기 (터치는 브라우저 기본 스와이프 사용)
  wrap.addEventListener('pointerdown', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    down = true; moved = false; startX = e.clientX; startScroll = wrap.scrollLeft;
    stop(); wrap.classList.add('dragging');
    try { wrap.setPointerCapture(e.pointerId); } catch (x) {}
  });
  wrap.addEventListener('pointermove', function (e) {
    if (!down) return;
    var dx = e.clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    wrap.scrollLeft = startScroll - dx;
  });
  function up() {
    if (!down) return;
    down = false; wrap.classList.remove('dragging'); snap(); start();
  }
  wrap.addEventListener('pointerup', up);
  wrap.addEventListener('pointercancel', up);
  wrap.addEventListener('pointerleave', up);
  // PC: 링크 네이티브 드래그(고스트) 차단
  wrap.addEventListener('dragstart', function (e) { e.preventDefault(); });
  wrap.addEventListener('click', function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);
  start();
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

/* ---------- 메뉴 띠배너: 페이지가 스크롤되어 띠배너가 사라지면 메뉴에서도 숨김 ---------- */
(function () {
  var menuTopbar = document.querySelector('#menu .topbar');
  var pageTopbar = document.querySelector('.topbar'); // 첫 번째 = 페이지 상단 띠배너
  var openBtn = document.getElementById('openMenu');
  if (!menuTopbar || !pageTopbar) return;
  function sync() {
    var visible = pageTopbar.getBoundingClientRect().bottom > 0;
    menuTopbar.style.display = visible ? '' : 'none';
  }
  window.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  if (openBtn) openBtn.addEventListener('click', sync);
  sync();
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

  return '' +
    '<a class="prod' + (p.soldout ? ' is-sold' : '') + '" href="product.html?no=' + p.no + '">' +
      '<div class="thumb-wrap">' + thumb + badges + '</div>' +
      '<div class="info">' +
        '<p class="name">' + p.name + '</p>' +
        '<div class="price">' +
          (p.was > p.now ? '<span class="was">' + won(p.was) + '</span>' : '') +
          '<span class="line">' +
            (rate ? '<span class="off">' + rate + '%</span>' : '') +
            '<span class="now">' + won(p.now) + '</span>' +
          '</span>' +
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


/* ---------- 오늘의 한정 수량 (홈) ---------- */
function renderLimited(elId, no) {
  var el = document.getElementById(elId);
  if (!el) return;
  var p = findProduct(no);
  if (!p) return;
  var img = prodImg(p, 'big');
  var rate = discountRate(p);
  var thumb = img
    ? '<div class="thumb"><img src="' + img + '" alt="' + p.full + '" onerror="this.parentNode.classList.add(\'tone-' + p.tone + '\');this.remove();"></div>'
    : '<div class="thumb tone-' + p.tone + '"><span>' + p.name + '</span></div>';
  el.innerHTML =
    '<a class="big" href="product.html?no=' + p.no + '">' + thumb +
      '<div class="info"><p class="name">' + p.name + '</p>' +
      '<div class="price">' +
        (p.was > p.now ? '<span class="was">' + won(p.was) + '</span>' : '') +
        (rate ? '<span class="off">' + rate + '%</span>' : '') +
        '<span class="now">' + won(p.now) + '</span>' +
      '</div></div></a>';
}


/* ---------- 한정 시간 특가 (세로 리스트) ---------- */
function renderLimitedTime(elId, nos) {
  var el = document.getElementById(elId);
  if (!el) return;
  var html = '';
  for (var i = 0; i < nos.length; i++) {
    var p = findProduct(nos[i]);
    if (!p) continue;
    var img = prodImg(p, 'medium');
    var rate = discountRate(p);
    var thumb = img
      ? '<div class="lt-thumb"><img src="' + img + '" alt="' + p.full + '" onerror="this.parentNode.classList.add(\'tone-' + p.tone + '\');this.remove();"></div>'
      : '<div class="lt-thumb tone-' + p.tone + '"><span>' + p.name + '</span></div>';
    html +=
      '<a class="lt-card" href="product.html?no=' + p.no + '">' + thumb +
        '<div class="lt-info">' +
          '<p class="lt-name">' + p.name + '</p>' +
          '<div class="price">' +
            (p.was > p.now ? '<span class="was">' + won(p.was) + '</span>' : '') +
            '<span class="line">' +
              (rate ? '<span class="off">' + rate + '%</span>' : '') +
              '<span class="now">' + won(p.now) + '</span>' +
            '</span>' +
          '</div>' +
          '<span class="lt-buy">구매하기 &gt;</span>' +
        '</div>' +
      '</a>';
  }
  el.innerHTML = html;
}

/* ---------- 한정 수량 특가 (2x2 + 롤링 배지) ---------- */
function renderLimitedQty(elId, nos) {
  var el = document.getElementById(elId);
  if (!el) return;
  var html = '';
  for (var i = 0; i < nos.length; i++) {
    var p = findProduct(nos[i]);
    if (!p) continue;
    var img = prodImg(p, 'medium');
    var rate = discountRate(p);
    var save = p.was - p.now;
    var stock = p.stock || 100;
    var inner = img
      ? '<img src="' + img + '" alt="' + p.full + '" onerror="this.parentNode.classList.add(\'tone-' + p.tone + '\');this.remove();">'
      : '<span class="ph-name">' + p.name + '</span>';
    html +=
      '<a class="lq-card" href="product.html?no=' + p.no + '">' +
        '<div class="lq-thumb' + (img ? '' : ' tone-' + p.tone) + '">' + inner + '</div>' +
        '<div class="lq-roll"><div class="lq-track">' +
          '<span>' + stock + '개 남음</span>' +
          '<span>지금 사면 ' + won(save) + ' 할인</span>' +
          '<span>' + stock + '개 남음</span>' +
        '</div></div>' +
        '<div class="lq-info">' +
          '<p class="name">' + p.name + '</p>' +
          '<div class="price">' +
            (p.was > p.now ? '<span class="was">' + won(p.was) + '</span>' : '') +
            '<span class="line">' +
              (rate ? '<span class="off">' + rate + '%</span>' : '') +
              '<span class="now">' + won(p.now) + '</span>' +
            '</span>' +
          '</div>' +
        '</div>' +
      '</a>';
  }
  el.innerHTML = html;
}
