/* Admin — edit.html */
window.WeddingEditor = (function () {
  var KEYS = ['index', 'naqsho2', 'naqsho3'];
  var PAGES = { index: 'classic.html', naqsho2: 'naqsho2.html', naqsho3: 'naqsho3.html' };
  var TEXT_IDS = [
    'splashSub', 'splashHint', 'heroSub', 'scrollHint', 'coupleSub', 'coupleTitle', 'groomRole', 'brideRole',
    'loveSub', 'loveTitle', 'loveQuote', 'loveSign', 'gallerySub', 'galleryTitle',
    'venueSub', 'venueTitle', 'venueBtn',
    'countdownSub', 'countdownTitle', 'countdownDays', 'countdownHours', 'countdownMins', 'countdownSecs',
    'rsvpSub', 'rsvpTitle', 'rsvpMessage', 'rsvpBtn', 'footerTag', 'waMessage'
  ];

  var configs = {};
  var currentKey = 'index';
  var saveTimer = null;

  function storageKey(k) { return 'wedding-cfg-' + k; }
  function revisionKey(k) { return 'wedding-cfg-rev-' + k; }

  function bumpRevision(keys) {
    var globalRev = String(Date.now());
    keys.forEach(function (k) {
      var rev = (window.WeddingQR && configs[k]) ? WeddingQR.configFingerprint(configs[k]) : globalRev;
      try { localStorage.setItem(revisionKey(k), rev); } catch (e) { /* */ }
      globalRev = rev;
    });
    try { localStorage.setItem('wedding-cfg-rev-global', globalRev); } catch (e) { /* */ }
    return globalRev;
  }

  function syncQrPrefs() {
    try {
      localStorage.setItem('wedding-qr-page', PAGES[currentKey]);
      localStorage.setItem('wedding-qr-design', currentKey);
      localStorage.setItem('wedding-qr-welcome', '1');
    } catch (e) { /* */ }
  }

  function exportDeployJson(keys) {
    keys.forEach(function (k, i) {
      setTimeout(function () {
        var blob = new Blob([JSON.stringify(configs[k])], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'wedding-data-' + k + '.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }, i * 450);
    });
  }

  function $(id) { return document.getElementById(id); }

  function loadAll() {
    KEYS.forEach(function (k) {
      try {
        var s = localStorage.getItem(storageKey(k));
        configs[k] = s ? JSON.parse(s) : JSON.parse(JSON.stringify(window.__defaults[k]));
      } catch (e) {
        configs[k] = JSON.parse(JSON.stringify(window.__defaults[k]));
      }
      if (!configs[k].venue) configs[k].venue = JSON.parse(JSON.stringify(window.__defaults[k].venue || {}));
    });
  }

  function setStatus(msg, ok) {
    var el = $('status');
    if (!el) return;
    el.textContent = msg;
    el.style.color = ok ? '#90ee90' : 'var(--gold)';
    if (ok) setTimeout(function () { el.textContent = 'Diyaar'; el.style.color = 'var(--gold)'; }, 2200);
  }

  function getImageOpts() {
    var c = configs[currentKey];
    WeddingImages.ensureImageOpts(c);
    return c.imageOpts;
  }

  function updateHeroFrame(url, opt) {
    var frame = $('frameHero');
    if (!frame) return;
    frame.innerHTML = '';
    frame.style.backgroundImage = '';
    if (!url || (url.indexOf('http') !== 0 && url.indexOf('data:') !== 0)) return;
    WeddingImages.applyToBg(frame, url, opt);
  }

  function updateFrame(frameId, url, opt) {
    var frame = $(frameId);
    if (!frame) return;
    frame.innerHTML = '';
    frame.style.backgroundImage = '';
    if (!url || (url.indexOf('http') !== 0 && url.indexOf('data:') !== 0)) return;
    var img = document.createElement('img');
    img.src = url;
    img.alt = '';
    frame.appendChild(img);
    WeddingImages.applyToImg(img, opt);
  }

  function syncSliderLabels(key) {
    document.querySelectorAll('[data-sliders="' + key + '"] input[type=range]').forEach(function (r) {
      var sp = r.parentElement.querySelector('span');
      if (sp) sp.textContent = r.value;
    });
  }

  function readSliderOpt(key) {
    var o = WeddingImages.def();
    document.querySelectorAll('input[data-k="' + key + '"][data-axis]').forEach(function (r) {
      o[r.dataset.axis] = +r.value;
    });
    return WeddingImages.norm(o);
  }

  function setSliderOpt(key, opt) {
    opt = WeddingImages.norm(opt);
    document.querySelectorAll('input[data-k="' + key + '"][data-axis]').forEach(function (r) {
      r.value = opt[r.dataset.axis];
    });
    syncSliderLabels(key);
  }

  function refreshImageEditors(fromSliders) {
    var c = configs[currentKey];
    WeddingImages.ensureImageOpts(c);
    var heroUrl = ($('heroImage') && $('heroImage').value.trim()) || c.heroImage;
    var groomUrl = ($('groomPhoto') && $('groomPhoto').value.trim()) || c.groom.photo;
    var brideUrl = ($('bridePhoto') && $('bridePhoto').value.trim()) || c.bride.photo;
    var heroOpt = fromSliders ? readSliderOpt('hero') : c.imageOpts.hero;
    var groomOpt = fromSliders ? readSliderOpt('groom') : c.imageOpts.groom;
    var brideOpt = fromSliders ? readSliderOpt('bride') : c.imageOpts.bride;
    updateHeroFrame(heroUrl, heroOpt);
    updateFrame('frameGroom', groomUrl, groomOpt);
    updateFrame('frameBride', brideUrl, brideOpt);
  }

  function compressImage(file, cb) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var max = 900, w = img.width, h = img.height;
        if (w > max || h > max) {
          if (w > h) { h = Math.round(h * max / w); w = max; }
          else { w = Math.round(w * max / h); h = max; }
        }
        var cv = document.createElement('canvas');
        cv.width = w;
        cv.height = h;
        cv.getContext('2d').drawImage(img, 0, 0, w, h);
        cb(cv.toDataURL('image/jpeg', 0.82));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function renderGallery(items) {
    var list = $('galleryList');
    if (!list) return;
    list.innerHTML = '';
    var arr = (items && items.length) ? items.map(WeddingImages.normGalleryItem) : [WeddingImages.normGalleryItem('')];
    arr.forEach(function (item, i) {
      var row = document.createElement('div');
      row.className = 'gallery-item';
      var prev = document.createElement('div');
      prev.className = 'gal-preview';
      var prevImg = document.createElement('img');
      prev.appendChild(prevImg);
      var fields = document.createElement('div');
      fields.className = 'gal-fields';
      var inp = document.createElement('input');
      inp.type = 'url';
      inp.value = item.url || '';
      inp.placeholder = 'Sawir ' + (i + 1);
      var file = document.createElement('input');
      file.type = 'file';
      file.accept = 'image/*';
      var sliders = document.createElement('div');
      sliders.className = 'img-sliders';
      ['x', 'y', 'zoom'].forEach(function (axis) {
        var lab = document.createElement('label');
        var lbl = axis === 'x' ? 'Dhinac' : axis === 'y' ? 'Kor/Hoos' : 'Cabbir';
        lab.textContent = lbl + ' ';
        var r = document.createElement('input');
        r.type = 'range';
        r.dataset.axis = axis;
        r.min = axis === 'zoom' ? '80' : '0';
        r.max = axis === 'zoom' ? '200' : '100';
        r.value = item[axis];
        var sp = document.createElement('span');
        sp.textContent = r.value;
        r.oninput = function () {
          sp.textContent = r.value;
          if (prevImg.src) WeddingImages.applyToImg(prevImg, readGalOpt(row));
          scheduleAutoSave();
        };
        lab.appendChild(r);
        lab.appendChild(sp);
        sliders.appendChild(lab);
      });
      function readGalOpt(rw) {
        var o = { x: 50, y: 50, zoom: 100 };
        rw.querySelectorAll('input[data-axis]').forEach(function (rg) { o[rg.dataset.axis] = +rg.value; });
        return WeddingImages.norm(o);
      }
      function refreshPrev() {
        if (inp.value && (inp.value.indexOf('http') === 0 || inp.value.indexOf('data:') === 0)) {
          prevImg.src = inp.value;
          WeddingImages.applyToImg(prevImg, readGalOpt(row));
        } else prevImg.removeAttribute('src');
      }
      inp.oninput = refreshPrev;
      file.onchange = function (e) {
        compressImage(e.target.files[0], function (data) { inp.value = data; refreshPrev(); scheduleAutoSave(); });
      };
      var rm = document.createElement('button');
      rm.type = 'button';
      rm.className = 'btn btn-outline';
      rm.style.cssText = 'color:#999;padding:0.35rem 0.5rem';
      rm.textContent = '×';
      rm.onclick = function () { row.remove(); };
      fields.appendChild(inp);
      fields.appendChild(file);
      fields.appendChild(sliders);
      row.appendChild(prev);
      row.appendChild(fields);
      row.appendChild(rm);
      list.appendChild(row);
      refreshPrev();
    });
  }

  function cfgToForm() {
    var c = configs[currentKey];
    $('groomName').value = c.groom.name || '';
    $('groomQuote').value = c.groom.quote || '';
    $('brideName').value = c.bride.name || '';
    $('brideQuote').value = c.bride.quote || '';
    $('dateText').value = c.date || '';
    $('dateISO').value = (c.dateISO || '').slice(0, 16);
        $('whatsapp').value = c.whatsapp || '';
        var ps = $('publicSiteUrl');
        if (ps) {
          ps.value = localStorage.getItem('wedding-public-url-raw') ||
            localStorage.getItem('wedding-public-url') || '';
        }
    $('heroImage').value = c.heroImage || '';
    $('groomPhoto').value = c.groom.photo || '';
    $('bridePhoto').value = c.bride.photo || '';
    $('musicUrl').value = c.music && c.music.indexOf('blob:') !== 0 ? c.music : '(uploaded)';
    if (!c.venue) c.venue = {};
    $('venueName').value = c.venue.name || '';
    $('venueAddress').value = c.venue.address || '';
    $('venueTime').value = c.venue.time || '';
    $('venueMapUrl').value = c.venue.mapUrl || '';
    TEXT_IDS.forEach(function (id) {
      var el = $(id);
      if (!el) return;
      if (id === 'venueBtn') el.value = (c.texts && c.texts.venueBtn) || '';
      else if (c.texts) el.value = c.texts[id] || '';
    });
    WeddingImages.ensureImageOpts(c);
    setSliderOpt('hero', c.imageOpts.hero);
    setSliderOpt('groom', c.imageOpts.groom);
    setSliderOpt('bride', c.imageOpts.bride);
    refreshImageEditors(false);
    renderGallery(c.gallery || []);
    updatePreviewLinks();
    refreshIframe();
    if ($('musicStatus')) $('musicStatus').textContent = '';
    if ($('musicPreview')) $('musicPreview').hidden = true;
  }

  function formToCfg() {
    var c = configs[currentKey];
    c.groom.name = $('groomName').value.trim();
    c.groom.quote = $('groomQuote').value.trim();
    c.bride.name = $('brideName').value.trim();
    c.bride.quote = $('brideQuote').value.trim();
    c.date = $('dateText').value.trim();
    var iso = $('dateISO').value;
    c.dateISO = iso ? iso + ':00' : c.dateISO;
    c.whatsapp = $('whatsapp').value.trim().replace(/\D/g, '');
    c.heroImage = $('heroImage').value.trim();
    c.groom.photo = $('groomPhoto').value.trim();
    c.bride.photo = $('bridePhoto').value.trim();
    var mu = $('musicUrl').value.trim();
    if (mu && mu !== '(uploaded)') c.music = mu;
    if (!c.venue) c.venue = {};
    c.venue.name = $('venueName').value.trim();
    c.venue.address = $('venueAddress').value.trim();
    c.venue.time = $('venueTime').value.trim();
    c.venue.mapUrl = $('venueMapUrl').value.trim();
    if (!c.texts) c.texts = {};
    TEXT_IDS.forEach(function (id) {
      var el = $(id);
      if (el) c.texts[id] = el.value.trim();
    });
    if (!c.imageOpts) c.imageOpts = {};
    c.imageOpts.hero = readSliderOpt('hero');
    c.imageOpts.groom = readSliderOpt('groom');
    c.imageOpts.bride = readSliderOpt('bride');
    c.gallery = [];
    document.querySelectorAll('#galleryList .gallery-item').forEach(function (row) {
      var inp = row.querySelector('input[type=url]');
      var v = inp && inp.value.trim();
      if (!v) return;
      var o = { url: v, x: 50, y: 50, zoom: 100 };
      row.querySelectorAll('input[data-axis]').forEach(function (r) { o[r.dataset.axis] = +r.value; });
      c.gallery.push(WeddingImages.normGalleryItem(o));
    });
    return c;
  }

  function applySync(data, targetKey) {
    var target = configs[targetKey];
    var music = target.music;
    var syncCore = $('syncCore') && $('syncCore').checked;
    var syncFull = $('syncFull') && $('syncFull').checked;

    if (syncFull) {
      configs[targetKey] = JSON.parse(JSON.stringify(data));
      configs[targetKey].music = music;
      return;
    }
    if (syncCore) {
      target.groom = JSON.parse(JSON.stringify(data.groom));
      target.bride = JSON.parse(JSON.stringify(data.bride));
      target.date = data.date;
      target.dateISO = data.dateISO;
      target.whatsapp = data.whatsapp;
      target.heroImage = data.heroImage;
      target.venue = JSON.parse(JSON.stringify(data.venue || {}));
      if (data.imageOpts) target.imageOpts = JSON.parse(JSON.stringify(data.imageOpts));
      if (target.texts && data.texts) {
        target.texts.venueSub = data.texts.venueSub;
        target.texts.venueTitle = data.texts.venueTitle;
        target.texts.venueBtn = data.texts.venueBtn;
      }
    }
  }

  function save() {
    formToCfg();
    var data = configs[currentKey];
    var syncCore = $('syncCore') && $('syncCore').checked;
    var syncFull = $('syncFull') && $('syncFull').checked;
    var keys = (syncCore || syncFull) ? KEYS : [currentKey];

    savePublicUrl();

    keys.forEach(function (k) {
      if (k !== currentKey && (syncCore || syncFull)) applySync(data, k);
      localStorage.setItem(storageKey(k), JSON.stringify(configs[k]));
    });
    bumpRevision(keys);
    syncQrPrefs();
    exportDeployJson(keys);
    setStatus('Kaydiyay + QR cusub + fayl JSON', true);
    refreshIframe();
  }

  function savePublicUrl() {
    var pub = $('publicSiteUrl');
    if (!pub || !pub.value.trim()) return;
    var link = pub.value.trim();
    if (window.WeddingQR) WeddingQR.setPublicBase(link);
    else localStorage.setItem('wedding-public-url', link);
    try { localStorage.setItem('wedding-public-url-raw', link); } catch (e) { /* */ }
  }

  function scheduleAutoSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      formToCfg();
      savePublicUrl();
      localStorage.setItem(storageKey(currentKey), JSON.stringify(configs[currentKey]));
      bumpRevision([currentKey]);
      syncQrPrefs();
      setStatus('Auto-kaydin — QR waa cusub', true);
    }, 1500);
  }

  function updatePreviewLinks() {
    var el = $('previewLinks');
    if (!el) return;
    var p = PAGES[currentKey];
    var qrHref = 'qr.html?page=' + encodeURIComponent(p);
    if (window.WeddingQR) {
      var rev = WeddingQR.getRevision(currentKey);
      if (rev) qrHref += '&v=' + encodeURIComponent(rev);
    }
    el.innerHTML = '<a href="' + p + '" target="_blank">Fur ' + p + '</a> · <a href="' + qrHref + '">QR Code</a>';
  }

  function refreshIframe() {
    var fr = $('livePreview');
    if (!fr) return;
    fr.src = PAGES[currentKey] + '?t=' + Date.now();
  }

  function init() {
    loadAll();
    var params = new URLSearchParams(location.search);
    var pre = params.get('design');
    if (pre && KEYS.indexOf(pre) >= 0) {
      currentKey = pre;
      $('designPick').value = pre;
    }
    cfgToForm();

    document.querySelectorAll('.tab').forEach(function (tab) {
      tab.onclick = function () {
        document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
        document.querySelectorAll('.panel').forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active');
        $('panel-' + tab.dataset.tab).classList.add('active');
      };
    });

    $('designPick').onchange = function () {
      formToCfg();
      currentKey = $('designPick').value;
      cfgToForm();
    };

    $('btnSave').onclick = save;
    $('btnSave2').onclick = save;
    $('btnRefreshPreview').onclick = refreshIframe;

    $('btnAddGallery').onclick = function () {
      var list = $('galleryList');
      if (list.children.length >= 8) return;
      formToCfg();
      var items = configs[currentKey].gallery.slice();
      items.push(WeddingImages.normGalleryItem(''));
      renderGallery(items);
    };

    document.querySelectorAll('input[data-target]').forEach(function (inp) {
      inp.onchange = function (e) {
        compressImage(e.target.files[0], function (data) {
          $(inp.dataset.target).value = data;
          refreshImageEditors(true);
          scheduleAutoSave();
        });
      };
    });

    ['hero', 'groom', 'bride'].forEach(function (key) {
      document.querySelectorAll('input[data-k="' + key + '"][data-axis]').forEach(function (r) {
        r.oninput = function () {
          syncSliderLabels(key);
          refreshImageEditors(true);
          scheduleAutoSave();
        };
      });
    });

    ['heroImage', 'groomPhoto', 'bridePhoto'].forEach(function (id) {
      $(id).oninput = function () {
        refreshImageEditors(true);
        scheduleAutoSave();
      };
    });

    document.querySelector('.wrap').addEventListener('input', scheduleAutoSave);
    document.querySelector('.wrap').addEventListener('change', scheduleAutoSave);
    if ($('publicSiteUrl')) {
      $('publicSiteUrl').oninput = savePublicUrl;
      $('publicSiteUrl').onchange = function () {
        savePublicUrl();
        scheduleAutoSave();
      };
    }

    $('musicFile').onchange = function (e) {
      var file = e.target.files[0];
      if (!file || !window.WeddingStore) return;
      WeddingStore.put('music-' + currentKey, file).then(function () {
        $('musicStatus').textContent = 'Muusig: ' + file.name;
        var aud = $('musicPreview');
        aud.src = URL.createObjectURL(file);
        aud.hidden = false;
        $('musicUrl').value = '(uploaded)';
        save();
      });
    };

    $('btnExport').onclick = function () {
      formToCfg();
      var blob = new Blob([JSON.stringify(configs[currentKey], null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'martiqaad-' + currentKey + '.json';
      a.click();
    };

    $('btnExportAll').onclick = function () {
      formToCfg();
      var blob = new Blob([JSON.stringify({ index: configs.index, naqsho2: configs.naqsho2, naqsho3: configs.naqsho3 }, null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'martiqaad-dhammaan.json';
      a.click();
    };

    $('importFile').onchange = function (e) {
      var f = e.target.files[0];
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var data = JSON.parse(reader.result);
          if (data.index || data.naqsho2) {
            KEYS.forEach(function (k) { if (data[k]) configs[k] = data[k]; });
          } else {
            configs[currentKey] = data;
          }
          cfgToForm();
          setStatus('JSON la soo geliyay — Kaydi!', true);
        } catch (err) { setStatus('JSON khaldan', false); }
      };
      reader.readAsText(f);
    };

    $('btnReset').onclick = function () {
      if (!confirm('Dib u celi default naqshaddan?')) return;
      configs[currentKey] = JSON.parse(JSON.stringify(window.__defaults[currentKey]));
      localStorage.removeItem(storageKey(currentKey));
      if (window.WeddingStore) WeddingStore.remove('music-' + currentKey);
      cfgToForm();
      setStatus('Default dib loo celiyay', true);
    };
  }

  return { init: init };
})();
