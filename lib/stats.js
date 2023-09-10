import gunPlugin from "../gun.js";
import nodePathImport from "node:path";
import nodeOsImport from "node:os";
import nodeFsImport from "node:fs";
import nodeChildProcessImport from "node:child_process";
import ysonPlugin from "./yson.js";
let __usable_isActivated = false;
export default function (__usable_environment) {
	if (__usable_isActivated) return;
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
	const __usable_process =
		__usable_environment.environmentHint !== "server"
			? undefined
			: "process" in globalThis
			? process
			: {
					env: {},
					uptime: () => {},
					cpuUsage: () => {},
					memoryUsage: () => {},
			  };
	const __usable_require =
		__usable_environment.environmentHint !== "server"
			? undefined
			: () => {
					throw new Error(
						"It should not be possible to call this function, please open an issue in `usable-gun` to have this fixed.",
					);
			  };
	const __usable_dirname =
		__usable_environment.environmentHint !== "server"
			? undefined
			: decodeURI(new URL(".", import.meta.url).pathname);

	/* BEGIN WRAPPED GUN CODE */

	var Gun =
		typeof __usable_window !== "undefined"
			? __usable_window.Gun
			: gunPlugin(__usable_environment);
	Gun.on("opt", function (root) {
		this.to.next(root);
		if (root.once) {
			return;
		}
		if (typeof __usable_process === "undefined") {
			return;
		}
		if (typeof __usable_require === "undefined") {
			return;
		}
		if (false === root.opt.stats) {
			return;
		}
		var path = nodePathImport || {};
		var file = root.opt.file
			? path.resolve(root.opt.file).split(path.sep).slice(-1)[0]
			: "radata";
		var noop = () => {};
		var os = nodeOsImport || {};
		var fs = nodeFsImport || {};
		fs.existsSync = fs.existsSync || path.existsSync;
		if (!fs.existsSync) {
			return;
		}
		if (!__usable_process) {
			return;
		}
		__usable_process.uptime = __usable_process.uptime || noop;
		__usable_process.cpuUsage = __usable_process.cpuUsage || noop;
		__usable_process.memoryUsage = __usable_process.memoryUsage || noop;
		os.totalmem = os.totalmem || noop;
		os.freemem = os.freemem || noop;
		os.loadavg = os.loadavg || noop;
		os.cpus = os.cpus || noop;
		var S = +new Date();
		var W;
		var obj_ify = (o) => {
			try {
				o = JSON.parse(o);
			} catch (e) {
				o = {};
			}
			return o;
		};
		setTimeout(() => {
			root.stats =
				obj_ify(
					fs.existsSync(__usable_dirname + "/../stats." + file) &&
						fs
							.readFileSync(__usable_globalThis.__dirname + "/../stats." + file)
							.toString(),
				) || {};
			root.stats.up = root.stats.up || {};
			root.stats.up.start = root.stats.up.start || +new Date();
			root.stats.up.count = (root.stats.up.count || 0) + 1;
			root.stats.stay = root.stats.stay || {};
			root.stats.over = +new Date();
		}, 1);
		setInterval(() => {
			if (!root.stats) {
				root.stats = {};
			}
			if (W) {
				return;
			}
			var stats = root.stats;
			stats.over = -(S - (S = +new Date()));
			(stats.up || {}).time = __usable_process.uptime();
			stats.memory = __usable_process.memoryUsage() || {};
			stats.memory.totalmem = os.totalmem();
			stats.memory.freemem = os.freemem();
			stats.cpu = __usable_process.cpuUsage() || {};
			stats.cpu.loadavg = os.loadavg();
			stats.cpu.stack = (((setTimeout || "").turn || "").s || "").length;
			stats.peers = {};
			stats.peers.count =
				__usable_globalThis.debug.STAT.peers ||
				Object.keys(root.opt.peers || {}).length; // TODO: .keys( is slow
			stats.node = {};
			stats.node.count = Object.keys(root.graph || {}).length; // TODO: .keys( is slow
			stats.all = all;
			stats.sites = __usable_globalThis.debug.STAT.sites;
			all = {}; // will this cause missing stats?
			var dam = root.opt.mesh;
			if (dam) {
				stats.dam = {
					in: {
						count: dam.hear.c,
						done: dam.hear.d,
					},
					out: {
						count: dam.say.c,
						done: dam.say.d,
					},
				};
				dam.hear.c = dam.hear.d = dam.say.c = dam.say.d = 0; // reset
				stats.peers.time = dam.bye.time || 0;
			}
			var rad = root.opt.store;
			rad = rad && rad.stats;
			if (rad) {
				stats.rad = rad;
				root.opt.store.stats = {
					get: {
						time: {},
						count: 0,
					},
					put: {
						time: {},
						count: 0,
					},
				}; // reset
			}

			__usable_globalThis.jsonStringifyAsync(stats, (err, raw) => {
				if (err) {
					return;
				}
				W = true;
				fs.writeFile(__usable_dirname + "/../stats." + file, raw, (err) => {
					W = false;
					err &&
						__usable_globalThis.debug.log(
							(__usable_globalThis.debug.STAT.err = err),
						);
					__usable_globalThis.debug.STAT &&
						__usable_globalThis.debug.STAT(S, +new Date() - S, "stats stash");
				});
			});

			//exec("top -b -n 1", function(err, out){ out && fs.writeFile(__dirname+'/../stats.top.'+file, out, noop) }); // was it really seriously actually this?
			//}, 1000 * 15);
		}, 1000 * 5);
	});
	var exec = nodeChildProcessImport.exec;
	ysonPlugin(__usable_environment);
	var log = Gun.log;
	var all = {};
	__usable_globalThis.debug.STAT = function (a, b, c) {
		if ("number" == typeof a && "number" == typeof b && "string" == typeof c) {
			var tmp = all[c] || (all[c] = []);
			if (1000 < tmp.push([a, b])) {
				all[c] = [];
			} // reset
			//return;
		}

		if (!__usable_globalThis.debug.LOG || log.off) {
			return a;
		}
		return log.apply(Gun, arguments);
	};
}
