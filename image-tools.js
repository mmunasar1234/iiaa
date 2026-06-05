/* Sawir — boos + cabbir */
window.WeddingImages = (function () {
  function def() { return { x: 50, y: 50, zoom: 100 }; }

  function norm(o) {
    o = o || {};
    return {
      x: o.x == null ? 50 : Math.max(0, Math.min(100, +o.x)),
      y: o.y == null ? 50 : Math.max(0, Math.min(100, +o.y)),
      zoom: o.zoom == null ? 100 : Math.max(50, Math.min(200, +o.zoom))
    };
  }

  function normGalleryItem(item) {
    if (!item) return { url: '', x: 50, y: 50, zoom: 100 };
    if (typeof item === 'string') return { url: item, x: 50, y: 50, zoom: 100 };
    return { url: item.url || '', x: item.x ?? 50, y: item.y ?? 50, zoom: item.zoom ?? 100 };
  }

  function applyToImg(img, opt) {
    if (!img) return;
    var o = norm(opt);
    img.style.objectFit = 'cover';
    img.style.objectPosition = o.x + '% ' + o.y + '%';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.transform = 'scale(' + (o.zoom / 100) + ')';
    img.style.transformOrigin = o.x + '% ' + o.y + '%';
  }

  function applyToBg(el, url, opt) {
    if (!el || !url) return;
    var o = norm(opt);
    el.style.backgroundImage = "url('" + url.replace(/'/g, '%27') + "')";
    el.style.backgroundRepeat = 'no-repeat';
    el.style.backgroundPosition = o.x + '% ' + o.y + '%';
    el.style.backgroundSize = o.zoom === 100 ? 'cover' : o.zoom + '% auto';
  }

  function ensureImageOpts(cfg) {
    if (!cfg.imageOpts) cfg.imageOpts = { hero: def(), groom: def(), bride: def() };
    cfg.imageOpts.hero = norm(cfg.imageOpts.hero);
    cfg.imageOpts.groom = norm(cfg.imageOpts.groom);
    cfg.imageOpts.bride = norm(cfg.imageOpts.bride);
    if (!cfg.gallery) cfg.gallery = [];
    cfg.gallery = cfg.gallery.map(normGalleryItem);
    return cfg;
  }

  return {
    def: def,
    norm: norm,
    normGalleryItem: normGalleryItem,
    applyToImg: applyToImg,
    applyToBg: applyToBg,
    ensureImageOpts: ensureImageOpts
  };
})();
