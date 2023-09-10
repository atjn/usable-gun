import gunPlugin from "../gun.js";
let __usable_isActivated = false;
export default function (__usable_environment) {
	if (__usable_isActivated) return;
	__usable_isActivated = true;
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

	((Gun, undefined) => {
		/**
		 *
		 *  credits:
		 *      github:bmatusiak
		 *
		 */
		var lex = (gun) => {
			function Lex() {}
			Lex.prototype = Object.create(Object.prototype, {
				constructor: {
					value: Lex,
				},
			});
			Lex.prototype.toString = function () {
				return JSON.stringify(this);
			};
			Lex.prototype.more = function (m) {
				this[">"] = m;
				return this;
			};
			Lex.prototype.less = function (le) {
				this["<"] = le;
				return this;
			};
			Lex.prototype.in = function () {
				var l = new Lex();
				this["."] = l;
				return l;
			};
			Lex.prototype.of = function () {
				var l = new Lex();
				this.hash(l);
				return l;
			};
			Lex.prototype.hash = function (h) {
				this["#"] = h;
				return this;
			};
			Lex.prototype.prefix = function (p) {
				this["*"] = p;
				return this;
			};
			Lex.prototype.return = function (r) {
				this["="] = r;
				return this;
			};
			Lex.prototype.limit = function (l) {
				this["%"] = l;
				return this;
			};
			Lex.prototype.reverse = function (rv) {
				this["-"] = rv || 1;
				return this;
			};
			Lex.prototype.includes = function (i) {
				this["+"] = i;
				return this;
			};
			Lex.prototype.map = function (...args) {
				return gun.map(this, ...args);
			};
			Lex.prototype.match = lex.match;
			return new Lex();
		};
		lex.match = function (t, o) {
			var tmp;
			o = o || this || {};
			if ("string" == typeof o) {
				o = {
					"=": o,
				};
			}
			if ("string" !== typeof t) {
				return false;
			}
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
		Gun.Lex = lex;
		Gun.chain.lex = function () {
			return lex(this);
		};
	})(
		typeof __usable_window !== "undefined"
			? __usable_window.Gun
			: gunPlugin(__usable_environment),
	);
}
