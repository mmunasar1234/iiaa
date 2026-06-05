function initWeddingInvite() {
  var lockStyle = document.getElementById('splash-scroll-lock');
  if (!lockStyle) {
    lockStyle = document.createElement('style');
    lockStyle.id = 'splash-scroll-lock';
    lockStyle.textContent =
      'html.splash-active, html.splash-active body {' +
      '  overflow: hidden !important; height: 100% !important;' +
      '  overscroll-behavior: none; touch-action: none; position: relative; width: 100%;' +
      '}' +
      '#splash { overflow: hidden !important; overscroll-behavior: none; touch-action: manipulation; }';
    document.head.appendChild(lockStyle);
  }
  document.documentElement.classList.add('splash-active');

  function unlockScroll() {
    document.documentElement.classList.remove('splash-active');
  }

  const cfg = WEDDING_CONFIG;
  if (window.WeddingImages) WeddingImages.ensureImageOpts(cfg);
  const imgOpts = cfg.imageOpts || {};
  const g = cfg.groom.name;
  const b = cfg.bride.name;
  const t = cfg.texts;
  var scanParams = new URLSearchParams(window.location.search);
  var isScanEntry = scanParams.get('s') === '1' || scanParams.get('scan') === '1';

  document.title = g + ' & ' + b + ' — Arooska';

  var meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'description';
    document.head.appendChild(meta);
  }
  meta.content = t.heroSub + ' — ' + g + ' & ' + b + ' — ' + cfg.date;

  const set = function(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set('splashInitials', g[0] + ' & ' + b[0]);
  set('splashSub', t.splashSub);
  set('splashGroom', g);
  set('splashBride', b);
  set('splashHint', t.splashHint);
  set('heroSub', t.heroSub);
  set('scrollHint', t.scrollHint);
  set('coupleSub', t.coupleSub);
  set('coupleTitle', t.coupleTitle);
  set('heroGroom', g);
  set('heroBride', b);
  set('heroDate', cfg.date);
  set('gallerySub', t.gallerySub);
  set('galleryTitle', t.galleryTitle);
  set('loveSub', t.loveSub);
  set('loveTitle', t.loveTitle);
  set('loveQuote', t.loveQuote);
  set('loveSign', '— ' + t.loveSign);
  set('countdownSub', t.countdownSub);
  set('countdownTitle', t.countdownTitle);
  set('venueSub', t.venueSub);
  set('venueTitle', t.venueTitle);
  set('venueName', cfg.venue && cfg.venue.name);
  set('venueAddress', cfg.venue && cfg.venue.address);
  set('venueTime', cfg.venue && cfg.venue.time);
  set('heroTime', cfg.venue && cfg.venue.time);
  set('labelDays', t.countdownDays);
  set('labelHours', t.countdownHours);
  set('labelMins', t.countdownMins);
  set('labelSecs', t.countdownSecs);
  set('rsvpSub', t.rsvpSub);
  set('rsvpTitle', t.rsvpTitle);
  set('rsvpMessage', t.rsvpMessage);
  set('footerNames', g + ' & ' + b);
  set('footerTag', cfg.date + ' — ' + t.footerTag);

  const heroBg = document.getElementById('heroBg');
  if (heroBg && cfg.heroImage) {
    if (window.WeddingImages) WeddingImages.applyToBg(heroBg, cfg.heroImage, imgOpts.hero);
    else heroBg.style.backgroundImage = "url('" + cfg.heroImage + "')";
  }

  var venue = cfg.venue || {};
  var venueBtn = document.getElementById('venueBtn');
  if (venueBtn) {
    if (venue.mapUrl) {
      venueBtn.textContent = t.venueBtn || 'Fur Khariidadda';
      venueBtn.href = venue.mapUrl;
      venueBtn.target = '_blank';
      venueBtn.rel = 'noopener';
      venueBtn.style.display = '';
    } else {
      venueBtn.style.display = 'none';
    }
  }
  var vn = document.getElementById('venueName');
  var va = document.getElementById('venueAddress');
  var vt = document.getElementById('venueTime');
  if (vn && !venue.name) vn.style.display = 'none';
  if (va && !venue.address) va.style.display = 'none';
  if (vt && !venue.time) vt.style.display = 'none';
  var venueSection = document.querySelector('.venue-section');
  if (venueSection && !venue.name && !venue.address && !venue.time && !venue.mapUrl) {
    venueSection.style.display = 'none';
  }

  const rsvpBtn = document.getElementById('rsvpBtn');
  if (rsvpBtn) {
    rsvpBtn.textContent = t.rsvpBtn;
    rsvpBtn.href = 'https://wa.me/' + cfg.whatsapp + '?text=' +
      encodeURIComponent(t.waMessage + ' ' + g + ' & ' + b + '!');
  }

  function couplePhotoHtml(src, alt, opt) {
    return '<div class="photo-frame"><img class="couple-photo" src="' + src + '" alt="' + alt + '" /></div>';
  }

  function applyImgLater(el, opt) {
    if (el && window.WeddingImages) WeddingImages.applyToImg(el, opt);
  }

  const coupleGrid = document.getElementById('coupleGrid');
  if (coupleGrid && !coupleGrid.dataset.custom) {
    coupleGrid.innerHTML =
      '<div class="couple-card">' + couplePhotoHtml(cfg.groom.photo, g, imgOpts.groom) +
      '<h3 class="couple-name">' + g + '</h3><p class="couple-role">' + t.groomRole + '</p>' +
      '<p class="couple-desc">"' + cfg.groom.quote + '"</p></div>' +
      '<div class="couple-card">' + couplePhotoHtml(cfg.bride.photo, b, imgOpts.bride) +
      '<h3 class="couple-name">' + b + '</h3><p class="couple-role">' + t.brideRole + '</p>' +
      '<p class="couple-desc">"' + cfg.bride.quote + '"</p></div>';
    var cimgs = coupleGrid.querySelectorAll('.couple-photo');
    if (cimgs[0]) applyImgLater(cimgs[0], imgOpts.groom);
    if (cimgs[1]) applyImgLater(cimgs[1], imgOpts.bride);
  }

  function galleryItemHtml(gitem, i) {
    var key = document.documentElement.dataset.weddingKey || '';
    var attrs = 'data-gx="' + gitem.x + '" data-gy="' + gitem.y + '" data-gz="' + gitem.zoom + '"';
    var delay = ' style="--i:' + i + '"';
    if (key === 'naqsho3') {
      return '<div class="gallery-item"' + delay + '>' +
        '<article class="memory-card">' +
        '<div class="memory-glow"></div>' +
        '<div class="memory-frame"><img src="' + gitem.url + '" alt="Xusuus ' + (i + 1) + '" ' + attrs + ' /></div>' +
        '<span class="memory-tag">' + String(i + 1).padStart(2, '0') + '</span>' +
        '</article></div>';
    }
    if (key === 'index') {
      return '<div class="gallery-item"' + delay + '>' +
        '<div class="gallery-frame"><div class="gallery-ornament"></div>' +
        '<img src="' + gitem.url + '" alt="Sawir" ' + attrs + ' /></div></div>';
    }
    return '<div class="gallery-item"' + delay + '><img src="' + gitem.url + '" alt="Sawir" ' + attrs + ' /></div>';
  }

  const gallery = document.getElementById('gallery');
  if (gallery && !gallery.dataset.custom) {
    gallery.innerHTML = (cfg.gallery || []).map(function(item, i) {
      var gitem = window.WeddingImages ? WeddingImages.normGalleryItem(item) : { url: item, x: 50, y: 50, zoom: 100 };
      return galleryItemHtml(gitem, i);
    }).join('');
    gallery.querySelectorAll('img').forEach(function(im) {
      applyImgLater(im, { x: +im.dataset.gx, y: +im.dataset.gy, zoom: +im.dataset.gz });
    });
  }

  /* ===== MUUSIG — automatic marka la galo ===== */
  const weddingMusic = document.getElementById('weddingMusic');
  const musicControl = document.getElementById('musicControl');
  const DEFAULT_MUSIC = 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_8cb749bf48.mp3?filename=romantic-wedding-background-music-124464.mp3';
  const TARGET_VOLUME = 0.45;
  let musicPlaying = false;
  let usedFallback = false;
  let fadeTimer = null;

  function showMusicBtn(playing) {
    if (!musicControl) return;
    musicControl.classList.add('show');
    if (playing) musicControl.classList.add('playing');
    else musicControl.classList.remove('playing');
  }

  function fadeInMusic() {
    if (!weddingMusic) return;
    clearInterval(fadeTimer);
    weddingMusic.volume = 0;
    fadeTimer = setInterval(function() {
      if (weddingMusic.volume < TARGET_VOLUME) {
        weddingMusic.volume = Math.min(TARGET_VOLUME, weddingMusic.volume + 0.03);
      } else {
        clearInterval(fadeTimer);
      }
    }, 60);
  }

  function tryPlayMusic() {
    if (!weddingMusic) return Promise.resolve(false);

    weddingMusic.loop = true;

    return weddingMusic.play().then(function() {
      musicPlaying = true;
      showMusicBtn(true);
      fadeInMusic();
      return true;
    }).catch(function() {
      showMusicBtn(false);
      return false;
    });
  }

  function useFallbackMusic() {
    if (!weddingMusic || usedFallback) return;
    usedFallback = true;
    weddingMusic.src = DEFAULT_MUSIC;
    weddingMusic.load();
  }

  if (weddingMusic) {
    weddingMusic.preload = 'auto';
    weddingMusic.playsInline = true;
    weddingMusic.setAttribute('playsinline', '');
    weddingMusic.setAttribute('webkit-playsinline', '');
    weddingMusic.volume = 0;
    weddingMusic.src = cfg.music;
    weddingMusic.load();

    weddingMusic.addEventListener('error', useFallbackMusic);

    weddingMusic.addEventListener('canplaythrough', function() {
      weddingMusic.dataset.ready = '1';
    });
  }

  function startMusic() {
    if (!weddingMusic) return;

    function attempt() {
      tryPlayMusic().then(function(ok) {
        if (!ok && usedFallback) {
          setTimeout(attempt, 300);
        } else if (!ok && !usedFallback) {
          useFallbackMusic();
          weddingMusic.addEventListener('canplay', function handler() {
            weddingMusic.removeEventListener('canplay', handler);
            tryPlayMusic();
          });
        }
      });
    }

    if (weddingMusic.readyState >= 2) {
      attempt();
    } else {
      weddingMusic.addEventListener('canplay', function handler() {
        weddingMusic.removeEventListener('canplay', handler);
        attempt();
      });
      setTimeout(function() {
        if (!musicPlaying) attempt();
      }, 500);
    }
  }

  if (musicControl) {
    musicControl.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      if (!weddingMusic) return;
      if (weddingMusic.paused) {
        weddingMusic.volume = TARGET_VOLUME;
        weddingMusic.play().then(function() {
          musicPlaying = true;
          showMusicBtn(true);
        });
      } else {
        weddingMusic.pause();
        musicPlaying = false;
        showMusicBtn(false);
      }
    });
  }

  function showScanData() {
    if (!isScanEntry) return;
    var venue = cfg.venue || {};
    var style = document.getElementById('scan-data-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'scan-data-style';
      style.textContent =
        '#scanDataPanel{position:fixed;inset:0;z-index:10000;background:rgba(15,12,9,0.92);display:flex;align-items:center;justify-content:center;padding:1.5rem}' +
        '#scanDataPanel .box{background:#faf7f2;color:#2c2416;max-width:360px;width:100%;padding:1.75rem;border-radius:12px;text-align:center;border:2px solid #c9a962}' +
        '#scanDataPanel h2{font-family:Georgia,serif;font-size:1.6rem;margin-bottom:0.5rem;color:#2c2416}' +
        '#scanDataPanel .names{font-size:1.1rem;margin:0.5rem 0;color:#c9a962}' +
        '#scanDataPanel p{font-size:0.85rem;line-height:1.6;color:#555;margin:0.25rem 0}' +
        '#scanDataPanel .btn-open{margin-top:1.25rem;padding:0.85rem 1.5rem;background:#c9a962;color:#fff;border:none;border-radius:4px;font-size:0.75rem;letter-spacing:2px;text-transform:uppercase;cursor:pointer;width:100%}';
      document.head.appendChild(style);
    }
    var panel = document.createElement('div');
    panel.id = 'scanDataPanel';
    panel.innerHTML =
      '<div class="box">' +
      '<h2>Martiqaad Aroos</h2>' +
      '<p class="names">' + g + ' &amp; ' + b + '</p>' +
      '<p><strong>' + cfg.date + '</strong></p>' +
      (venue.name ? '<p>' + venue.name + '</p>' : '') +
      (venue.time ? '<p>' + venue.time + '</p>' : '') +
      (venue.address ? '<p>' + venue.address + '</p>' : '') +
      '<p style="margin-top:0.75rem">' + t.heroSub + '</p>' +
      '<button type="button" class="btn-open" id="scanOpenBtn">Fur martiqaadka</button>' +
      '</div>';
    document.body.appendChild(panel);
    document.getElementById('scanOpenBtn').onclick = function() {
      panel.remove();
      openInvite();
    };
    setTimeout(function() {
      if (document.getElementById('scanDataPanel')) {
        panel.remove();
        openInvite();
      }
    }, 5000);
  }

  var opened = false;
  function openInvite(e) {
    if (e) e.preventDefault();
    if (opened) return;
    opened = true;

    startMusic();

    var splash = document.getElementById('splash');
    if (splash) splash.classList.add('opening');
    setTimeout(function() {
      if (splash) splash.classList.add('hidden');
      unlockScroll();
    }, 1300);
  }

  var splashCard = document.getElementById('splashCard');
  var splash = document.getElementById('splash');

  if (splash) {
    splash.addEventListener('touchmove', function(e) {
      e.preventDefault();
    }, { passive: false });
    splash.addEventListener('wheel', function(e) {
      e.preventDefault();
    }, { passive: false });
  }

  function bindEnter(el) {
    if (!el) return;
    el.addEventListener('click', openInvite);
    el.addEventListener('touchend', function(e) {
      e.preventDefault();
      openInvite(e);
    }, { passive: false });
  }

  bindEnter(splashCard);
  bindEnter(splash);

  if (isScanEntry) {
    setTimeout(openInvite, 80);
  }

  if (splash) {
    splash.addEventListener('touchstart', function once() {
      if (!musicPlaying) startMusic();
      splash.removeEventListener('touchstart', once);
    }, { passive: true });
  }

  var sparkles = document.getElementById('sparkles');
  if (sparkles) {
    for (var i = 0; i < 35; i++) {
      var s = document.createElement('div');
      s.className = 'sparkle';
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 100 + '%';
      s.style.animationDelay = Math.random() * 3 + 's';
      sparkles.appendChild(s);
    }
  }

  var splashPetals = document.getElementById('splashPetals');
  if (splashPetals) {
    for (var j = 0; j < 14; j++) {
      var p = document.createElement('div');
      p.className = 'splash-petal';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (6 + Math.random() * 8) + 's';
      p.style.animationDelay = Math.random() * 5 + 's';
      splashPetals.appendChild(p);
    }
  }

  var petals = document.getElementById('petals');
  if (petals) {
    for (var k = 0; k < 16; k++) {
      var petal = document.createElement('div');
      petal.className = 'petal';
      petal.style.left = Math.random() * 100 + '%';
      petal.style.animationDuration = (8 + Math.random() * 12) + 's';
      petal.style.animationDelay = Math.random() * 10 + 's';
      petal.style.width = petal.style.height = (8 + Math.random() * 8) + 'px';
      petals.appendChild(petal);
    }
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal, .couple-card, .gallery-item, .love-quote-box, .venue-box').forEach(function(el) {
    observer.observe(el);
  });

  var weddingDate = new Date(cfg.dateISO);
  function updateCountdown() {
    var diff = weddingDate - new Date();
    if (diff <= 0) return;
    var d = document.getElementById('days');
    if (!d) return;
    d.textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
    document.getElementById('hours').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    document.getElementById('mins').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    document.getElementById('secs').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function startWeddingApp() {
  if (window.__weddingReady && window.__weddingReady.then) {
    window.__weddingReady.then(initWeddingInvite);
  } else {
    initWeddingInvite();
  }
}
document.addEventListener('DOMContentLoaded', startWeddingApp);
