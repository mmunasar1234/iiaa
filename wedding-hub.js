/* index.html — magacyada kaydsan */
(function () {
  var el = document.getElementById('coupleLine');
  var dateEl = document.getElementById('dateLine');
  if (!el) return;

  var keys = ['index', 'naqsho2', 'naqsho3'];
  var cfg = null;

  for (var i = 0; i < keys.length; i++) {
    try {
      var raw = localStorage.getItem('wedding-cfg-' + keys[i]);
      if (raw) {
        cfg = JSON.parse(raw);
        break;
      }
    } catch (e) { /* */ }
  }

  if (cfg && cfg.groom && cfg.bride) {
    el.textContent = cfg.groom.name + ' & ' + cfg.bride.name;
    if (dateEl && cfg.date) dateEl.textContent = cfg.date;
  }
})();
