import userPlugin from "./user.js";
let __usable_isActivated = false;
export default function (__usable_environment) {
	if (__usable_isActivated) return;
	__usable_isActivated = true;

	/* BEGIN WRAPPED GUN CODE */

	var User = userPlugin(__usable_environment);

	var SEA = User.SEA;
	var Gun = User.GUN;
	User.prototype.recall = function (opt, cb) {
		var gun = this;
		var root = gun.back(-1);
		opt = opt || {};
		if (opt && opt.sessionStorage) {
			if (SEA.window) {
				try {
					var sS = {};
					sS = SEA.window.sessionStorage; // TODO: FIX BUG putting on `.is`!
					if (sS) {
						root._.opt.remember = true;
						(gun.back("user")._.opt || opt).remember = true;
						if (sS.recall || sS.pair) root.user().auth(JSON.parse(sS.pair), cb); // pair is more reliable than alias/pass
					}
				} catch (e) {}
			}
			return gun;
		}
		/*
      TODO: copy mhelander's expiry code back in.
      Although, we should check with community,
      should expiry be core or a plugin?
    */
		return gun;
	};
}
