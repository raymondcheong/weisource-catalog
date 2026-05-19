# WeiSource — Product & image guide

Store: **WeiSource** · Contact: **Peiwei** · WhatsApp: +86 15577702919

---

## Product fields (your 7 items)

Edit **`js/products.js`**. Each product uses:

| Field | Your term | Example |
|-------|-----------|---------|
| `name` | 名字 | `"Ankara Print Maxi Dress"` |
| `sizes` | 尺码 | `["S", "M", "L", "XL"]` |
| `moq` | 起定量 | `30` |
| `moqUnit` | (optional) | `"pcs"` / `"prs"` / `"lots"` |
| `price` | 价格 | `"$4.80/pc"` |
| `cbm` | 方数 | `0.12` |
| `cbmNote` | (optional) | `"per carton (50 pcs)"` |
| `colors` | 颜色/款式 | `["Blue/Gold", "Red/Green"]` |
| `category` | 种类 | `"clothing"` / `"mixed-bags"` / `"school-bags"` / `"shoes"` |
| `image` | 图片 | `"images/products/photo.jpg"` |

### Full example

```js
{
  id: "cl-010",
  name: "Women's Kitenge Skirt",
  category: "clothing",
  sizes: ["S", "M", "L"],
  moq: 40,
  moqUnit: "pcs",
  price: "$3.90/pc",
  cbm: 0.1,
  cbmNote: "per carton (60 pcs)",
  colors: ["Print A", "Print B"],
  image: "images/products/cl-010.jpg",
  featured: false,
  isNew: true,
},
```

---

## Upload product images

1. Save photo as **JPG** in `images/products/`  
   Example: `images/products/cl-010.jpg`
2. Set in product: `image: "images/products/cl-010.jpg"`
3. Refresh browser

Tips: no spaces in file names; width ~800–1200px; under 300KB.

---

## WhatsApp & store name

Edit **`js/config.js`** if you change number or text:

```js
storeName: "WeiSource",
contactName: "Peiwei",
whatsappNumber: "8615577702919",
```

---

## Categories (种类)

| Value | Nav label |
|-------|-----------|
| `clothing` | Clothing |
| `mixed-bags` | Mixed Bags |
| `school-bags` | School Bags |
| `shoes` | Shoes |

---

## Preview locally

```bash
cd fashion-catalog
python3 -m http.server 8080
```

Open http://localhost:8080
