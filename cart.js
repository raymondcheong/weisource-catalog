const CART_STORAGE_KEY = "weisource_cart_v1";

const Cart = {
  items: [],

  load() {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      this.items = raw ? JSON.parse(raw) : [];
    } catch {
      this.items = [];
    }
    return this.items;
  },

  save() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
  },

  totalQty() {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  },

  findIndex(productId, size, color) {
    return this.items.findIndex(
      (i) => i.productId === productId && i.size === size && i.color === color
    );
  },

  add(product, size, color, quantity = 1) {
    const idx = this.findIndex(product.id, size, color);
    if (idx >= 0) {
      this.items[idx].quantity += quantity;
    } else {
      this.items.push({
        productId: product.id,
        name: product.name,
        category: product.category,
        image: product.image,
        size,
        color,
        quantity,
        moq: product.moq,
        moqUnit: product.moqUnit || "pcs",
        price: product.price,
        cbm: product.cbm,
        cbmNote: product.cbmNote || "",
        remarks: product.remarks || "",
      });
    }
    this.save();
    return this.items;
  },

  updateQty(productId, size, color, quantity) {
    const idx = this.findIndex(productId, size, color);
    if (idx < 0) return;
    if (quantity <= 0) {
      this.items.splice(idx, 1);
    } else {
      this.items[idx].quantity = quantity;
    }
    this.save();
  },

  remove(productId, size, color) {
    const idx = this.findIndex(productId, size, color);
    if (idx >= 0) {
      this.items.splice(idx, 1);
      this.save();
    }
  },

  clear() {
    this.items = [];
    this.save();
  },

  buildWhatsAppMessage() {
    const { storeName, contactName, whatsappGreeting, currencyNote } = STORE_CONFIG;
    const lines = [whatsappGreeting, ""];
    this.items.forEach((item, i) => {
      const cat = CATEGORY_LABELS[item.category] || item.category;
      let cbmLine = "—";
      if (item.cbm != null && item.cbm !== "") {
        cbmLine = item.cbmNote ? `${item.cbm} CBM (${item.cbmNote})` : `${item.cbm} CBM`;
      } else if (item.cbmNote) {
        cbmLine = item.cbmNote;
      }
      lines.push(
        `${i + 1}. ${item.name}`,
        `   Category: ${cat}`,
        `   Size: ${item.size} | Style/Color: ${item.color}`,
        `   Qty: ${item.quantity} ${item.moqUnit} (MOQ: ${item.moq} ${item.moqUnit})`,
        `   Price: ${item.price} | Volume: ${cbmLine}`,
        ...(item.remarks ? [`   Note: ${item.remarks}`] : []),
        ""
      );
    });
    lines.push(`— Total: ${this.totalQty()} pieces —`);
    lines.push(`From ${storeName} · Contact: ${contactName}`);
    lines.push(currencyNote);
    return lines.join("\n");
  },

  getWhatsAppUrl() {
    const text = encodeURIComponent(this.buildWhatsAppMessage());
    return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${text}`;
  },
};
