import gunPlugin from "../gun.js";
import radix2Plugin from "./radix2.js";
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
		__usable_globalThis.debug.log("RADISK 2!!!!");
		function Radisk(opt) {
			opt = opt || {};
			opt.log = opt.log || __usable_globalThis.debug.log;
			opt.file = String(opt.file || "radata");
			var has = (Radisk.has || (Radisk.has = {}))[opt.file];
			if (has) {
				return has;
			}
			opt.pack =
				opt.pack || (opt.memory ? opt.memory * 1000 * 1000 : 1399000000) * 0.3; // max_old_space_size defaults to 1400 MB.
			opt.until = opt.until || opt.wait || 250;
			opt.batch = opt.batch || 10 * 1000;
			opt.chunk = opt.chunk || 1024 * 1024 * 1; // 1MB
			opt.code = opt.code || {};
			opt.code.from = opt.code.from || "!";
			//opt.jsonify = true; // TODO: REMOVE!!!!

			function ename(t) {
				return encodeURIComponent(t).replace(/\*/g, "%2A");
			}
			function atomic(v) {
				return undefined !== v && (!v || "object" != typeof v);
			}
			var map = Gun.obj.map;
			var LOG = false;
			if (!opt.store) {
				return opt.log(
					"ERROR: Radisk needs `opt.store` interface with `{get: fn, put: fn (, list: fn)}`!",
				);
			}
			if (!opt.store.put) {
				return opt.log(
					"ERROR: Radisk needs `store.put` interface with `(file, data, cb)`!",
				);
			}
			if (!opt.store.get) {
				return opt.log(
					"ERROR: Radisk needs `store.get` interface with `(file, cb)`!",
				);
			}
			if (!opt.store.list) {
				//opt.log("WARNING: `store.list` interface might be needed!");
			}

			/*
      	Any and all storage adapters should...
      	1. Because writing to disk takes time, we should batch data to disk. This improves performance, and reduces potential disk corruption.
      	2. If a batch exceeds a certain number of writes, we should immediately write to disk when physically possible. This caps total performance, but reduces potential loss.
      */
			var r = (key, val, cb) => {
				key = "" + key;
				if (val instanceof Function) {
					var o = cb || {};
					cb = val;
					val = r.batch(key);
					if (undefined !== val) {
						cb(undefined, r.range(val, o), o);
						if (atomic(val)) {
							return;
						}
						// if a node is requested and some of it is cached... the other parts might not be.
					}

					if (r.thrash.at) {
						val = r.thrash.at(key);
						if (undefined !== val) {
							cb(undefined, r.range(val, o), o);
							if (atomic(val)) {
								cb(undefined, val, o);
								return;
							}
							// if a node is requested and some of it is cached... the other parts might not be.
						}
					}

					return r.read(key, cb, o);
				}
				r.batch(key, val);
				if (cb) {
					r.batch.acks.push(cb);
				}
				if (++r.batch.ed >= opt.batch) {
					return r.thrash();
				} // (2)
				if (r.batch.to) {
					return;
				}
				//clearTimeout(r.batch.to); // (1) // THIS LINE IS EVIL! NEVER USE IT! ALSO NEVER DELETE THIS SO WE NEVER MAKE THE SAME MISTAKE AGAIN!
				r.batch.to = setTimeout(r.thrash, opt.until || 1);
			};
			r.batch = Radix();
			r.batch.acks = [];
			r.batch.ed = 0;
			r.thrash = () => {
				var thrash = r.thrash;
				if (thrash.ing) {
					return (thrash.more = true);
				}
				thrash.more = false;
				thrash.ing = true;
				var batch = (thrash.at = r.batch);
				var i = 0;
				clearTimeout(r.batch.to);
				r.batch = null;
				r.batch = Radix();
				r.batch.acks = [];
				r.batch.ed = 0;
				//var id = Gun.text.random(2), S = (+new Date); console.log("<<<<<<<<<<<<", id);
				r.save(batch, (err, ok) => {
					if (++i > 1) {
						opt.log(
							"RAD ERR: Radisk has callbacked multiple times, please report this as a BUG at github.com/amark/gun/issues ! " +
								i,
						);
						return;
					}
					if (err) {
						opt.log("err", err);
					}
					//console.log(">>>>>>>>>>>>", id, ((+new Date) - S), batch.acks.length);
					map(batch.acks, (cb) => {
						cb(err, ok);
					});
					thrash.at = null;
					thrash.ing = false;
					if (thrash.more) {
						thrash();
					}
				});
			};

			/*
      	1. Find the first radix item in memory.
      	2. Use that as the starting index in the directory of files.
      	3. Find the first file that is lexically larger than it,
      	4. Read the previous file to that into memory
      	5. Scan through the in memory radix for all values lexically less than the limit.
      	6. Merge and write all of those to the in-memory file and back to disk.
      	7. If file too large, split. More details needed here.
      */
			r.save = (rad, cb) => {
				var s = () => {};
				s.find = (tree, key) => {
					if (key < s.start) {
						return;
					}
					s.start = key;
					r.list(s.lex);
					return true;
				};
				s.lex = (file) => {
					file = undefined === file ? undefined : decodeURIComponent(file);
					if (!file || file > s.start) {
						s.mix(s.file || opt.code.from, s.start, (s.end = file));
						return true;
					}
					s.file = file;
				};
				s.mix = (file, start, end) => {
					s.start = s.end = s.file = undefined;
					r.parse(file, (err, disk) => {
						if (err) {
							return cb(err);
						}
						disk = disk || Radix();
						Radix.map(rad, (val, key) => {
							if (key < start) {
								return;
							}
							if (end && end < key) {
								return (s.start = key);
							}
							// PLUGIN: consider adding HAM as an extra layer of protection
							disk(key, val); // merge batch[key] -> disk[key]
						});

						r.write(file, disk, s.next);
					});
				};
				s.next = (err, ok) => {
					if ((s.err = err)) {
						return cb(err);
					}
					if (s.start) {
						return Radix.map(rad, s.find);
					}
					cb(err, ok);
				};
				Radix.map(rad, s.find);
			};

			/*
      	Any storage engine at some point will have to do a read in order to write.
      	This is true of even systems that use an append only log, if they support updates.
      	Therefore it is unavoidable that a read will have to happen,
      	the question is just how long you delay it.
      */
			r.write = (file, rad, cb, o) => {
				o =
					"object" == typeof o
						? o
						: {
								force: o,
						  };
				var f = () => {};
				f.text = "";
				f.count = 0;
				f.file = file;
				f.each = (val, key, k, pre) => {
					//console.log("RAD:::", JSON.stringify([val, key, k, pre]));
					if (undefined !== val) {
						f.count++;
					}
					if (opt.pack <= (val || "").length) {
						return cb("Record too big!"), true;
					}
					var enc =
						Radisk.encode(pre.length) +
						"#" +
						Radisk.encode(k) +
						(undefined === val ? "" : ":" + Radisk.encode(val)) +
						"\n";
					if (
						opt.chunk < f.text.length + enc.length &&
						1 < f.count &&
						!o.force
					) {
						f.text = "";
						f.limit = Math.ceil(f.count / 2);
						f.count = 0;
						f.sub = Radix();
						Radix.map(rad, f.slice);
						return true;
					}
					f.text += enc;
				};
				f.write = () => {
					var tmp = ename(file);
					var start;
					LOG && (start = +new Date()); // comment this out!
					opt.store.put(tmp, f.text, (err) => {
						LOG &&
							__usable_globalThis.debug.log(
								"wrote JSON in",
								+new Date() - start,
							); // comment this out!
						if (err) {
							return cb(err);
						}
						r.list.add(tmp, cb);
					});
				};
				f.slice = (val, key) => {
					if (key < f.file) {
						return;
					}
					if (f.limit < ++f.count) {
						var name = f.file;
						f.file = key;
						f.count = 0;
						r.write(name, f.sub, f.next, o);
						return true;
					}
					f.sub(key, val);
				};
				f.next = (err) => {
					if (err) {
						return cb(err);
					}
					f.sub = Radix();
					if (!Radix.map(rad, f.slice)) {
						r.write(f.file, f.sub, cb, o);
					}
				};
				if (opt.jsonify) {
					return r.write.jsonify(f, file, rad, cb, o);
				} // temporary testing idea
				if (!Radix.map(rad, f.each, true)) {
					f.write();
				}
			};
			r.write.jsonify = (f, file, rad, cb, o) => {
				var raw;
				var start;
				LOG && (start = +new Date()); // comment this out!
				try {
					raw = JSON.stringify(rad.$);
				} catch (e) {
					return cb("Record too big!");
				}
				LOG &&
					__usable_globalThis.debug.log(
						"stringified JSON in",
						+new Date() - start,
					); // comment this out!
				if (opt.chunk < raw.length && !o.force) {
					if (Radix.map(rad, f.each, true)) {
						return;
					}
				}
				f.text = raw;
				f.write();
			};
			r.range = (tree, o) => {
				if (!tree || !o) {
					return;
				}
				if (undefined === o.start && undefined === o.end) {
					return tree;
				}
				if (atomic(tree)) {
					return tree;
				}
				var sub = Radix();
				Radix.map(
					tree,
					(v, k) => {
						sub(k, v);
					},
					o,
				);
				return sub("");
			};
			(() => {
				var Q = {};
				r.read = (key, cb, o) => {
					o = o || {};
					if (RAD && !o.next) {
						// cache
						var val = RAD(key);
						//if(u !== val){
						//cb(u, val, o);
						if (atomic(val)) {
							cb(undefined, val, o);
							return;
						}
						// if a node is requested and some of it is cached... the other parts might not be.
						//}
					}

					o.span = undefined !== o.start || undefined !== o.end;
					var g = () => {};
					g.lex = (file) => {
						var tmp;
						file = undefined === file ? undefined : decodeURIComponent(file);
						tmp =
							o.next || key || (o.reverse ? o.end || "\uffff" : o.start || "");
						if (!file || (o.reverse ? file < tmp : file > tmp)) {
							if (o.next || o.reverse) {
								g.file = file;
							}
							if ((tmp = Q[g.file])) {
								tmp.push({
									key,
									ack: cb,
									file: g.file,
									opt: o,
								});
								return true;
							}
							Q[g.file] = [
								{
									key,
									ack: cb,
									file: g.file,
									opt: o,
								},
							];
							if (!g.file) {
								g.it(null, undefined, {});
								return true;
							}
							r.parse(g.file, g.it);
							return true;
						}
						g.file = file;
					};
					g.it = (err, disk, info) => {
						if ((g.err = err)) {
							opt.log("err", err);
						}
						g.info = info;
						if (disk) {
							RAD = g.disk = disk;
						}
						disk = Q[g.file];
						delete Q[g.file];
						map(disk, g.ack);
					};
					g.ack = (as) => {
						if (!as.ack) {
							return;
						}
						var tmp = as.key;
						var o = as.opt;
						var info = g.info;
						var rad = g.disk || noop;
						var data = r.range(rad(tmp), o);
						var last = rad.last;
						o.parsed = (o.parsed || 0) + (info.parsed || 0);
						o.chunks = (o.chunks || 0) + 1;
						if (!o.some) {
							o.some = undefined !== data;
						}
						if (undefined !== data) {
							as.ack(g.err, data, o);
						} else if (!as.file) {
							!o.some && as.ack(g.err, undefined, o);
							return;
						}
						if (!o.span) {
							if (/*!last || */ last === tmp) {
								!o.some && as.ack(g.err, undefined, o);
								return;
							}
							if (last && last > tmp && 0 != last.indexOf(tmp)) {
								!o.some && as.ack(g.err, undefined, o);
								return;
							}
						}
						if (o.some && o.parsed >= o.limit) {
							return;
						}
						o.next = as.file;
						r.read(tmp, as.ack, o);
					};
					if (o.reverse) {
						g.lex.reverse = true;
					}
					r.list(g.lex);
				};
			})();
			(() => {
				/*
        	Let us start by assuming we are the only process that is
        	changing the directory or bucket. Not because we do not want
        	to be multi-process/machine, but because we want to experiment
        	with how much performance and scale we can get out of only one.
        	Then we can work on the harder problem of being multi-process.
        */
				var Q = {};

				var s = String.fromCharCode(31);
				r.parse = (file, cb, raw) => {
					var q;
					if ((q = Q[file])) {
						return q.push(cb);
					}
					q = Q[file] = [cb];
					var p = () => {};
					var info = {};
					p.disk = Radix();
					p.read = (err, data) => {
						var tmp;
						delete Q[file];
						if ((p.err = err) || (p.not = !data)) {
							return map(q, p.ack);
						}
						if (typeof data !== "string") {
							try {
								if (opt.pack <= data.length) {
									p.err = "Chunk too big!";
								} else {
									data = data.toString(); // If it crashes, it crashes here. How!?? We check size first!
								}
							} catch (e) {
								p.err = e;
							}
							if (p.err) {
								return map(q, p.ack);
							}
						}
						info.parsed = data.length;
						var start;
						LOG && (start = +new Date()); // keep this commented out in production!
						if (opt.jsonify) {
							// temporary testing idea
							try {
								var json = JSON.parse(data);
								p.disk.$ = json;
								LOG &&
									__usable_globalThis.debug.log(
										"parsed JSON in",
										+new Date() - start,
									); // keep this commented out in production!
								map(q, p.ack);
								return;
							} catch (e) {
								tmp = e;
							}
							if ("{" === data[0]) {
								p.err = tmp || "JSON error!";
								return map(q, p.ack);
							}
						}
						var start;
						LOG && (start = +new Date()); // keep this commented out in production!
						var tmp = p.split(data);
						var pre = [];
						var i;
						var k;
						var v;
						var at;
						var ats = [];
						if (!tmp || 0 !== tmp[1]) {
							p.err = "File '" + file + "' does not have root radix! ";
							return map(q, p.ack);
						}
						while (tmp) {
							k = v = undefined;
							i = tmp[1];
							tmp = p.split(tmp[2]) || "";
							if ("#" == tmp[0]) {
								k = tmp[1];
								pre = pre.slice(0, i);
								if (i <= pre.length) {
									pre.push(k);
								}
							}
							tmp = p.split(tmp[2]) || "";
							if ("\n" == tmp[0]) {
								at = ats[i] || p.disk.at;
								p.disk(k, undefined, at);
								ats[i] = p.disk.at;
								ats[i + 1] = p.disk.at[k] || (p.disk.at[k] = {});
								continue;
							}
							if ("=" == tmp[0] || ":" == tmp[0]) {
								v = tmp[1];
							}
							if (undefined !== k && undefined !== v) {
								// 							p.disk(pre.join(''), v)// mark's code
								at = ats[i]; // || p.disk.at;
								p.disk(k, v, at);
								ats[i] = p.disk.at;
								ats[i + 1] = p.disk.at[k];
							}
							tmp = p.split(tmp[2]);
						}
						LOG &&
							__usable_globalThis.debug.log(
								"parsed JSON in",
								+new Date() - start,
							); // keep this commented out in production!
						//cb(err, p.disk);
						map(q, p.ack);
					};
					p.split = (t) => {
						if (!t) {
							return;
						}
						var l = [];
						var o = {};
						var i = -1;
						var a = "";
						var b;
						i = t.indexOf(s);
						if (!t[i]) {
							return;
						}
						a = t.slice(0, i);
						l[0] = a;
						l[1] = b = Radisk.decode(t.slice(i), o);
						l[2] = t.slice(i + o.i);
						return l;
					};
					p.ack = (cb) => {
						if (!cb) {
							return;
						}
						if (p.err || p.not) {
							return cb(p.err, undefined, info);
						}
						cb(undefined, p.disk, info);
					};
					if (raw) {
						return p.read(null, raw);
					}
					opt.store.get(ename(file), p.read);
				};
			})();
			(() => {
				var dir;
				var q;
				var f = String.fromCharCode(28);
				var ef = ename(f);
				r.list = (cb) => {
					if (dir) {
						var tmp = {
							reverse: cb.reverse ? 1 : 0,
						};
						Radix.map(dir, (val, key) => cb(key), tmp) || cb();
						return;
					}
					if (q) {
						return q.push(cb);
					}
					q = [cb];
					r.parse(f, r.list.init);
				};
				r.list.add = (file, cb) => {
					var has = dir(file);
					if (has || file === ef) {
						return cb(undefined, 1);
					}
					dir(file, true);
					cb.listed = (cb.listed || 0) + 1;
					r.write(
						f,
						dir,
						(err) => {
							if (err) {
								return cb(err);
							}
							cb.listed = (cb.listed || 0) - 1;
							if (cb.listed !== 0) {
								return;
							}
							cb(undefined, 1);
						},
						true,
					);
				};
				r.list.init = (err, disk) => {
					if (err) {
						opt.log("list", err);
						setTimeout(() => {
							r.parse(f, r.list.init);
						}, 1000);
						return;
					}
					if (disk) {
						r.list.drain(disk);
						return;
					}
					if (!opt.store.list) {
						r.list.drain(Radix());
						return;
					}
					// import directory.
					opt.store.list((file) => {
						dir = dir || Radix();
						if (!file) {
							return r.list.drain(dir);
						}
						r.list.add(file, noop);
					});
				};
				r.list.drain = (rad, tmp) => {
					r.list.dir = dir = rad;
					tmp = q;
					q = null;
					Gun.list.map(tmp, (cb) => {
						r.list(cb);
					});
				};
			})();
			var noop = () => {};
			var RAD;
			Radisk.has[opt.file] = r;
			return r;
		}
		(() => {
			var _ = String.fromCharCode(31);
			Radisk.encode = (d, o, s) => {
				s = s || _;
				var t = s;
				var tmp;
				if (typeof d == "string") {
					var i = d.indexOf(s);
					while (i != -1) {
						t += s;
						i = d.indexOf(s, i + 1);
					}
					return t + '"' + d + s;
				} else if (d && d["#"] && (tmp = Gun.val.link.is(d))) {
					return t + "#" + tmp + t;
				} else if (Gun.num.is(d)) {
					return t + "+" + (d || 0) + t;
				} else if (null === d) {
					return t + " " + t;
				} else if (true === d) {
					return t + "+" + t;
				} else if (false === d) {
					return t + "-" + t;
				} // else
				//if(binary){}
			};

			Radisk.decode = (t, o, s) => {
				s = s || _;
				var d = "";
				var i = -1;
				var n = 0;
				var c;
				var p;
				if (s !== t[0]) {
					return;
				}
				while (s === t[++i]) {
					++n;
				}
				p = t[(c = n)] || true;
				while (--n >= 0) {
					i = t.indexOf(s, i + 1);
				}
				if (i == -1) {
					i = t.length;
				}
				d = t.slice(c + 1, i);
				if (o) {
					o.i = i + 1;
				}
				if ('"' === p) {
					return d;
				} else if ("#" === p) {
					return Gun.val.link.ify(d);
				} else if ("+" === p) {
					if (0 === d.length) {
						return true;
					}
					return parseFloat(d);
				} else if (" " === p) {
					return null;
				} else if ("-" === p) {
					return false;
				}
			};
		})();
		if (typeof __usable_window !== "undefined") {
			var Gun = __usable_window.Gun;
			var Radix = __usable_window.Radix;
			__usable_window.Radisk = Radisk;
		} else {
			var Gun = gunPlugin(__usable_environment);
			var Radix = radix2Plugin(__usable_environment);
			try {
				__usable_module.exports = Radisk;
			} catch (e) {}
		}
		Radisk.Radix = Radix;
	})();
	__usable_environment.exports.lib.radisk2 = __usable_module.exports;
	return __usable_module.exports;
}
