import rootPlugin from "./root.js";
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
	//TODO: implement require and dirname
	/* BEGIN WRAPPED GUN CODE */
	var Gun = rootPlugin(__usable_environment);
	Gun.chain.get = function (key, cb, as) {
		var gun;
		var tmp;
		if (typeof key === "string") {
			if (key.length == 0) {
				(gun = this.chain())._.err = {
					err: Gun.log("0 length key!", key),
				};
				if (cb) {
					cb.call(gun, gun._.err);
				}
				return gun;
			}
			var back = this;
			var cat = back._;
			var next = cat.next || empty;
			if (!(gun = next[key])) {
				gun = key && cache(key, back);
			}
			gun = gun && gun.$;
		} else if ("function" == typeof key) {
			if (true === cb) {
				return soul(this, key, cb, as), this;
			}
			gun = this;
			var cat = gun._;
			var opt = cb || {};
			var root = cat.root;
			var id;
			opt.at = cat;
			opt.ok = key;
			var wait = {}; // can we assign this to the at instead, like in once?
			//var path = []; cat.$.back(at => { at.get && path.push(at.get.slice(0,9))}); path = path.reverse().join('.');
			function any(msg, eve, f) {
				if (any.stun) {
					return;
				}
				if ((tmp = root.pass) && !tmp[id]) {
					return;
				}
				var at = msg.$._;
				var sat = (msg.$ || "")._;
				var data = (sat || at).put;
				var odd = !at.has && !at.soul;
				var test = {};
				var link;
				var tmp;
				if (odd || undefined === data) {
					// handles non-core
					data =
						undefined === ((tmp = msg.put) || "")["="]
							? undefined === (tmp || "")[":"]
								? tmp
								: tmp[":"]
							: tmp["="];
				}
				if ((link = "string" == typeof (tmp = Gun.valid(data)))) {
					data =
						undefined === (tmp = root.$.get(tmp)._.put)
							? opt.not
								? undefined
								: data
							: tmp;
				}
				if (opt.not && undefined === data) {
					return;
				}
				if (undefined === opt.stun) {
					if ((tmp = root.stun) && tmp.on) {
						cat.$.back((a) => {
							// our chain stunned?
							tmp.on("" + a.id, (test = {}));
							if ((test.run || 0) < any.id) {
								return test;
							} // if there is an earlier stun on gapless parents/self.
						});

						!test.run && tmp.on("" + at.id, (test = {})); // this node stunned?
						!test.run && sat && tmp.on("" + sat.id, (test = {})); // linked node stunned?
						if (any.id > test.run) {
							if (!test.stun || test.stun.end) {
								test.stun = tmp.on("stun");
								test.stun = test.stun && test.stun.last;
							}
							if (test.stun && !test.stun.end) {
								//if(odd && u === data){ return }
								//if(u === msg.put){ return } // "not found" acks will be found if there is stun, so ignore these.
								(test.stun.add || (test.stun.add = {}))[id] = () => {
									any(msg, eve, 1);
								}; // add ourself to the stun callback list that is called at end of the write.
								return;
							}
						}
					}
					if (/*odd &&*/ undefined === data) {
						f = 0;
					} // if data not found, keep waiting/trying.
					/*if(f && u === data){
          	cat.on('out', opt.out);
          	return;
          }*/
					if ((tmp = root.hatch) && !tmp.end && undefined === opt.hatch && !f) {
						// quick hack! // What's going on here? Because data is streamed, we get things one by one, but a lot of developers would rather get a callback after each batch instead, so this does that by creating a wait list per chain id that is then called at the end of the batch by the hatch code in the root put listener.
						if (wait[at.$._.id]) {
							return;
						}
						wait[at.$._.id] = 1;
						tmp.push(() => {
							any(msg, eve, 1);
						});
						return;
					}
					wait = {}; // end quick hack.
				}
				// call:
				if (root.pass) {
					if (root.pass[id + at.id]) {
						return;
					}
					root.pass[id + at.id] = 1;
				}
				if (opt.on) {
					opt.ok.call(at.$, data, at.get, msg, eve || any);
					return;
				} // TODO: Also consider breaking `this` since a lot of people do `=>` these days and `.call(` has slower performance.
				if (opt.v2020) {
					opt.ok(msg, eve || any);
					return;
				}
				Object.keys(msg).forEach(
					(k) => {
						tmp[k] = msg[k];
					},
					(tmp = {}),
				);
				msg = tmp;
				msg.put = data; // 2019 COMPATIBILITY! TODO: GET RID OF THIS!
				opt.ok.call(opt.as, msg, eve || any); // is this the right
			}

			any.at = cat;
			//(cat.any||(cat.any=function(msg){ setTimeout.each(Object.keys(cat.any||''), function(act){ (act = cat.any[act]) && act(msg) },0,99) }))[id = String.random(7)] = any; // maybe switch to this in future?
			(cat.any || (cat.any = {}))[(id = __usable_globalThis.stringRandom(7))] =
				any;
			any.off = () => {
				any.stun = 1;
				if (!cat.any) {
					return;
				}
				delete cat.any[id];
			};
			any.rid = rid; // logic from old version, can we clean it up now?
			any.id = opt.run || ++root.once; // used in callback to check if we are earlier than a write. // will this ever cause an integer overflow?
			tmp = root.pass;
			(root.pass = {})[id] = 1; // Explanation: test trade-offs want to prevent recursion so we add/remove pass flag as it gets fulfilled to not repeat, however map map needs many pass flags - how do we reconcile?
			opt.out = opt.out || {
				get: {},
			};
			cat.on("out", opt.out);
			root.pass = tmp;
			return gun;
		} else if ("number" == typeof key) {
			return this.get("" + key, cb, as);
		} else if ("string" == typeof (tmp = valid(key))) {
			return this.get(tmp, cb, as);
		} else if ((tmp = this.get.next)) {
			gun = tmp(this, key);
		}
		if (!gun) {
			(gun = this.chain())._.err = {
				err: Gun.log("Invalid get request!", key),
			}; // CLEAN UP
			if (cb) {
				cb.call(gun, gun._.err);
			}
			return gun;
		}
		if (cb && "function" == typeof cb) {
			gun.get(cb, as);
		}
		return gun;
	};
	function cache(key, back) {
		var cat = back._;
		var next = cat.next;
		var gun = back.chain();
		var at = gun._;
		if (!next) {
			next = cat.next = {};
		}
		next[(at.get = key)] = at;
		if (back === cat.root.$) {
			at.soul = key;
			//at.put = {};
		} else if (cat.soul || cat.has) {
			at.has = key;
			//if(obj_has(cat.put, key)){
			//at.put = cat.put[key];
			//}
		}

		return at;
	}
	function soul(gun, cb, opt, as) {
		var cat = gun._;
		var acks = 0;
		var tmp;
		if ((tmp = cat.soul || cat.link)) {
			return cb(tmp, as, cat);
		}
		if (cat.jam) {
			return cat.jam.push([cb, as]);
		}
		cat.jam = [[cb, as]];
		gun.get(
			(msg, eve) => {
				if (
					undefined === msg.put &&
					!cat.root.opt.super &&
					(tmp = Object.keys(cat.root.opt.peers).length) &&
					++acks <= tmp
				) {
					// TODO: super should not be in core code, bring AXE up into core instead to fix? // TODO: .keys( is slow
					return;
				}
				eve.rid(msg);
				var at = ((at = msg.$) && at._) || {};
				var i = 0;
				var as;
				tmp = cat.jam;
				delete cat.jam; // tmp = cat.jam.splice(0, 100);
				//if(tmp.length){ process.nextTick(function(){ go(msg, eve) }) }
				while ((as = tmp[i++])) {
					//Gun.obj.map(tmp, function(as, cb){
					var cb = as[0];

					var id;
					as = as[1];
					cb &&
						cb(
							(id =
								at.link ||
								at.soul ||
								Gun.valid(msg.put) ||
								((msg.put || {})._ || {})["#"]),
							as,
							msg,
							eve,
						);
				} //);
			},
			{
				out: {
					get: {
						".": true,
					},
				},
			},
		);
		return gun;
	}
	function rid(at) {
		var cat = this.at || this.on;
		if (!at || cat.soul || cat.has) {
			return this.off();
		}
		if (!(at = (at = (at = at.$ || at)._ || at).id)) {
			return;
		}
		var map = cat.map;
		var tmp;
		var seen;
		//if(!map || !(tmp = map[at]) || !(tmp = tmp.at)){ return }
		if ((tmp = (seen = this.seen || (this.seen = {}))[at])) {
			return true;
		}
		seen[at] = true;

		//tmp.echo[cat.id] = {}; // TODO: Warning: This unsubscribes ALL of this chain's listeners from this link, not just the one callback event.
		//obj.del(map, at); // TODO: Warning: This unsubscribes ALL of this chain's listeners from this link, not just the one callback event.
	}

	var empty = {};
	var valid = Gun.valid;
}
