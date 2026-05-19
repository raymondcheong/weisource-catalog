/** Try .jpg / .png / .jpeg / .webp when the exact path is missing */
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG", ".PNG"];

const PLACEHOLDER_SVG =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
      <rect fill="#f0e6d8" width="400" height="500"/>
      <text x="200" y="230" text-anchor="middle" fill="#9e4520" font-family="sans-serif" font-size="16" font-weight="600">Photo missing</text>
      <text x="200" y="260" text-anchor="middle" fill="#6b5d52" font-family="sans-serif" font-size="12">Add image to images/products/</text>
    </svg>`
  );

function imageCandidates(path) {
  if (!path || path.startsWith("http://") || path.startsWith("https://")) {
    return [path];
  }
  const list = [];
  if (/\.(jpe?g|png|webp)$/i.test(path)) list.push(path);
  const base = path.replace(/\.(jpe?g|png|webp)$/i, "");
  IMAGE_EXTENSIONS.forEach((ext) => {
    const candidate = base + ext;
    if (!list.includes(candidate)) list.push(candidate);
  });
  return list;
}

function applyProductImage(img, path, onResolved) {
  const candidates = imageCandidates(path);
  let index = 0;

  function fail() {
    img.src = PLACEHOLDER_SVG;
    img.classList.add("img--missing");
    if (onResolved) onResolved(null);
  }

  function tryNext() {
    if (index >= candidates.length) {
      fail();
      return;
    }
    const src = candidates[index++];
    img.onload = () => {
      img.classList.remove("img--missing");
      if (onResolved) onResolved(src);
    };
    img.onerror = tryNext;
    img.src = src;
  }

  tryNext();
}

function checkLocalImages(paths) {
  return Promise.all(
    paths.map((path) => {
      if (!path || path.startsWith("http")) return Promise.resolve({ path, ok: true });
      const candidates = imageCandidates(path);
      return new Promise((resolve) => {
        let i = 0;
        const tryOne = () => {
          if (i >= candidates.length) {
            resolve({ path, ok: false, tried: candidates });
            return;
          }
          const img = new Image();
          img.onload = () => resolve({ path, ok: true, found: candidates[i] });
          img.onerror = () => {
            i++;
            tryOne();
          };
          img.src = candidates[i];
        };
        tryOne();
      });
    })
  );
}
