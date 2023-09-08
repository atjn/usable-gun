import mathRandomPlugin from "./../usableLib/mathRandomPlugin.js";
import __import_node_fs from "node:fs";
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

	/* BEGIN WRAPPED GUN CODE */
	mathRandomPlugin(__usable_environment);
	function Store(opt) {
		opt = opt || {};
		opt.log = opt.log || __usable_globalThis.debug.log;
		opt.file = String(opt.file || "radata");
		var fs = __import_node_fs;
		var store = () => {};
		if (Store[opt.file]) {
			__usable_globalThis.debug.log(
				"Warning: reusing same fs store and options as 1st.",
			);
			return Store[opt.file];
		}
		Store[opt.file] = store;
		var puts = {};

		// TODO!!! ADD ZLIB INFLATE / DEFLATE COMPRESSION!
		store.put = (file, data, cb) => {
			var random = __usable_globalThis.mathRandom().toString(36).slice(-3);
			puts[file] = {
				id: random,
				data,
			};
			var tmp = opt.file + "-" + file + "-" + random + ".tmp";
			fs.writeFile(tmp, data, (err) => {
				if (err) {
					if (random === (puts[file] || "").id) {
						delete puts[file];
					}
					return cb(err);
				}
				move(tmp, opt.file + "/" + file, (err, ok) => {
					if (random === (puts[file] || "").id) {
						delete puts[file];
					}
					cb(err, ok || !err);
				});
			});
		};
		store.get = (file, cb) => {
			var tmp; // this took 3s+?
			if ((tmp = puts[file])) {
				cb(undefined, tmp.data);
				return;
			}
			fs.readFile(opt.file + "/" + file, (err, data) => {
				if (err) {
					if ("ENOENT" === (err.code || "").toUpperCase()) {
						return cb();
					}
					opt.log("ERROR:", err);
				}
				cb(err, data);
			});
		};
		if (!fs.existsSync(opt.file)) {
			fs.mkdirSync(opt.file);
		}
		function move(oldPath, newPath, cb) {
			fs.rename(oldPath, newPath, (err) => {
				if (err) {
					if (err.code === "EXDEV") {
						var readStream = fs.createReadStream(oldPath);
						var writeStream = fs.createWriteStream(newPath);
						readStream.on("error", cb);
						writeStream.on("error", cb);
						readStream.on("close", () => {
							fs.unlink(oldPath, cb);
						});
						readStream.pipe(writeStream);
					} else {
						cb(err);
					}
				} else {
					cb();
				}
			});
		}
		store.list = (cb) => {
			var dir = fs.readdirSync(opt.file);
			dir.forEach((file) => {
				cb(file);
			});
			cb();
		};
		return store;
	}
	var Gun =
		typeof __usable_window !== "undefined"
			? __usable_window.Gun
			: gunPlugin(__usable_environment);
	Gun.on("create", function (root) {
		this.to.next(root);
		var opt = root.opt;
		if (opt.rfs === false) {
			return;
		}
		opt.store = opt.store || (!Gun.window && Store(opt));
	});
	__usable_module.exports = Store;
	__usable_environment.exports.lib.rfs = __usable_module.exports;
	return __usable_module.exports;
}
