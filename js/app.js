(function () {
  const state = {
    category: "all",
    sizes: new Set(),
    search: "",
    sort: "featured",
  };

  const els = {
    productGrid: document.getElementById("productGrid"),
    resultCount: document.getElementById("resultCount"),
    emptyState: document.getElementById("emptyState"),
    sizeFilters: document.getElementById("sizeFilters"),
    search: document.getElementById("search"),
    sortSelect: document.getElementById("sortSelect"),
    cartTrigger: document.getElementById("cartTrigger"),
    cartBadge: document.getElementById("cartBadge"),
    cartDrawer: document.getElementById("cartDrawer"),
    cartItems: document.getElementById("cartItems"),
    cartTotalQty: document.getElementById("cartTotalQty"),
    cartClose: document.getElementById("cartClose"),
    overlay: document.getElementById("overlay"),
    whatsappBtn: document.getElementById("whatsappBtn"),
    productModal: document.getElementById("productModal"),
    modalContent: document.getElementById("modalContent"),
    clearFilters: document.getElementById("clearFilters"),
    menuToggle: document.getElementById("menuToggle"),
    year: document.getElementById("year"),
  };

  Cart.load();

  function getFilteredProducts() {
    let list = [...PRODUCTS];

    if (state.category !== "all") {
      list = list.filter((p) => p.category === state.category);
    }
    if (state.sizes.size > 0) {
      list = list.filter((p) => p.sizes.some((s) => state.sizes.has(s)));
    }
    if (state.search.trim()) {
      const q = state.search.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    switch (state.sort) {
      case "newest":
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price":
        list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        break;
      default:
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return list;
  }

  function parsePrice(str) {
    const m = String(str).match(/[\d.]+/);
    return m ? parseFloat(m[0]) : 0;
  }

  function renderFilters() {
    const sizes = getUniqueSizes(PRODUCTS);
    els.sizeFilters.innerHTML = sizes
      .map(
        (s) =>
          `<button type="button" class="chip${state.sizes.has(s) ? " is-active" : ""}" data-size="${escapeAttr(s)}">${escapeHtml(s)}</button>`
      )
      .join("");
  }

  function renderProducts() {
    const list = getFilteredProducts();
    els.resultCount.textContent = `${list.length} product${list.length === 1 ? "" : "s"}`;
    els.emptyState.hidden = list.length > 0;

    els.productGrid.innerHTML = list
      .map((p) => {
        const badge = p.isNew ? "New" : p.featured ? "Hot" : "";
        const badgeClass = p.isNew ? "product-card__badge product-card__badge--new" : "product-card__badge";
        return `
        <article class="product-card" role="listitem" data-id="${p.id}">
          <div class="product-card__img-wrap">
            ${badge ? `<span class="${badgeClass}">${badge}</span>` : ""}
            <img src="${p.image}" alt="${escapeAttr(p.name)}" loading="lazy" />
            <div class="product-card__quick">
              <button type="button" class="btn btn--primary btn--sm btn--full" data-add-quick="${p.id}">Add to quote</button>
            </div>
          </div>
          <p class="product-card__cat">${escapeHtml(CATEGORY_LABELS[p.category] || p.category)}</p>
          <h3 class="product-card__name">${escapeHtml(p.name)}</h3>
          <dl class="product-card__specs">
            <div><dt>Price</dt><dd>${escapeHtml(p.price)}</dd></div>
            <div><dt>MOQ</dt><dd>${escapeHtml(formatMoq(p))}</dd></div>
            <div><dt>CBM</dt><dd>${escapeHtml(formatCbm(p))}</dd></div>
          </dl>
          <p class="product-card__sizes">Sizes: ${p.sizes.join(" / ")}</p>
          <p class="product-card__colors">Styles: ${p.colors.join(" · ")}</p>
        </article>`;
      })
      .join("");

    bindProductCards();
    bindGridImages();
  }

  function bindGridImages() {
    els.productGrid.querySelectorAll("[data-product-image]").forEach((img) => {
      applyProductImage(img, img.getAttribute("data-product-image"));
    });
  }

  function bindProductCards() {
    els.productGrid.querySelectorAll(".product-card").forEach((card) => {
      const id = card.dataset.id;
      card.addEventListener("click", (e) => {
        if (e.target.closest("[data-add-quick]")) {
          e.stopPropagation();
          openModal(id);
          return;
        }
        openModal(id);
      });
    });
    els.productGrid.querySelectorAll("[data-add-quick]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openModal(btn.dataset.addQuick);
      });
    });
  }

  function openModal(productId) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    let selectedSize = product.sizes[0];
    let selectedColor = product.colors[0];
    let quantity = product.moq;
    const moqUnit = product.moqUnit || "pcs";

    els.modalContent.innerHTML = `
      <button type="button" class="modal__close" aria-label="Close">&times;</button>
      <div class="modal__gallery">
        <img id="modalProductImage" src="${product.image}" alt="${escapeAttr(product.name)}" />
      </div>
      <div class="modal__info">
        <p class="modal__cat" id="modalTitle">${escapeHtml(CATEGORY_LABELS[product.category])}</p>
        <h2 class="modal__title">${escapeHtml(product.name)}</h2>
        <dl class="modal__specs">
          <div><dt>Price</dt><dd>${escapeHtml(product.price)}</dd></div>
          <div><dt>MOQ</dt><dd>${escapeHtml(formatMoq(product))}</dd></div>
          <div><dt>CBM</dt><dd>${escapeHtml(formatCbm(product))}</dd></div>
          <div><dt>Sizes</dt><dd>${escapeHtml(product.sizes.join(", "))}</dd></div>
        </dl>
        ${product.remarks ? `<p class="modal__remarks">${escapeHtml(product.remarks)}</p>` : ""}
        <div class="modal__field">
          <label>Size</label>
          <div class="size-picker" id="modalSizes"></div>
        </div>
        <div class="modal__field">
          <label>Color / style</label>
          <div class="color-picker" id="modalColors"></div>
        </div>
        <div class="modal__field">
          <label>Quantity <span class="modal__hint">(MOQ ${product.moq} ${moqUnit})</span></label>
          <div class="qty-row">
            <button type="button" class="qty-btn" id="modalQtyMinus">−</button>
            <span id="modalQty" class="cart-item__qty">${quantity}</span>
            <button type="button" class="qty-btn" id="modalQtyPlus">+</button>
          </div>
          <p class="modal__moq-note" id="moqWarning" hidden></p>
        </div>
        <div class="modal__actions">
          <button type="button" class="btn btn--primary btn--full" id="modalAddCart">Add to quote list</button>
        </div>
      </div>`;

    const sizePicker = els.modalContent.querySelector("#modalSizes");
    const colorPicker = els.modalContent.querySelector("#modalColors");
    const moqWarning = els.modalContent.querySelector("#moqWarning");

    function updateMoqWarning() {
      if (quantity < product.moq) {
        moqWarning.hidden = false;
        moqWarning.textContent = `Below MOQ (${product.moq} ${moqUnit}). You can still request a quote.`;
      } else {
        moqWarning.hidden = true;
      }
    }

    function renderPickers() {
      sizePicker.innerHTML = product.sizes
        .map(
          (s) =>
            `<button type="button" class="size-opt${s === selectedSize ? " is-selected" : ""}" data-size="${escapeAttr(s)}">${escapeHtml(s)}</button>`
        )
        .join("");
      colorPicker.innerHTML = product.colors
        .map(
          (c) =>
            `<button type="button" class="color-opt${c === selectedColor ? " is-selected" : ""}" data-color="${escapeAttr(c)}">${escapeHtml(c)}</button>`
        )
        .join("");

      sizePicker.querySelectorAll("[data-size]").forEach((btn) => {
        btn.addEventListener("click", () => {
          selectedSize = btn.dataset.size;
          renderPickers();
        });
      });
      colorPicker.querySelectorAll("[data-color]").forEach((btn) => {
        btn.addEventListener("click", () => {
          selectedColor = btn.dataset.color;
          renderPickers();
        });
      });
    }
    renderPickers();
    updateMoqWarning();

    els.modalContent.querySelector("#modalQtyMinus").addEventListener("click", () => {
      quantity = Math.max(1, quantity - 1);
      els.modalContent.querySelector("#modalQty").textContent = quantity;
      updateMoqWarning();
    });
    els.modalContent.querySelector("#modalQtyPlus").addEventListener("click", () => {
      quantity += 1;
      els.modalContent.querySelector("#modalQty").textContent = quantity;
      updateMoqWarning();
    });

    els.modalContent.querySelector("#modalAddCart").addEventListener("click", () => {
      Cart.add(product, selectedSize, selectedColor, quantity);
      updateCartUI();
      els.productModal.close();
      openCart();
    });

    els.modalContent.querySelector(".modal__close").addEventListener("click", () => {
      els.productModal.close();
    });

    const modalImg = els.modalContent.querySelector("#modalProductImage");
    if (modalImg) applyProductImage(modalImg, product.image);

    els.productModal.showModal();
  }

  function updateWhatsAppLink() {
    const total = Cart.totalQty();
    const baseUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}`;
    const footer = document.getElementById("footerWhatsapp");
    if (footer) {
      footer.href = baseUrl;
      footer.textContent = `${STORE_CONFIG.whatsappDisplay} · ${STORE_CONFIG.contactName}`;
    }
    if (!els.whatsappBtn) return;
    if (total === 0) {
      els.whatsappBtn.href = "#";
      els.whatsappBtn.setAttribute("aria-disabled", "true");
      els.whatsappBtn.classList.add("is-disabled");
    } else {
      els.whatsappBtn.href = Cart.getWhatsAppUrl();
      els.whatsappBtn.removeAttribute("aria-disabled");
      els.whatsappBtn.classList.remove("is-disabled");
    }
  }

  function renderCart() {
    const items = Cart.items;
    const total = Cart.totalQty();
    els.cartTotalQty.textContent = total;
    updateWhatsAppLink();

    if (items.length === 0) {
      els.cartItems.innerHTML = `<p class="cart-empty">Your quote list is empty.<br />Browse products and add items.</p>`;
      return;
    }

    els.cartItems.innerHTML = items
      .map(
        (item) => `
      <div class="cart-item" data-pid="${item.productId}" data-size="${escapeAttr(item.size)}" data-color="${escapeAttr(item.color)}">
        <img class="cart-item__img" data-product-image="${escapeAttr(item.image)}" src="" alt="" />
        <div>
          <p class="cart-item__cat">${escapeHtml(CATEGORY_LABELS[item.category] || item.category)}</p>
          <p class="cart-item__name">${escapeHtml(item.name)}</p>
          <p class="cart-item__meta">${escapeHtml(item.size)} · ${escapeHtml(item.color)}</p>
          <p class="cart-item__price">${escapeHtml(item.price)} · MOQ ${item.moq} ${escapeHtml(item.moqUnit)} · ${item.cbm} CBM</p>
          <div class="cart-item__controls">
            <button type="button" class="qty-btn" data-action="minus">−</button>
            <span class="cart-item__qty">${item.quantity}</span>
            <button type="button" class="qty-btn" data-action="plus">+</button>
            <button type="button" class="cart-item__remove" data-action="remove">Remove</button>
          </div>
        </div>
      </div>`
      )
      .join("");

    els.cartItems.querySelectorAll("[data-product-image]").forEach((img) => {
      applyProductImage(img, img.getAttribute("data-product-image"));
    });

    els.cartItems.querySelectorAll(".cart-item").forEach((row) => {
      const pid = row.dataset.pid;
      const size = row.dataset.size;
      const color = row.dataset.color;
      row.querySelectorAll("[data-action]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const item = Cart.items.find(
            (i) => i.productId === pid && i.size === size && i.color === color
          );
          if (!item) return;
          if (btn.dataset.action === "minus") {
            Cart.updateQty(pid, size, color, item.quantity - 1);
          } else if (btn.dataset.action === "plus") {
            Cart.updateQty(pid, size, color, item.quantity + 1);
          } else {
            Cart.remove(pid, size, color);
          }
          updateCartUI();
        });
      });
    });
  }

  function updateCartUI() {
    const total = Cart.totalQty();
    els.cartBadge.textContent = total;
    els.cartBadge.hidden = total === 0;
    renderCart();
  }

  function openCart() {
    els.overlay.hidden = false;
    requestAnimationFrame(() => els.overlay.classList.add("is-visible"));
    els.cartDrawer.classList.add("is-open");
    els.cartDrawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeCart() {
    els.overlay.classList.remove("is-visible");
    els.cartDrawer.classList.remove("is-open");
    els.cartDrawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setTimeout(() => {
      els.overlay.hidden = true;
    }, 250);
  }

  function setCategory(cat) {
    state.category = cat;
    document.querySelectorAll(".nav-cat").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.category === cat);
    });
    renderProducts();
  }

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  function escapeAttr(str) {
    return String(str).replace(/"/g, "&quot;");
  }

  document.querySelectorAll(".nav-cat").forEach((btn) => {
    btn.addEventListener("click", () => setCategory(btn.dataset.category));
  });

  document.querySelectorAll(".tile").forEach((tile) => {
    tile.addEventListener("click", () => {
      setCategory(tile.dataset.category);
      document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
    });
  });

  document.querySelectorAll("[data-category].btn--outline").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      setCategory(btn.dataset.category);
      document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
    });
  });

  els.search.addEventListener("input", (e) => {
    state.search = e.target.value;
    renderProducts();
  });

  els.sortSelect.addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderProducts();
  });

  els.sizeFilters.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-size]");
    if (!chip) return;
    const s = chip.dataset.size;
    if (state.sizes.has(s)) state.sizes.delete(s);
    else state.sizes.add(s);
    renderFilters();
    renderProducts();
  });

  els.clearFilters.addEventListener("click", () => {
    state.sizes.clear();
    state.search = "";
    els.search.value = "";
    renderFilters();
    renderProducts();
  });

  els.cartTrigger.addEventListener("click", openCart);
  els.cartClose.addEventListener("click", closeCart);
  els.overlay.addEventListener("click", closeCart);

  els.whatsappBtn.addEventListener("click", (e) => {
    if (Cart.totalQty() === 0 || els.whatsappBtn.classList.contains("is-disabled")) {
      e.preventDefault();
    }
  });

  els.menuToggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    els.menuToggle.setAttribute("aria-expanded", open);
  });

  els.productModal.addEventListener("click", (e) => {
    if (e.target === els.productModal) els.productModal.close();
  });

  if (els.year) els.year.textContent = new Date().getFullYear();

  function showMissingImageBanner(missing) {
    if (!missing.length || document.getElementById("imageAlert")) return;
    const names = missing.map((m) => m.path.split("/").pop()).join(", ");
    const el = document.createElement("div");
    el.id = "imageAlert";
    el.className = "image-alert";
    el.setAttribute("role", "alert");
    el.innerHTML = `
      <p><strong>Product photos not found.</strong> The folder is empty or file names do not match.
      Missing: ${names}</p>
      <p>Put files in <code>fashion-catalog/images/products/</code> — see checklist below. Use <code>http://localhost:8080</code> (not opening the HTML file directly).</p>
      <p><a href="check-images.html">Open image checklist →</a></p>
    `;
    document.body.prepend(el);
  }

  async function verifyProductImages() {
    const local = PRODUCTS.filter((p) => p.image && !/^https?:/i.test(p.image)).map((p) => p.image);
    const results = await checkLocalImages(local);
    showMissingImageBanner(results.filter((r) => !r.ok));
  }

  renderFilters();
  renderProducts();
  updateCartUI();
  verifyProductImages();
})();
