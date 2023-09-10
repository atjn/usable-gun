import gunPlugin from "../gun.js";
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

	/* BEGIN WRAPPED GUN CODE */

	(() => {
		if ("debug" !== __usable_globalThis.process.env.GUN_ENV) {
			return;
		}
		var db = {
			length: 0,
			hash: {},
		};
		__usable_globalThis.debug.log("start :)");
		__usable_globalThis.DEBUG = 1;
		setInterval(() => {
			var print = "";
			var tmp;
			var mem = __usable_globalThis.process.memoryUsage();
			var used = mem.rss / 1024 / 1024;
			used = used.toFixed(1);
			print += used + " MB rss. ";
			var used = mem.heapTotal / 1024 / 1024;
			used = used.toFixed(1);
			print += used + " MB hT. ";
			var used = mem.heapUsed / 1024 / 1024;
			used = used.toFixed(1);
			print += used + " MB hU. ";
			if (db.root) {
				db.concurrency = Object.keys(db.peers || {}).length;
				print += db.concurrency + " peers. ";
				db.nodes = Object.keys(db.root.graph || {}).length;
				print += db.nodes + " nodes. ";
				if (db.count) {
					print += db.count + " msgs. ";
				}
				if ((tmp = db.root.msgsLength)) {
					tmp = (tmp / 1024 / 1024).toFixed(2);
					print += tmp + " length MB. ";
				}
				if (db.last) {
					print += "\n" + JSON.stringify(db.last, null, 2);
				}
				if (db.hash) {
					print +=
						"\nSome 100 Fast Hash Counts: \n" +
						JSON.stringify(db.hash, null, 2);
					var l = Object.keys(db.hash);
					var i = l.length;
					if (i > 100) {
						i = i - 100;
						Gun.list.map(l, (k) => {
							if (--i <= 0) {
								return;
							}
							delete db.hash[k];
						});
					}
				}
			}
			db.print = print;
			print = print.split("\n")[0];
			__usable_globalThis.debug.log(print);
		}, 2500);
		var Gun = gunPlugin(__usable_environment);
		Gun.on("opt", function (root) {
			this.to.next(root);
			if (root.once) {
				return;
			}
			__usable_globalThis.debug.log(">>>>>>>>>", root);
			root.debug = db;
			db.root = root;
			db.peers = root.opt.peers;
			db.count = 0;
			root.on("in", function (msg) {
				this.to.next(msg);
				if (!msg.NTS) {
					db.last = msg;
				}
				db.count++;
				var tmp = msg["##"];
				if (tmp && msg.put) {
					if (!db.hash[tmp]) {
						db.hash[tmp] = [0, ""];
					}
					db.hash[tmp][0] = (db.hash[tmp][0] || 0) + 1;
					var preview = Object.keys(msg.put || {});
					db.hash[tmp][1] = preview.toString(", ").slice(0, 500) + " ...";
				}
			});
		});
	})();
}
