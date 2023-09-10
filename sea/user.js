import seaPlugin from "./sea.js";
import gunPlugin from "../gun.js";
let __usable_isActivated = false;
const __usable_module = {};
export default function (__usable_environment) {
	if (__usable_isActivated) return __usable_module.exports;
	__usable_isActivated = true;

	/* BEGIN WRAPPED GUN CODE */

	var SEA = seaPlugin(__usable_environment);

	var Gun;
	if (SEA.window) {
		Gun = SEA.window.GUN || {
			chain: {},
		};
	} else {
		Gun = gunPlugin(__usable_environment);
	}
	SEA.GUN = Gun;
	function User(root) {
		this._ = {
			$: this,
		};
	}
	User.prototype = (() => {
		function F() {}
		F.prototype = Gun.chain;
		return new F();
	})(); // Object.create polyfill
	User.prototype.constructor = User;

	// let's extend the gun chain with a `user` function.
	// only one user can be logged in at a time, per gun instance.
	Gun.chain.user = function (pub) {
		var gun = this;
		var root = gun.back(-1);
		var user;
		if (pub) {
			pub = SEA.opt.pub((pub._ || "")["#"]) || pub;
			return root.get("~" + pub);
		}
		if ((user = root.back("user"))) {
			return user;
		}
		var root = root._;
		var at = root;
		var uuid = at.opt.uuid || lex;
		(at = (user = at.user = gun.chain(new User()))._).opt = {};
		at.opt.uuid = (cb) => {
			var id = uuid();
			var pub = root.user;
			if (!pub || !(pub = pub.is) || !(pub = pub.pub)) {
				return id;
			}
			id = "~" + pub + "/" + id;
			if (cb && cb.call) {
				cb(null, id);
			}
			return id;
		};
		return user;
	};
	function lex() {
		return Gun.state().toString(36).replace(".", "");
	}
	Gun.User = User;
	User.GUN = Gun;
	User.SEA = Gun.SEA = SEA;
	__usable_module.exports = User;
	__usable_environment.exports.sea.user = __usable_module.exports;
	return __usable_module.exports;
}
