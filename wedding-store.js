/* IndexedDB — muusig & sawirro waaweyn (ma buuxin localStorage) */
window.WeddingStore = (function () {
  var DB = 'wedding-db';
  var VER = 1;

  function open() {
    return new Promise(function (resolve, reject) {
      var req = indexedDB.open(DB, VER);
      req.onerror = function () { reject(req.error); };
      req.onsuccess = function () { resolve(req.result); };
      req.onupgradeneeded = function (e) {
        var db = e.target.result;
        if (!db.objectStoreNames.contains('files')) db.createObjectStore('files');
      };
    });
  }

  function put(key, blob) {
    return open().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction('files', 'readwrite');
        tx.objectStore('files').put(blob, key);
        tx.oncomplete = function () { resolve(key); };
        tx.onerror = function () { reject(tx.error); };
      });
    });
  }

  function get(key) {
    return open().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction('files', 'readonly');
        var req = tx.objectStore('files').get(key);
        req.onsuccess = function () { resolve(req.result || null); };
        req.onerror = function () { reject(req.error); };
      });
    });
  }

  function remove(key) {
    return open().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction('files', 'readwrite');
        tx.objectStore('files').delete(key);
        tx.oncomplete = function () { resolve(); };
        tx.onerror = function () { reject(tx.error); };
      });
    });
  }

  function getObjectUrl(key) {
    return get(key).then(function (blob) {
      if (!blob) return null;
      return URL.createObjectURL(blob);
    });
  }

  return { put: put, get: get, remove: remove, getObjectUrl: getObjectUrl };
})();
