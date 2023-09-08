let __usable_isActivated = false;
const __usable_module = {};
export default async function (__usable_environment) {
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

	//TODO: implement require and dirname
	/* BEGIN WRAPPED GUN CODE */
	await (async () => {
		// RAD
		__usable_globalThis.debug.log(
			"Warning: Experimental rewrite of RAD to use Book. It is not API compatible with RAD yet and is very alpha.",
		);
		var Book = __usable_globalThis.settimeoutBook;

		var RAD =
			__usable_globalThis.settimeoutRAD ||
			(__usable_globalThis.settimeoutRAD = (opt) => {
				opt = opt || {};
				opt.file = String(opt.file || "radata");
				var log = opt.log || nope;
				var has = (__usable_globalThis.settimeoutRADHas ||
					(__usable_globalThis.settimeoutRADHas = {}))[opt.file];
				if (has) {
					return has;
				}
				var r = function rad(word, is, reply) {
						if (!b) {
							start(word, is, reply);
							return r;
						}
						if (is === undefined || "function" == typeof is) {
							// THIS IS A READ:
							var page = b.page(word);
							if (page.from) {
								return is(null, page);
							}
							read(word, is, page); // get from disk
							return;
						}
						//console.log("OFF");return;
						// ON WRITE:
						// batch until read from disk is done (and if a write was going, do that first)
						b(word, is);
						write(word, reply);
						return r;
					},
					/** @param b the book */ b;
				async function read(word, reply, page) {
					var p = page; //b.page(word);
					reply = reply.call ? reply : () => {};
					log(`read() ${word.slice(0, 40)}`);
					get(p, (err, disk) => {
						if (err) {
							log("ERR! in read() get() cb", err);
							reply(err);
							return;
						}
						p.from = disk || p.from;
						reply(null, p, b);
					});
				}
				async function write(word, reply) {
					log("write() word", word);
					var p = b.page(word),
						tmp;
					if ((tmp = p.saving)) {
						reply && tmp.push(reply);
						return;
					}
					p.saving = [reply];
					var S = +new Date();
					log(
						"   writing",
						p.substring(),
						"since last",
						S - p.saved,
						RAD.c,
						"records",
						env.count++,
						"mid-swap.",
					);
					get(p, (err, disk) => {
						if (err) {
							log("ERR! in write() get() cb ", err);
							return;
						}
						log("      get() - p.saving ", (p.saving || []).length);
						if (p.from && disk) {
							log(
								"      get() merge: p.from ",
								p.toString().slice(0, 40),
								" disk.length",
								disk?.length || 0,
							);
						}
						p.from = disk || p.from; // TODO: NEED TO MERGE! AND HANDLE ERR!
						// p.list = p.text = p.from = 0;
						// p.first = p.first.word || p.first;
						tmp = p.saving;
						p.saving = [];
						put(p, "" + p, (err, ok) => {
							env.count--;
							p.saved = +new Date();
							log(
								"      ...wrote %d bytes in %dms",
								("" + p).length,
								(p.saved = +new Date()) - S,
							);
							if (!p.saving.length) {
								p.saving = 0;
								reply?.call && reply(err, ok);
								return;
							}
							p.saving = 0; // what?
							// log({ tmp });
							write(word, reply);
						});
					});
				}
				function put(file, data, cb) {
					file.first && (file = Book.slot(file.first)[0]);
					put[(file = fname(file))] = {
						data,
					};
					RAD.put(file, data, (err, ok) => {
						delete put[file];
						cb && cb(err, ok);
					});
				}
				function get(file, cb) {
					var tmp;
					file.first && (file = Book.slot(file.first)[0]);
					if ((tmp = put[(file = fname(file))])) {
						cb(undefined, tmp.data);
						return;
					}
					if ((tmp = get[file])) {
						tmp.push(cb);
						return;
					}
					get[file] = [cb];
					RAD.get(file, (err, data) => {
						tmp = get[file];
						delete get[file];
						var i = -1,
							f;
						while ((f = tmp[++i])) {
							f(err, data);
						} // CPU SCHEDULE?
					});
				}

				function start(word, is, reply) {
					if (b) {
						r(word, is, reply);
						return;
					}
					get(" ", (err, d) => {
						if (err) {
							log("ERR! in start() get()", err);
							reply && reply(err);
							return;
						}
						if (b) {
							r(word, is, reply);
							return;
						}
						//wrap(b = r.book = Book(d));
						(b = r.book = Book()).list = Book.slot(d);
						watch(b).list[0] = "'!'";
						r(word, is, reply);
					});
				}
				function watch(b) {
					// SPLIT LOGIC!
					var split = b.split;
					b.list.toString = function () {
						__usable_globalThis.debug.time();
						var i = -1,
							t = "",
							p;
						while ((p = this[++i])) {
							t += "|" + p.substring();
						}
						t += "|";
						__usable_globalThis.debug.timeEnd();
						return t;
					};
					b.split = (next, page) => {
						log("SPLIT!!!!", b.list.length);
						put(" ", "" + b.list, (err, ok) => {
							if (err) {
								__usable_globalThis.debug.log("ERR!");
								return;
							}
							// ??
						});
					};

					return b;
				}
				function ename(t) {
					return encodeURIComponent(t).replace(/\*/g, "%2A").slice(0, 250);
				}
				function fname(p) {
					return opt.file + "/" + ename(p.substring());
				}
				return r;
			});
		/* 300000000 */ try {
			__usable_module.exports = RAD;
		} catch (e) {}

		// junk below that needs to be cleaned up and corrected for the actual correct RAD API.
		var env = {};

		var nope = () => {};
		var nah = () => nope;
		env.require =
			(typeof __usable_globalThis.require !== "undefined" &&
				__usable_globalThis.require) ||
			nope;
		env.process = (typeof __usable_globalThis.process != "undefined" &&
			__usable_globalThis.process) || {
			memoryUsage: nah,
		};
		env.os = (await import("node:os")).default || {
			totalmem: nope,
			freemem: nope,
		};
		env.v8 = (await import("node:v8")).default || {
			getHeapStatistics: nah,
		};
		env.fs = (await import("node:fs")).default || {
			writeFile: nope,
			readFile: nope,
		};
		env.max = env.v8.getHeapStatistics().total_available_size / 2 ** 12;
		env.count = env.last = 0;
		return;

		//if(err && 'ENOENT' === (err.code||'').toUpperCase()){ err = null }
	})();

	await (async () => {
		// temporary fs storage plugin, needs to be refactored to use the actual RAD plugin interface.
		var fs;
		try {
			fs = (await import("node:fs")).default;
		} catch (e) {}
		if (!fs) {
			return;
		}
		var RAD = __usable_globalThis.settimeoutRAD;
		RAD.put = (file, data, cb) => {
			fs.writeFile(file, data, cb);
		};
		RAD.get = (file, cb) => {
			fs.readFile(file, (err, data) => {
				if (err && "ENOENT" === (err.code || "").toUpperCase()) {
					return cb();
				}
				cb(err, data.toString());
			});
		};
	})();
	(() => {
		// temporary fs storage plugin, needs to be refactored to use the actual RAD plugin interface.
		var lS;
		try {
			lS = __usable_globalThis.localStorage;
		} catch (e) {}
		if (!lS) {
			return;
		}
		var RAD = __usable_globalThis.settimeoutRAD;
		RAD.put = (file, data, cb) => {
			lS[file] = data;
			cb(null, 1);
		};
		RAD.get = (file, cb) => {
			cb(null, lS[file]);
		};
	})();
	(() => {
		return;
	})();
	__usable_environment.exports.lib.radisk3 = __usable_module.exports;
	return __usable_module.exports;
}
