# Deploy WeiSource catalog (production)

Your live site is a **static folder** — no server code. Choose one host below.

---

## Option A — Netlify (recommended, ~3 minutes)

1. Zip this entire `fashion-catalog` folder (include `images/products/*.jpg`).
2. Open https://app.netlify.com/drop and sign in (free).
3. Drag the **folder** (or zip) onto the page.
4. Netlify gives you a URL like `https://random-name.netlify.app`.
5. **Site settings → Domain management** to add your own domain later.

CLI (if you install Node later):

```bash
cd fashion-catalog
npx netlify-cli deploy --prod --dir=.
```

---

## Option B — Vercel

1. https://vercel.com → Add New → Project  
2. Import from Git, or drag folder with Vercel CLI.

---

## Option C — GitHub Pages

```bash
cd fashion-catalog
git add -A
git commit -m "WeiSource catalog production"
# Create empty repo on GitHub, then:
git remote add origin https://github.com/YOUR_USER/weisource-catalog.git
git branch -M main
git push -u origin main
```

On GitHub: **Settings → Pages → Source: Deploy from branch `main` / root**.

Site URL: `https://YOUR_USER.github.io/weisource-catalog/`

---

## After deploy — checklist

- [ ] Open site on phone — products and images load  
- [ ] Test **Quote on WhatsApp** — opens chat to +86 15577702919  
- [ ] Share the HTTPS link with African customers  

---

## Update products later

1. Edit `js/products.js` and add images under `images/products/`.  
2. Re-deploy (Netlify: drag folder again, or `git push` if connected).
