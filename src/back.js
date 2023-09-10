import rootPlugin from "./root.js";
let __usable_isActivated = false;
export default function (__usable_environment) {
	if (__usable_isActivated) return;
	__usable_isActivated = true;
	/* BEGIN WRAPPED GUN CODE */

	var Gun = rootPlugin(__usable_environment);
	Gun.chain.back = function (n, opt) {
		var tmp;
		n = n || 1;
		if (-1 === n || Infinity === n) {
			return this._.root.$;
		} else if (1 === n) {
			return (this._.back || this._).$;
		}
		var gun = this;
		var at = gun._;
		if (typeof n === "string") {
			n = n.split(".");
		}
		if (n instanceof Array) {
			var i = 0;
			var l = n.length;
			var tmp = at;
			for (i; i < l; i++) {
				tmp = (tmp || empty)[n[i]];
			}
			if (undefined !== tmp) {
				return opt ? gun : tmp;
			} else if ((tmp = at.back)) {
				return tmp.$.back(n, opt);
			}
			return;
		}
		if ("function" == typeof n) {
			var yes;

			var tmp = {
				back: at,
			};

			while ((tmp = tmp.back) && undefined === (yes = n(tmp, opt))) {}
			return yes;
		}
		if ("number" == typeof n) {
			return (at.back || at).$.back(n - 1);
		}
		return this;
	};
	var empty = {};
}
