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
	/* BEGIN WRAPPED GUN CODE */ // Shim for generic javascript utilities.
	mathRandomPlugin(__usable_environment);
	__usable_globalThis.stringRandom = (l, c) => {
		var s = "";
		l = l || 24; // you are not going to make a 0 length random number, so no need to check type
		c = c || "0123456789ABCDEFGHIJKLMNOPQRSTUVWXZabcdefghijklmnopqrstuvwxyz";
		while (l-- > 0) {
			s += c.charAt(Math.floor(__usable_globalThis.mathRandom() * c.length));
		}
		return s;
	};
	__usable_globalThis.stringMatch = (t, o) => {
		var tmp;
		if ("string" !== typeof t) {
			return false;
		}
		if ("string" == typeof o) {
			o = {
				"=": o,
			};
		}
		o = o || {};
		tmp = o["="] || o["*"] || o[">"] || o["<"];
		if (t === tmp) {
			return true;
		}
		if (undefined !== o["="]) {
			return false;
		}
		tmp = o["*"] || o[">"];
		if (t.slice(0, (tmp || "").length) === tmp) {
			return true;
		}
		if (undefined !== o["*"]) {
			return false;
		}
		if (undefined !== o[">"] && undefined !== o["<"]) {
			return t >= o[">"] && t <= o["<"] ? true : false;
		}
		if (undefined !== o[">"] && t >= o[">"]) {
			return true;
		}
		if (undefined !== o["<"] && t <= o["<"]) {
			return true;
		}
		return false;
	};
	__usable_globalThis.stringHash = (s, c) => {
		// via SO
		if (typeof s !== "string") {
			return;
		}
		c = c || 0; // CPU schedule hashing by
		if (!s.length) {
			return c;
		}
		for (var i = 0, l = s.length, n; i < l; ++i) {
			n = s.charCodeAt(i);
			c = (c << 5) - c + n;
			c |= 0;
		}
		return c;
	};
	var has = Object.prototype.hasOwnProperty;
	__usable_globalThis.objectPlain = (o) =>
		o
			? (o instanceof Object && o.constructor === Object) ||
			  Object.prototype.toString.call(o).match(/^\[object (\w+)\]$/)[1] ===
					"Object"
			: false;
	__usable_globalThis.objectEmpty = (o, n) => {
		for (var k in o) {
			if (has.call(o, k) && (!n || -1 == n.indexOf(k))) {
				return false;
			}
		}
		return true;
	};
	(() => {
		var l = 0;
		var c = 0;

		var _setImmediate =
			(typeof __usable_globalThis.setImmediate !== "undefined" &&
				__usable_globalThis.setImmediate) ||
			((c, f) => {
				if (typeof MessageChannel == "undefined") {
					return setTimeout;
				}
				(c = new MessageChannel()).port1.onmessage = (e) => {
					"" == e.data && f();
				};
				return (q) => {
					f = q;
					c.port2.postMessage("");
				};
			})();

		var check = (__usable_globalThis.settimeoutCheck =
			__usable_globalThis.settimeoutCheck ||
				(typeof performance !== "undefined" && performance) || {
					now() {
						return +new Date();
					},
				});

		__usable_globalThis.settimeoutHold =
			__usable_globalThis.settimeoutHold || 9; // half a frame benchmarks faster than < 1ms?
		__usable_globalThis.settimeoutPoll =
			__usable_globalThis.settimeoutPoll ||
			((f) => {
				if (
					__usable_globalThis.settimeoutHold >= check.now() - l &&
					c++ < 3333
				) {
					f();
					return;
				}
				_setImmediate(
					() => {
						l = check.now();
						f();
					},
					(c = 0),
				);
			});
	})();
	(() => {
		// Too many polls block, this "threads" them in turns over a single thread in time.
		var t = (__usable_globalThis.settimeoutTurn =
			__usable_globalThis.settimeoutTurn ||
			((f) => {
				1 == s.push(f) && p(T);
			}));

		var s = (t.s = []);
		var p = __usable_globalThis.settimeoutPoll;
		var i = 0;
		var f;

		var T = () => {
			if ((f = s[i++])) {
				f();
			}
			if (i == s.length || 99 == i) {
				s = t.s = s.slice(i);
				i = 0;
			}
			if (s.length) {
				p(T);
			}
		};
	})();
	(() => {
		var T = __usable_globalThis.settimeoutTurn;
		(__usable_globalThis.settimeoutEach =
			__usable_globalThis.settimeoutEach ||
			((l, f, e, S) => {
				S = S || 9;
				(function t(s, L, r) {
					if ((L = (s = (l || []).splice(0, S)).length)) {
						for (var i = 0; i < L; i++) {
							if (undefined !== (r = f(s[i]))) {
								break;
							}
						}
						if (undefined === r) {
							T(t);
							return;
						}
					}
					e && e(r);
				})();
			}))();
	})();
	return;
}
