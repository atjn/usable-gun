import gunPlugin from "../gun.js";
let __usable_isActivated = false;
const __usable_module = {};
export default function (__usable_environment) {
	if (__usable_isActivated) return __usable_module.exports;
	__usable_isActivated = true;
	const __usable_globalThis = new Proxy(
		"window" in globalThis ? window : globalThis,
		{
			get(target, property) {
				if (["window", "globalThis", "global"].includes(property)) {
					return __usable_globalThis;
				} else if (__usable_environment.library[property] !== undefined) {
					return __usable_environment.library[property];
				} else if ("window" in globalThis) {
					return window[property];
				} else {
					return globalThis[property];
				}
			},
			set(object, property, value) {
				__usable_environment.library[property] = value;
				return true;
			},
		},
	);
	const __usable_window =
		__usable_environment.environmentHint !== "browser"
			? undefined
			: new Proxy("window" in globalThis ? window : globalThis, {
					get(target, property) {
						if (["window", "globalThis", "global"].includes(property)) {
							return __usable_window;
						} else if (__usable_environment.library[property] !== undefined) {
							return __usable_environment.library[property];
						} else if ("window" in globalThis) {
							return window[property];
						} else {
							return undefined;
						}
					},
					set(object, property, value) {
						__usable_environment.library[property] = value;
						return true;
					},
			  });
	//TODO: implement require and dirname

	/* BEGIN WRAPPED GUN CODE */
	(() => {
		/* // from @jabis
    if (navigator.storage && navigator.storage.estimate) {
      const quota = await navigator.storage.estimate();
      // quota.usage -> Number of bytes used.
      // quota.quota -> Maximum number of bytes available.
      const percentageUsed = (quota.usage / quota.quota) * 100;
      console.log(`You've used ${percentageUsed}% of the available storage.`);
      const remaining = quota.quota - quota.usage;
      console.log(`You can write up to ${remaining} more bytes.`);
    }
    */
		function Store(opt) {
			opt = opt || {};
			opt.file = String(opt.file || "radata");
			var store = Store[opt.file];
			var db = null;
			if (store) {
				__usable_globalThis.debug.log(
					"Warning: reusing same IndexedDB store and options as 1st.",
				);
				return Store[opt.file];
			}
			store = Store[opt.file] = () => {};
			try {
				opt.indexedDB =
					opt.indexedDB || Store.indexedDB || __usable_globalThis.indexedDB;
			} catch (e) {}
			try {
				if (!opt.indexedDB || "file:" == location.protocol) {
					var s = store.d || (store.d = {});
					store.put = (f, d, cb) => {
						s[f] = d;
						setTimeout(() => {
							cb(null, 1);
						}, 250);
					};
					store.get = (f, cb) => {
						setTimeout(() => {
							cb(null, s[f] || undefined);
						}, 5);
					};
					__usable_globalThis.debug.log(
						"Warning: No indexedDB exists to persist data to!",
					);
					return store;
				}
			} catch (e) {}
			store.start = () => {
				var o = __usable_globalThis.indexedDB.open(opt.file, 1);
				o.onupgradeneeded = (eve) => {
					eve.target.result.createObjectStore(opt.file);
				};
				o.onsuccess = () => {
					db = o.result;
				};
				o.onerror = (eve) => {
					__usable_globalThis.debug.log(eve || 1);
				};
			};
			store.start();
			store.put = (key, data, cb) => {
				if (!db) {
					setTimeout(() => {
						store.put(key, data, cb);
					}, 1);
					return;
				}
				var tx = db.transaction([opt.file], "readwrite");
				var obj = tx.objectStore(opt.file);
				var req = obj.put(data, "" + key);
				req.onsuccess =
					obj.onsuccess =
					tx.onsuccess =
						() => {
							cb(null, 1);
						};
				req.onabort =
					obj.onabort =
					tx.onabort =
						(eve) => {
							cb(eve || "put.tx.abort");
						};
				req.onerror =
					obj.onerror =
					tx.onerror =
						(eve) => {
							cb(eve || "put.tx.error");
						};
			};
			store.get = (key, cb) => {
				if (!db) {
					setTimeout(() => {
						store.get(key, cb);
					}, 9);
					return;
				}
				var tx = db.transaction([opt.file], "readonly");
				var obj = tx.objectStore(opt.file);
				var req = obj.get("" + key);
				req.onsuccess = () => {
					cb(null, req.result);
				};
				req.onabort = (eve) => {
					cb(eve || 4);
				};
				req.onerror = (eve) => {
					cb(eve || 5);
				};
			};
			setInterval(() => {
				db && db.close();
				db = null;
				store.start();
			}, 1000 * 15); // reset webkit bug?
			return store;
		}
		if (typeof __usable_window !== "undefined") {
			(Store.window = __usable_window.window).RindexedDB = Store;
			Store.indexedDB = __usable_window.indexedDB; // safari bug
		} else {
			try {
				__usable_module.exports = Store;
			} catch (e) {}
		}
		try {
			var Gun = Store.window.Gun || gunPlugin(__usable_environment);
			Gun.on("create", function (root) {
				this.to.next(root);
				root.opt.store = root.opt.store || Store(root.opt);
			});
		} catch (e) {}
	})();
	__usable_environment.exports.lib.rindexed = __usable_module.exports;
	return __usable_module.exports;
}
