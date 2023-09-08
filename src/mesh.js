import mathRandomPlugin from "./../usableLib/mathRandomPlugin.js";
import shimPlugin from "./shim.js";
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
	//TODO: implement require and dirname
	/* BEGIN WRAPPED GUN CODE */
	mathRandomPlugin(__usable_environment);
	shimPlugin(__usable_environment);
	var noop = () => {};
	var parse =
		__usable_globalThis.jsonParseAsync ||
		((t, cb, r) => {
			var d = +new Date();
			try {
				cb(undefined, JSON.parse(t, r), json.sucks(+new Date() - d));
			} catch (e) {
				cb(e);
			}
		});
	var json =
		__usable_globalThis.jsonStringifyAsync ||
		((v, cb, r, s) => {
			var d = +new Date();
			try {
				cb(undefined, JSON.stringify(v, r, s), json.sucks(+new Date() - d));
			} catch (e) {
				cb(e);
			}
		});
	json.sucks = (d) => {
		if (d > 99) {
			__usable_globalThis.debug.log(
				"Warning: JSON blocking CPU detected. Add `gun/lib/yson.js` to fix.",
			);
			json.sucks = noop;
		}
	};
	function Mesh(root) {
		var mesh = () => {};
		var opt = root.opt || {};
		opt.log = opt.log || __usable_globalThis.debug.log;
		opt.gap = opt.gap || opt.wait || 0;
		opt.max =
			opt.max || (opt.memory ? opt.memory * 999 * 999 : 300000000) * 0.3;
		opt.pack = opt.pack || opt.max * 0.01 * 0.01;
		opt.puff = opt.puff || 9; // IDEA: do a start/end benchmark, divide ops/result.
		var puff = __usable_globalThis.settimeoutTurn || setTimeout;
		var dup = root.dup;
		var dup_check = dup.check;
		var dup_track = dup.track;
		var ST = +new Date();
		var hear = (mesh.hear = function (raw, peer) {
			if (!raw) {
				return;
			}
			if (opt.max <= raw.length) {
				return mesh.say(
					{
						dam: "!",
						err: "Message too big!",
					},
					peer,
				);
			}
			if (mesh === this) {
				/*if('string' == typeof raw){ try{
        	var stat = console.STAT || {};
        	//console.log('HEAR:', peer.id, (raw||'').slice(0,250), ((raw||'').length / 1024 / 1024).toFixed(4));
        	
        	//console.log(setTimeout.turn.s.length, 'stacks', parseFloat((-(LT - (LT = +new Date))/1000).toFixed(3)), 'sec', parseFloat(((LT-ST)/1000 / 60).toFixed(1)), 'up', stat.peers||0, 'peers', stat.has||0, 'has', stat.memhused||0, stat.memused||0, stat.memax||0, 'heap mem max');
        }catch(e){ console.log('DBG err', e) }}*/
				hear.d += raw.length || 0;
				++hear.c;
			} // STATS!
			var S = (peer.SH = +new Date());
			var tmp = raw[0];
			var msg;
			//raw && raw.slice && console.log("hear:", ((peer.wire||'').headers||'').origin, raw.length, raw.slice && raw.slice(0,50)); //tc-iamunique-tc-package-ds1
			if ("[" === tmp) {
				parse(raw, (err, msg) => {
					if (err || !msg) {
						return mesh.say(
							{
								dam: "!",
								err: "DAM JSON parse error.",
							},
							peer,
						);
					}
					__usable_globalThis.debug.STAT &&
						__usable_globalThis.debug.STAT(
							+new Date(),
							msg.length,
							"# on hear batch",
						);
					var P = opt.puff;
					(function go() {
						var S = +new Date();
						var i = 0;
						var m;
						while (i < P && (m = msg[i++])) {
							mesh.hear(m, peer);
						}
						msg = msg.slice(i); // slicing after is faster than shifting during.
						__usable_globalThis.debug.STAT &&
							__usable_globalThis.debug.STAT(S, +new Date() - S, "hear loop");
						flush(peer); // force send all synchronously batched acks.
						if (!msg.length) {
							return;
						}
						puff(go, 0);
					})();
				});
				raw = ""; //
				return;
			}
			if (
				"{" === tmp ||
				((raw["#"] || __usable_globalThis.objectPlain(raw)) && (msg = raw))
			) {
				if (msg) {
					return hear.one(msg, peer, S);
				}
				parse(raw, (err, msg) => {
					if (err || !msg) {
						return mesh.say(
							{
								dam: "!",
								err: "DAM JSON parse error.",
							},
							peer,
						);
					}
					hear.one(msg, peer, S);
				});
				return;
			}
		});
		hear.one = (msg, peer, S) => {
			// S here is temporary! Undo.
			var id;

			var hash;
			var tmp;
			var ash;
			var DBG;
			if (msg.DBG) {
				msg.DBG = DBG = {
					DBG: msg.DBG,
				};
			}
			DBG && (DBG.h = S);
			DBG && (DBG.hp = +new Date());
			if (!(id = msg["#"])) {
				id = msg["#"] = __usable_globalThis.stringRandom(9);
			}
			if ((tmp = dup_check(id))) {
				return;
			}
			// DAM logic:
			if (!(hash = msg["##"]) && false && undefined !== msg.put) {
				/*hash = msg['##'] = Type.obj.hash(msg.put)*/
			} // disable hashing for now // TODO: impose warning/penalty instead (?)
			if (
				hash &&
				(tmp = msg["@"] || (msg.get && id)) &&
				dup.check((ash = tmp + hash))
			) {
				return;
			} // Imagine A <-> B <=> (C & D), C & D reply with same ACK but have different IDs, B can use hash to dedup. Or if a GET has a hash already, we shouldn't ACK if same.
			(msg._ = () => {}).via = mesh.leap = peer;
			if ((tmp = msg["><"]) && "string" == typeof tmp) {
				tmp
					.slice(0, 99)
					.split(",")
					.forEach(
						function (k) {
							this[k] = 1;
						},
						(msg._.yo = {}),
					);
			} // Peers already sent to, do not resend.
			// DAM ^
			if ((tmp = msg.dam)) {
				if ((tmp = mesh.hear[tmp])) {
					tmp(msg, peer, root);
				}
				dup_track(id);
				return;
			}
			if ((tmp = msg.ok)) {
				msg._.near = tmp["/"];
			}
			var S = +new Date();
			DBG && (DBG.is = S);
			peer.SI = id;
			dup_track.ed = (d) => {
				if (id !== d) {
					return;
				}
				dup_track.ed = 0;
				if (!(d = dup.s[id])) {
					return;
				}
				d.via = peer;
				if (msg.get) {
					d.it = msg;
				}
			};
			root.on("in", (mesh.last = msg));
			DBG && (DBG.hd = +new Date());
			__usable_globalThis.debug.STAT &&
				__usable_globalThis.debug.STAT(
					S,
					+new Date() - S,
					msg.get ? "msg get" : msg.put ? "msg put" : "msg",
				);
			dup_track(id); // in case 'in' does not call track.
			if (ash) {
				dup_track(ash);
			} //dup.track(tmp+hash, true).it = it(msg);
			mesh.leap = mesh.last = null; // warning! mesh.leap could be buggy.
		};

		hear.c = hear.d = 0;
		(() => {
			var SMIA = 0;
			var loop;
			mesh.hash = (msg, peer) => {
				var h;
				var s;
				var t;
				var S = +new Date();
				json(
					msg.put,
					function hash(err, text) {
						var ss = (s || (s = t = text || "")).slice(0, 32768); // 1024 * 32
						h = __usable_globalThis.stringHash(ss, h);
						s = s.slice(32768);
						if (s) {
							puff(hash, 0);
							return;
						}
						__usable_globalThis.debug.STAT &&
							__usable_globalThis.debug.STAT(
								S,
								+new Date() - S,
								"say json+hash",
							);
						msg._.$put = t;
						msg["##"] = h;
						mesh.say(msg, peer);
						delete msg._.$put;
					},
					sort,
				);
			};
			function sort(k, v) {
				var tmp;
				if (!(v instanceof Object)) {
					return v;
				}
				Object.keys(v)
					.sort()
					.forEach(sorta, {
						to: (tmp = {}),
						on: v,
					});
				return tmp;
			}
			function sorta(k) {
				this.to[k] = this.on[k];
			}
			var say = (mesh.say = function (msg, peer) {
				var tmp;
				if ((tmp = this) && (tmp = tmp.to) && tmp.next) {
					tmp.next(msg);
				} // compatible with middleware adapters.
				if (!msg) {
					return false;
				}
				var id;
				var hash;
				var raw;
				var ack = msg["@"];
				//if(opt.super && (!ack || !msg.put)){ return } // TODO: MANHATTAN STUB //OBVIOUSLY BUG! But squelch relay. // :( get only is 100%+ CPU usage :(
				var meta = msg._ || (msg._ = () => {});
				var DBG = msg.DBG;
				var S = +new Date();
				meta.y = meta.y || S;
				if (!peer) {
					DBG && (DBG.y = S);
				}
				if (!(id = msg["#"])) {
					id = msg["#"] = __usable_globalThis.stringRandom(9);
				}
				!loop && dup_track(id); //.it = it(msg); // track for 9 seconds, default. Earth<->Mars would need more! // always track, maybe move this to the 'after' logic if we split function.
				//if(msg.put && (msg.err || (dup.s[id]||'').err)){ return false } // TODO: in theory we should not be able to stun a message, but for now going to check if it can help network performance preventing invalid data to relay.
				if (!(hash = msg["##"]) && undefined !== msg.put && !meta.via && ack) {
					mesh.hash(msg, peer);
					return;
				} // TODO: Should broadcasts be hashed?
				if (!peer && ack) {
					peer =
						((tmp = dup.s[ack]) &&
							(tmp.via || ((tmp = tmp.it) && (tmp = tmp._) && tmp.via))) ||
						((tmp = mesh.last) && ack === tmp["#"] && mesh.leap);
				} // warning! mesh.leap could be buggy! mesh last check reduces this. // TODO: CLEAN UP THIS LINE NOW? `.it` should be reliable.
				if (!peer && ack) {
					// still no peer, then ack daisy chain 'tunnel' got lost.
					if (dup.s[ack]) {
						return;
					} // in dups but no peer hints that this was ack to ourself, ignore.
					__usable_globalThis.debug.STAT &&
						__usable_globalThis.debug.STAT(
							+new Date(),
							++SMIA,
							"total no peer to ack to",
						); // TODO: Delete this now. Dropping lost ACKs is protocol fine now.
					return false;
				} // TODO: Temporary? If ack via trace has been lost, acks will go to all peers, which trashes browser bandwidth. Not relaying the ack will force sender to ask for ack again. Note, this is technically wrong for mesh behavior.
				if (ack && !msg.put && !hash && ((dup.s[ack] || "").it || "")["##"]) {
					return false;
				} // If we're saying 'not found' but a relay had data, do not bother sending our not found. // Is this correct, return false? // NOTE: ADD PANIC TEST FOR THIS!
				if (!peer && mesh.way) {
					return mesh.way(msg);
				}
				DBG && (DBG.yh = +new Date());
				if (!(raw = meta.raw)) {
					mesh.raw(msg, peer);
					return;
				}
				DBG && (DBG.yr = +new Date());
				if (!peer || !peer.id) {
					if (!__usable_globalThis.objectPlain(peer || opt.peers)) {
						return false;
					}
					var S = +new Date();
					var P = opt.puff; // TODO: .keys( is slow
					var ps = opt.peers;
					var pl = Object.keys(peer || opt.peers || {});
					__usable_globalThis.debug.STAT &&
						__usable_globalThis.debug.STAT(S, +new Date() - S, "peer keys");
					(function go() {
						var S = +new Date();
						//Type.obj.map(peer || opt.peers, each); // in case peer is a peer list.
						loop = 1;
						var wr = meta.raw;
						meta.raw = raw; // quick perf hack
						var i = 0;
						var p;
						while (i < 9 && (p = (pl || "")[i++])) {
							if (!(p = ps[p] || (peer || "")[p])) {
								continue;
							}
							mesh.say(msg, p);
						}
						meta.raw = wr;
						loop = 0;
						pl = pl.slice(i); // slicing after is faster than shifting during.
						__usable_globalThis.debug.STAT &&
							__usable_globalThis.debug.STAT(S, +new Date() - S, "say loop");
						if (!pl.length) {
							return;
						}
						puff(go, 0);
						ack && dup_track(ack); // keep for later
					})();

					return;
				}
				// TODO: PERF: consider splitting function here, so say loops do less work.
				if (!peer.wire && mesh.wire) {
					mesh.wire(peer);
				}
				if (id === peer.last) {
					return;
				}
				peer.last = id; // was it just sent?
				if (peer === meta.via) {
					return false;
				} // don't send back to self.
				if (
					(tmp = meta.yo) &&
					(tmp[peer.url] || tmp[peer.pid] || tmp[peer.id]) /*&& !o*/
				) {
					return false;
				}
				__usable_globalThis.debug.STAT &&
					__usable_globalThis.debug.STAT(
						S,
						((DBG || meta).yp = +new Date()) - (meta.y || S),
						"say prep",
					);
				!loop && ack && dup_track(ack); // streaming long responses needs to keep alive the ack.
				if (peer.batch) {
					peer.tail = (tmp = peer.tail || 0) + raw.length;
					if (peer.tail <= opt.pack) {
						peer.batch += (tmp ? "," : "") + raw;
						return;
					}
					flush(peer);
				}
				peer.batch = "["; // Prevents double JSON!
				var ST = +new Date();
				setTimeout(() => {
					__usable_globalThis.debug.STAT &&
						__usable_globalThis.debug.STAT(ST, +new Date() - ST, "0ms TO");
					flush(peer);
				}, opt.gap); // TODO: queuing/batching might be bad for low-latency video game performance! Allow opt out?
				send(raw, peer);
				__usable_globalThis.debug.STAT &&
					ack === peer.SI &&
					__usable_globalThis.debug.STAT(S, +new Date() - peer.SH, "say ack");
			});
			mesh.say.c = mesh.say.d = 0;
			// TODO: this caused a out-of-memory crash!
			mesh.raw = (msg, peer) => {
				// TODO: Clean this up / delete it / move logic out!
				if (!msg) {
					return "";
				}
				var meta = msg._ || {};
				var put;
				var tmp;
				if ((tmp = meta.raw)) {
					return tmp;
				}
				if ("string" == typeof msg) {
					return msg;
				}
				var hash = msg["##"];
				var ack = msg["@"];
				if (hash && ack) {
					if (!meta.via && dup_check(ack + hash)) {
						return false;
					} // for our own out messages, memory & storage may ack the same thing, so dedup that. Tho if via another peer, we already tracked it upon hearing, so this will always trigger false positives, so don't do that!
					if ((tmp = (dup.s[ack] || "").it)) {
						if (hash === tmp["##"]) {
							return false;
						} // if ask has a matching hash, acking is optional.
						if (!tmp["##"]) {
							tmp["##"] = hash;
						} // if none, add our hash to ask so anyone we relay to can dedup. // NOTE: May only check against 1st ack chunk, 2nd+ won't know and still stream back to relaying peers which may then dedup. Any way to fix this wasted bandwidth? I guess force rate limiting breaking change, that asking peer has to ask for next lexical chunk.
					}
				}

				if (!msg.dam && !msg["@"]) {
					var i = 0;
					var to = [];
					tmp = opt.peers;
					for (var k in tmp) {
						var p = tmp[k]; // TODO: Make it up peers instead!
						to.push(p.url || p.pid || p.id);
						if (++i > 6) {
							break;
						}
					}
					if (i > 1) {
						msg["><"] = to.join();
					} // TODO: BUG! This gets set regardless of peers sent to! Detect?
				}

				if (msg.put && (tmp = msg.ok)) {
					msg.ok = {
						"@": (tmp["@"] || 1) - 1,
						"/": tmp["/"] == msg._.near ? mesh.near : tmp["/"],
					};
				}
				if ((put = meta.$put)) {
					tmp = {};
					Object.keys(msg).forEach((k) => {
						tmp[k] = msg[k];
					});
					tmp.put = ":])([:";
					json(tmp, (err, raw) => {
						if (err) {
							return;
						} // TODO: Handle!!
						var S = +new Date();
						tmp = raw.indexOf('"put":":])([:"');
						res(
							undefined,
							(raw = raw.slice(0, tmp + 6) + put + raw.slice(tmp + 14)),
						);
						__usable_globalThis.debug.STAT &&
							__usable_globalThis.debug.STAT(S, +new Date() - S, "say slice");
					});
					return;
				}
				json(msg, res);
				function res(err, raw) {
					if (err) {
						return;
					} // TODO: Handle!!
					meta.raw = raw; //if(meta && (raw||'').length < (999 * 99)){ meta.raw = raw } // HNPERF: If string too big, don't keep in memory.
					mesh.say(msg, peer);
				}
			};
		})();
		function flush(peer) {
			var tmp = peer.batch;
			var t = "string" == typeof tmp;
			var l;
			if (t) {
				tmp += "]";
			} // TODO: Prevent double JSON!
			peer.batch = peer.tail = null;
			if (!tmp) {
				return;
			}
			if (t ? 3 > tmp.length : !tmp.length) {
				return;
			} // TODO: ^
			if (!t) {
				try {
					tmp = 1 === tmp.length ? tmp[0] : JSON.stringify(tmp);
				} catch (e) {
					return opt.log("DAM JSON stringify error", e);
				}
			}
			if (!tmp) {
				return;
			}
			send(tmp, peer);
		}
		// for now - find better place later.
		function send(raw, peer) {
			try {
				var wire = peer.wire;
				if (peer.say) {
					peer.say(raw);
				} else if (wire.send) {
					wire.send(raw);
				}
				mesh.say.d += raw.length || 0;
				++mesh.say.c; // STATS!
			} catch (e) {
				(peer.queue = peer.queue || []).push(raw);
			}
		}
		mesh.near = 0;
		mesh.hi = (peer) => {
			var wire = peer.wire;
			var tmp;
			if (!wire) {
				mesh.wire(
					(peer.length && {
						url: peer,
						id: peer,
					}) ||
						peer,
				);
				return;
			}
			if (peer.id) {
				opt.peers[peer.url || peer.id] = peer;
			} else {
				tmp = peer.id =
					peer.id || peer.url || __usable_globalThis.stringRandom(9);
				mesh.say(
					{
						dam: "?",
						pid: root.opt.pid,
					},
					(opt.peers[tmp] = peer),
				);
				delete dup.s[peer.last]; // IMPORTANT: see https://gun.eco/docs/DAM#self
			}

			if (!peer.met) {
				mesh.near++;
				peer.met = +new Date();
				root.on("hi", peer);
			}
			// @rogowski I need this here by default for now to fix go1dfish's bug
			tmp = peer.queue;
			peer.queue = [];
			__usable_globalThis.settimeoutEach(
				tmp || [],
				(msg) => {
					send(msg, peer);
				},
				0,
				9,
			);
			//Type.obj.native && Type.obj.native(); // dirty place to check if other JS polluted.
		};

		mesh.bye = (peer) => {
			peer.met && --mesh.near;
			delete peer.met;
			root.on("bye", peer);
			var tmp = +new Date();
			tmp = tmp - (peer.met || tmp);
			mesh.bye.time = ((mesh.bye.time || tmp) + tmp) / 2;
		};
		mesh.hear["!"] = (msg, peer) => {
			opt.log("Error:", msg.err);
		};
		mesh.hear["?"] = (msg, peer) => {
			if (msg.pid) {
				if (!peer.pid) {
					peer.pid = msg.pid;
				}
				if (msg["@"]) {
					return;
				}
			}
			mesh.say(
				{
					dam: "?",
					pid: opt.pid,
					"@": msg["#"],
				},
				peer,
			);
			delete dup.s[peer.last]; // IMPORTANT: see https://gun.eco/docs/DAM#self
		};

		mesh.hear["mob"] = (msg, peer) => {
			// NOTE: AXE will overload this with better logic.
			if (!msg.peers) {
				return;
			}
			var peers = Object.keys(msg.peers);
			var one = peers[(__usable_globalThis.mathRandom() * peers.length) >> 0];
			if (!one) {
				return;
			}
			mesh.bye(peer);
			mesh.hi(one);
		};
		root.on("create", function (root) {
			root.opt.pid = root.opt.pid || __usable_globalThis.stringRandom(9);
			this.to.next(root);
			root.on("out", mesh.say);
		});
		root.on("bye", function (peer, tmp) {
			peer = opt.peers[peer.id || peer] || peer;
			this.to.next(peer);
			peer.bye ? peer.bye() : (tmp = peer.wire) && tmp.close && tmp.close();
			delete opt.peers[peer.id];
			peer.wire = null;
		});
		var gets = {};
		root.on("bye", function (peer, tmp) {
			this.to.next(peer);
			if ((tmp = __usable_globalThis.debug.STAT)) {
				tmp.peers = mesh.near;
			}
			if (!(tmp = peer.url)) {
				return;
			}
			gets[tmp] = true;
			setTimeout(() => {
				delete gets[tmp];
			}, opt.lack || 9000);
		});
		root.on("hi", function (peer, tmp) {
			this.to.next(peer);
			if ((tmp = __usable_globalThis.debug.STAT)) {
				tmp.peers = mesh.near;
			}
			if (opt.super) {
				return;
			} // temporary (?) until we have better fix/solution?
			var souls = Object.keys(root.next || ""); // TODO: .keys( is slow
			if (souls.length > 9999 && !__usable_globalThis.debug.SUBS) {
				__usable_globalThis.debug.log(
					(__usable_globalThis.debug.SUBS =
						"Warning: You have more than 10K live GETs, which might use more bandwidth than your screen can show - consider `.off()`."),
				);
			}
			__usable_globalThis.settimeoutEach(souls, (soul) => {
				var node = root.next[soul];
				if (opt.super || (node.ask || "")[""]) {
					mesh.say(
						{
							get: {
								"#": soul,
							},
						},
						peer,
					);
					return;
				}
				__usable_globalThis.settimeoutEach(
					Object.keys(node.ask || ""),
					(key) => {
						if (!key) {
							return;
						}
						// is the lack of ## a !onion hint?
						mesh.say(
							{
								"##": __usable_globalThis.stringHash(
									(root.graph[soul] || "")[key],
								),
								get: {
									"#": soul,
									".": key,
								},
							},
							peer,
						);
						// TODO: Switch this so Book could route?
					},
				);
			});
		});

		return mesh;
	}
	try {
		__usable_module.exports = Mesh;
	} catch (e) {}
	__usable_environment.exports.gun.mesh = __usable_module.exports;
	return __usable_module.exports;
}
