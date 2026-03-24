/* global firebase */
(function () {
  var LS_KEY = 'flowDesignSystem.comments.v1';
  var AUTHOR_KEY = 'flowDesignSystem.commentAuthor';
  var BC_NAME = 'flow-ds-comments-v1';
  var channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(BC_NAME) : null;
  /** @type {Record<string, Set<Function>>} same-tab refresh after local post (BroadcastChannel skips sender) */
  var localSubscribers = {};

  function loadStore() {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function saveStore(obj) {
    localStorage.setItem(LS_KEY, JSON.stringify(obj));
    if (channel) channel.postMessage({ t: 'sync' });
  }

  function getThread(key) {
    var s = loadStore();
    return Array.isArray(s[key]) ? s[key] : [];
  }

  function appendLocal(key, author, text) {
    var t = (text || '').trim();
    if (!t) return Promise.reject(new Error('empty'));
    var store = loadStore();
    if (!store[key]) store[key] = [];
    var entry = {
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 9),
      author: (author || '').trim() || 'Anonymous',
      text: t,
      at: new Date().toISOString(),
    };
    store[key].push(entry);
    saveStore(store);
    var subs = localSubscribers[key];
    if (subs) subs.forEach(function (fn) { fn(); });
    return Promise.resolve();
  }

  var db = null;
  var useFirestore = false;

  function initFirestore() {
    var cfg = window.__FIREBASE_CONFIG__;
    if (!cfg || !cfg.apiKey || typeof firebase === 'undefined') return false;
    try {
      if (!firebase.apps.length) firebase.initializeApp(cfg);
      db = firebase.firestore();
      return true;
    } catch (e) {
      console.warn('[DesignSystemComments] Firestore init failed:', e);
      return false;
    }
  }

  useFirestore = initFirestore();

  function normalizeDoc(doc) {
    var d = doc.data();
    var ts = '';
    if (d.createdAt && typeof d.createdAt.toDate === 'function') {
      ts = d.createdAt.toDate().toISOString();
    } else if (d.at) ts = d.at;
    return { id: doc.id, author: d.author || '', text: d.text || '', at: ts };
  }

  function subscribeFirestore(key, callback) {
    // Only .where() — no .orderBy() so Firebase does not require a composite index.
    // We sort by time in the client instead.
    var q = db.collection('platform_comments').where('componentKey', '==', key);
    return q.onSnapshot(
      function (snap) {
        var items = [];
        snap.forEach(function (doc) {
          items.push(normalizeDoc(doc));
        });
        items.sort(function (a, b) {
          var ta = a.at || '';
          var tb = b.at || '';
          if (ta !== tb) return ta.localeCompare(tb);
          return String(a.id).localeCompare(String(b.id));
        });
        callback(items);
      },
      function (err) {
        console.error('[DesignSystemComments] Firestore listener:', err);
      }
    );
  }

  function addFirestore(key, author, text) {
    return db.collection('platform_comments').add({
      componentKey: key,
      author: (author || '').trim() || 'Anonymous',
      text: (text || '').trim(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  function subscribeLocal(key, callback) {
    function emit() {
      var list = getThread(key).slice().sort(function (a, b) {
        return (a.at || '').localeCompare(b.at || '');
      });
      callback(list);
    }
    if (!localSubscribers[key]) localSubscribers[key] = new Set();
    localSubscribers[key].add(emit);
    emit();
    function onBC() {
      emit();
    }
    function onStorage(e) {
      if (e.key === LS_KEY) emit();
    }
    if (channel) channel.addEventListener('message', onBC);
    window.addEventListener('storage', onStorage);
    return function () {
      localSubscribers[key].delete(emit);
      if (channel) channel.removeEventListener('message', onBC);
      window.removeEventListener('storage', onStorage);
    };
  }

  window.DesignSystemComments = {
    isCloud: useFirestore,
    subscribe: function (key, callback) {
      if (!key) return function () {};
      if (useFirestore) return subscribeFirestore(key, callback);
      return subscribeLocal(key, callback);
    },
    add: function (key, author, text) {
      if (!key) return Promise.reject(new Error('no key'));
      if (useFirestore) return addFirestore(key, author, text);
      return appendLocal(key, author, text);
    },
    getAuthor: function () {
      return localStorage.getItem(AUTHOR_KEY) || '';
    },
    setAuthor: function (name) {
      localStorage.setItem(AUTHOR_KEY, (name || '').trim());
    },
  };
})();
