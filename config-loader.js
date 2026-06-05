/* Ku dar kaydinta browser-ka (edit.html) config-ka asalka ah */
(function () {
  var key = document.documentElement.getAttribute('data-wedding-key') || 'index';
  var storageKey = 'wedding-cfg-' + key;

  function deepMerge(target, source) {
    if (!source || typeof source !== 'object') return target;
    Object.keys(source).forEach(function (k) {
      var sv = source[k];
      var tv = target[k];
      if (sv && typeof sv === 'object' && !Array.isArray(sv) && typeof tv === 'object' && !Array.isArray(tv)) {
        deepMerge(tv, sv);
      } else {
        target[k] = sv;
      }
    });
    return target;
  }

  function applyStoredConfig() {
    try {
      var raw = localStorage.getItem(storageKey);
      if (raw && typeof WEDDING_CONFIG !== 'undefined') {
        deepMerge(WEDDING_CONFIG, JSON.parse(raw));
      }
    } catch (e) { /* ignore */ }
  }

  function applyPackedFromUrl() {
    try {
      var p = new URLSearchParams(location.search).get('p');
      if (!p || typeof WEDDING_CONFIG === 'undefined') return false;
      if (window.WeddingQR && WeddingQR.unpackConfig) {
        deepMerge(WEDDING_CONFIG, WeddingQR.unpackConfig(p));
        return true;
      }
    } catch (e) { /* ignore bad pack */ }
    return false;
  }

  function loadDeployedConfig() {
    var rev = '';
    try { rev = new URLSearchParams(location.search).get('v') || ''; } catch (e) { /* */ }
    var url = './wedding-data-' + key + '.json';
    if (rev) url += (url.indexOf('?') >= 0 ? '&' : '?') + 'v=' + encodeURIComponent(rev);
    return fetch(url, { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (data && typeof WEDDING_CONFIG !== 'undefined') deepMerge(WEDDING_CONFIG, data);
      })
      .catch(function () { /* offline / file not uploaded yet */ });
  }

  var hasPackedUrl = false;
  try { hasPackedUrl = !!new URLSearchParams(location.search).get('p'); } catch (e) { /* */ }

  if (!hasPackedUrl) applyStoredConfig();
  else applyPackedFromUrl();

  window.__weddingReady = Promise.resolve().then(function () {
    if (!hasPackedUrl) return loadDeployedConfig();
  }).then(function () {
    if (hasPackedUrl) {
      applyPackedFromUrl();
    } else {
      applyStoredConfig();
    }
    if (!window.WeddingStore) return;
    return WeddingStore.getObjectUrl('music-' + key).then(function (url) {
      if (url && typeof WEDDING_CONFIG !== 'undefined') WEDDING_CONFIG.music = url;
    });
  }).catch(function () {});
})();
