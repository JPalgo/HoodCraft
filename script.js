/* ============================================================
   HOODCRAFT — hoodcraft.pl
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     KONFIGURACJA — jedyne miejsce do ręcznej edycji
     ============================================================ */

  /*
    Adres sklepu Tebex.

    Dopóki jest tu pusty ciąg, zakładka Sklep pokazuje komunikat
    "SKLEP WKRÓTCE". Gdy sklep będzie gotowy, wpisz jego adres —
    najpierw darmową subdomenę z Tebeksa:

        var SHOP_URL = 'https://hoodcraft.tebex.io';

    a po wykupieniu Tebex Plus i podpięciu własnej subdomeny:

        var SHOP_URL = 'https://sklep.hoodcraft.pl';

    Nic więcej nie trzeba zmieniać — nagłówek, opis, przyciski
    i etykiety kart przestawią się same.
  */
  var SHOP_URL = '';

  /* ============================================================ */

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- Napis przecięty mieczem ------------------------
     Każde cięcie to trzy kopie tego samego tekstu. Treść piszesz
     tylko raz — w kopii oznaczonej [data-cut-source] — a pozostałe
     warstwy dostają ją stąd, żeby nie rozjechały się przy edycji. */

  function syncCuts() {
    $$('.cut').forEach(function (cut) {
      var source = $('[data-cut-source]', cut);
      if (!source) return;

      $$('.cut__half', cut).forEach(function (half) {
        if (half !== source) half.innerHTML = source.innerHTML;
      });
    });
  }

  syncCuts();

  /* ---------- Sklep ------------------------------------------
     Strona domyślnie stoi w trybie "wkrótce" — także wtedy, gdy
     JavaScript się nie wykona. Tryb sklepu włącza dopiero
     ustawiony SHOP_URL. */

  function setupShop() {
    var shop = $('.shop-page');
    if (!shop || !SHOP_URL) return;

    shop.classList.add('is-live');

    $$('[data-shop-soon]', shop).forEach(function (el) { el.hidden = true; });
    $$('[data-shop-live]', shop).forEach(function (el) { el.hidden = false; });
    $$('[data-store-link]').forEach(function (el) { el.href = SHOP_URL; });

    var source = $('[data-cut-source]', shop);
    var lines = source ? $$('.cut__line', source) : [];
    if (lines.length > 1) {
      lines[1].textContent = 'OTWARTY';
      syncCuts();
    }
  }

  setupShop();

  /* ---------- Zakładki: Główna / Sklep ---------------------- */

  var pages    = $$('.tab-page');
  var navLinks = $$('.nav-link');
  var navMenu  = $('#nav-menu');
  var navToggle = $('.nav-toggle');

  function closeMenu() {
    if (!navMenu) return;
    navMenu.classList.remove('is-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  }

  function openTab(name, opts) {
    var options = opts || {};
    if (!document.getElementById(name)) name = 'glowna';

    pages.forEach(function (page) {
      page.classList.toggle('active', page.id === name);
    });

    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.dataset.tab === name);
    });

    closeMenu();

    if (options.scrollTo) {
      scrollToSection(options.scrollTo);
    } else {
      window.scrollTo({ top: 0, behavior: options.instant ? 'auto' : 'smooth' });
    }

    if (!options.silent) {
      var hash = '#' + (options.scrollTo || name);
      if (options.replace) history.replaceState(null, '', hash);
      else if (location.hash !== hash) history.pushState(null, '', hash);
    }

    revealNow();
  }

  function scrollToSection(id) {
    var target = document.getElementById(id);
    if (!target) return;

    // sekcje żyją na stronie głównej — najpierw ją pokaż
    var page = target.closest('.tab-page');
    if (page && !page.classList.contains('active')) {
      openTab(page.id, { silent: true, instant: true });
    }

    requestAnimationFrame(function () {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  document.addEventListener('click', function (e) {
    var tabEl = e.target.closest('[data-tab]');
    if (tabEl) {
      e.preventDefault();
      openTab(tabEl.dataset.tab);
      return;
    }

    var scrollEl = e.target.closest('[data-scroll]');
    if (scrollEl) {
      e.preventDefault();
      var id = scrollEl.dataset.scroll;
      scrollToSection(id);
      closeMenu();
      if (location.hash !== '#' + id) history.pushState(null, '', '#' + id);
    }
  });

  window.addEventListener('popstate', function () {
    routeFromHash({ silent: true });
  });

  function routeFromHash(opts) {
    if (!pages.length) return;

    var options = opts || {};
    var hash = location.hash.replace('#', '');

    if (!hash) { openTab('glowna', { silent: true, instant: true }); return; }
    if (document.getElementById(hash) && $('.tab-page#' + CSS.escape(hash))) {
      openTab(hash, { silent: options.silent, instant: true });
      return;
    }
    if (document.getElementById(hash)) {
      openTab('glowna', { silent: true, instant: true });
      scrollToSection(hash);
      return;
    }
    openTab('glowna', { silent: true, instant: true });
  }

  /* ---------- Menu mobilne ---------------------------------- */

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.addEventListener('click', function (e) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- Pasek nawigacji po scrollu --------------------- */

  var navWrap = $('.nav-wrap');

  function onScroll() {
    if (navWrap) navWrap.classList.toggle('is-stuck', window.scrollY > 24);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Odliczanie do startu -------------------------- */

  var countdown = $('.countdown');

  if (countdown) {
    var deadline = new Date(countdown.dataset.deadline).getTime();
    var fields = {
      d: $('[data-cd="d"]', countdown),
      h: $('[data-cd="h"]', countdown),
      m: $('[data-cd="m"]', countdown),
      s: $('[data-cd="s"]', countdown)
    };

    var pad = function (n) { return n < 10 ? '0' + n : String(n); };

    var tick = function () {
      var left = deadline - Date.now();

      if (!isFinite(deadline)) return;

      if (left <= 0) {
        countdown.classList.add('is-live');
        countdown.innerHTML =
          '<span class="kicker">STATUS SERWERA</span>' +
          '<span class="countdown-live">SERWER WYSTARTOWAŁ</span>';
        clearInterval(timer);
        return;
      }

      var sec = Math.floor(left / 1000);
      fields.d.textContent = Math.floor(sec / 86400);
      fields.h.textContent = pad(Math.floor(sec / 3600) % 24);
      fields.m.textContent = pad(Math.floor(sec / 60) % 60);
      fields.s.textContent = pad(sec % 60);
    };

    var timer = setInterval(tick, 1000);
    tick();
  }

  /* ---------- Kopiowanie IP --------------------------------- */

  var toast = $('.toast');
  var toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-on'); }, 2200);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      var field = document.createElement('textarea');
      field.value = text;
      field.setAttribute('readonly', '');
      field.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(field);
      field.select();

      try {
        document.execCommand('copy') ? resolve() : reject();
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(field);
      }
    });
  }

  $$('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.dataset.copy;
      copyText(value).then(
        function () { showToast('Skopiowano: ' + value); },
        function () { showToast('Skopiuj ręcznie: ' + value); }
      );
    });
  });

  /* ---------- Wejście sekcji przy scrollu -------------------- */

  var reveals = $$('.reveal');
  var observer = null;

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: .06 });

    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  // po zmianie zakładki elementy widoczne od razu muszą się pokazać
  function revealNow() {
    if (!observer) return;
    reveals.forEach(function (el) {
      if (el.classList.contains('is-in')) return;
      var box = el.getBoundingClientRect();
      if (box.top < window.innerHeight && box.bottom > 0) {
        el.classList.add('is-in');
        observer.unobserve(el);
      }
    });
  }

  /* ---------- Drobiazgi ------------------------------------- */

  var year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  routeFromHash({ silent: true });
})();
