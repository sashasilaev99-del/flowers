// Цветочная лавка «Букет» — каталог, фильтры, модальное окно, корзина
(function () {
  'use strict';

  /* ---------- Утилиты ---------- */
  // Экранирование перед вставкой в HTML (защита от XSS,
  // если данные позже будут приходить из таблицы или API)
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatPrice(value) {
    return value.toLocaleString('ru-RU') + ' ₽';
  }

  function pluralize(n, forms) {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return forms[0];
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
    return forms[2];
  }

  /* ---------- Мобильное меню ---------- */
  const header = document.querySelector('.header');
  const burger = document.querySelector('.burger');
  const nav = document.getElementById('nav');

  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('no-scroll', open);
  }

  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      setMenu(false);
    });
  });

  window.matchMedia('(min-width: 769px)').addEventListener('change', function (e) {
    if (e.matches) setMenu(false);
  });

  window.addEventListener('scroll', function () {
    header.classList.toggle('header--scrolled', window.scrollY > 10);
  }, { passive: true });

  /* ---------- Корзина (счётчик в localStorage) ---------- */
  const CART_KEY = 'buket-cart';
  const cartCount = document.getElementById('cart-count');
  let cart = [];

  try {
    cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    if (!Array.isArray(cart)) cart = [];
  } catch (e) {
    cart = [];
  }

  function renderCart() {
    cartCount.textContent = cart.length;
  }

  function addToCart(id, button) {
    cart.push(id);
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      // localStorage недоступен (приватный режим) — счётчик всё равно работает
    }
    renderCart();

    if (button) {
      const original = button.textContent;
      button.textContent = 'Добавлено ✓';
      button.disabled = true;
      setTimeout(function () {
        button.textContent = original;
        button.disabled = false;
      }, 1200);
    }
  }

  renderCart();

  /* ---------- Каталог ---------- */
  const grid = document.getElementById('catalog-grid');
  const counter = document.getElementById('catalog-count');
  const filterButtons = document.querySelectorAll('.filter-btn');

  function cardTemplate(product) {
    const title = escapeHtml(product.title);
    const badge = product.badge
      ? '<span class="product-card__badge">' + escapeHtml(product.badge) + '</span>'
      : '';

    return (
      '<article class="product-card" data-id="' + product.id + '">' +
        '<div class="product-card__img-wrap">' +
          '<img class="product-card__img" src="' + escapeHtml(product.image) + '" alt="' + title + '" loading="lazy" width="700" height="520">' +
          badge +
        '</div>' +
        '<div class="product-card__content">' +
          '<p class="product-card__category">' + escapeHtml(CATEGORY_NAMES[product.category]) + '</p>' +
          '<h3 class="product-card__title">' + title + '</h3>' +
          '<p class="product-card__desc">' + escapeHtml(product.description) + '</p>' +
          '<p class="product-card__price">' + formatPrice(product.price) + '</p>' +
          '<div class="product-card__actions">' +
            '<button class="btn btn--ghost btn--small" type="button" data-action="details" aria-label="Подробнее: ' + title + '">Подробнее</button>' +
            '<button class="btn btn--primary btn--small" type="button" data-action="cart" aria-label="В корзину: ' + title + '">В корзину</button>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function renderCatalog(filter) {
    const items = filter === 'all'
      ? PRODUCTS
      : PRODUCTS.filter(function (p) { return p.category === filter; });

    grid.innerHTML = items.length
      ? items.map(cardTemplate).join('')
      : '<p class="catalog-empty">В этой категории пока нет товаров.</p>';

    counter.textContent = 'Показано ' + items.length + ' ' +
      pluralize(items.length, ['товар', 'товара', 'товаров']);
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      renderCatalog(btn.dataset.filter);
    });
  });

  // Делегирование: один обработчик на всю сетку
  grid.addEventListener('click', function (event) {
    const card = event.target.closest('.product-card');
    if (!card) return;

    const id = Number(card.dataset.id);
    const actionBtn = event.target.closest('[data-action]');

    if (actionBtn && actionBtn.dataset.action === 'cart') {
      addToCart(id, actionBtn);
      return;
    }

    // «Подробнее» или клик по карточке открывает модалку
    openModal(id, card.querySelector('[data-action="details"]'));
  });
  /* ---------- Модальное окно ---------- */
  const modal = document.getElementById('product-modal');
  const modalBody = document.getElementById('modal-body');
  let lastFocused = null;

  function modalTemplate(product) {
    const composition = product.composition
      .map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; })
      .join('');

    return (
      '<div class="modal-product">' +
        '<img class="modal-product__img" src="' + escapeHtml(product.image) + '" alt="' + escapeHtml(product.title) + '">' +
        '<div class="modal-product__info">' +
          '<p class="product-card__category">' + escapeHtml(CATEGORY_NAMES[product.category]) + '</p>' +
          '<h3 id="modal-title" class="modal-product__title">' + escapeHtml(product.title) + '</h3>' +
          '<p>' + escapeHtml(product.description) + '</p>' +
          '<div><strong>Состав:</strong><ul class="modal-product__list">' + composition + '</ul></div>' +
          '<p><strong>Размер:</strong> ' + escapeHtml(product.size) + '</p>' +
          '<p class="modal-product__price">' + formatPrice(product.price) + '</p>' +
          '<button class="btn btn--primary" type="button" data-modal-cart="' + product.id + '">Добавить в корзину</button>' +
        '</div>' +
      '</div>'
    );
  }

  function getFocusable() {
    return Array.prototype.slice.call(
      modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter(function (el) { return !el.disabled; });
  }

  function openModal(id, trigger) {
    const product = PRODUCTS.find(function (p) { return p.id === id; });
    if (!product) return;

    lastFocused = trigger || document.activeElement;
    modalBody.innerHTML = modalTemplate(product);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    modal.querySelector('.modal__close').focus();
  }

  function closeModal() {
    if (!modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (lastFocused) lastFocused.focus();
  }

  modal.addEventListener('click', function (event) {
    if (event.target.closest('[data-close]')) {
      closeModal();
      return;
    }
    const cartBtn = event.target.closest('[data-modal-cart]');
    if (cartBtn) addToCart(Number(cartBtn.dataset.modalCart), cartBtn);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      if (modal.classList.contains('is-open')) closeModal();
      else if (nav.classList.contains('is-open')) {
        setMenu(false);
        burger.focus();
      }
      return;
    }

    // Удерживаем фокус внутри открытой модалки (focus trap)
    if (event.key === 'Tab' && modal.classList.contains('is-open')) {
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  /* ---------- Старт ---------- */
  renderCatalog('all');
})();
