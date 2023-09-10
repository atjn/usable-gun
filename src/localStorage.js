import mathRandomPlugin from "./../usableLib/mathRandomPlugin.js";
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
	mathRandomPlugin(__usable_environment);
	if (typeof __usable_globalThis.Gun === "undefined") {
		return;
	}
	var noop = () => {};
	var store;
	try {
		store = (__usable_globalThis.Gun.window || noop).localStorage;
	} catch (e) {}
	if (!store) {
		__usable_globalThis.Gun.log(
			"Warning: No localStorage exists to persist data to!",
		);
		store = {
			setItem(k, v) {
				this[k] = v;
			},
			removeItem(k) {
				delete this[k];
			},
			getItem(k) {
				return this[k];
			},
		};
	}
	__usable_globalThis.jsonParseAsync ||
		((t, cb, r) => {
			try {
				cb(undefined, JSON.parse(t, r));
			} catch (e) {
				cb(e);
			}
		});
	var json =
		__usable_globalThis.jsonStringifyAsync ||
		((v, cb, r, s) => {
			try {
				cb(undefined, JSON.stringify(v, r, s));
			} catch (e) {
				cb(e);
			}
		});
	__usable_globalThis.Gun.on("create", function lg(root) {
		this.to.next(root);
		var opt = root.opt;
		var graph = root.graph;
		var acks = [];
		var disk;
		var to;
		var size;
		var stop;
		if (false === opt.localStorage) {
			return;
		}
		opt.prefix = opt.file || "gun/";
		try {
			disk = lg[opt.prefix] =
				lg[opt.prefix] || JSON.parse((size = store.getItem(opt.prefix))) || {}; // TODO: Perf! This will block, should we care, since limited to 5MB anyways?
		} catch (e) {
			disk = lg[opt.prefix] = {};
		}
		size = (size || "").length;
		root.on("get", function (msg) {
			this.to.next(msg);
			var lex = msg.get;
			var soul;
			var data;
			var tmp;
			if (!lex || !(soul = lex["#"])) {
				return;
			}
			data = disk[soul] || undefined;
			if (data && (tmp = lex["."]) && !__usable_globalThis.objectPlain(tmp)) {
				// pluck!
				data = __usable_globalThis.Gun.state.ify(
					{},
					tmp,
					__usable_globalThis.Gun.state.is(data, tmp),
					data[tmp],
					soul,
				);
			}
			//if(data){ (tmp = {})[soul] = data } // back into a graph.
			//setTimeout(function(){
			__usable_globalThis.Gun.on.get.ack(msg, data); //root.on('in', {'@': msg['#'], put: tmp, lS:1});// || root.$});
			//}, Math.random() * 10); // FOR TESTING PURPOSES!
		});

		root.on("put", function (msg) {
			this.to.next(msg); // remember to call next middleware adapter
			var put = msg.put; // pull data off wire envelope
			var soul = put["#"];
			var key = put["."];
			var id = msg["#"];
			var ok = msg.ok || "";
			disk[soul] = __usable_globalThis.Gun.state.ify(
				disk[soul],
				key,
				put[">"],
				put[":"],
				soul,
			); // merge into disk object
			if (stop && size > 4999880) {
				root.on("in", {
					"@": id,
					err: "localStorage max!",
				});
				return;
			}
			//if(!msg['@']){ acks.push(id) } // then ack any non-ack write. // TODO: use batch id.
			if (
				!msg["@"] &&
				(!msg._.via || __usable_globalThis.mathRandom() < ok["@"] / ok["/"])
			) {
				acks.push(id);
			} // then ack any non-ack write. // TODO: use batch id.
			if (to) {
				return;
			}
			to = setTimeout(flush, 9 + size / 333); // 0.1MB = 0.3s, 5MB = 15s
		});

		function flush() {
			if (
				!acks.length &&
				((__usable_globalThis.settimeoutTurn || "").s || "").length
			) {
				setTimeout(flush, 99);
				return;
			} // defer if "busy" && no saves.
			var ack = acks;
			clearTimeout(to);
			to = false;
			acks = [];
			json(disk, (err, tmp) => {
				try {
					!err && store.setItem(opt.prefix, tmp);
				} catch (e) {
					err = stop = e || "localStorage failure";
				}
				if (err) {
					__usable_globalThis.Gun.log(
						err +
							" Consider using GUN's IndexedDB plugin for RAD for more storage space, https://gun.eco/docs/RAD#install",
					);
					root.on("localStorage:error", {
						err,
						get: opt.prefix,
						put: disk,
					});
				}
				size = tmp.length;

				//if(!err && !Object.empty(opt.peers)){ return } // only ack if there are no peers. // Switch this to probabilistic mode
				__usable_globalThis.settimeoutEach(
					ack,
					(id) => {
						root.on("in", {
							"@": id,
							err,
							ok: 0,
						}); // localStorage isn't reliable, so make its `ok` code be a low number.
					},
					0,
					99,
				);
			});
		}
	});
}
