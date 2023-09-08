import userPlugin from "./user.js";
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

	/* BEGIN WRAPPED GUN CODE */

	var User = userPlugin(__usable_environment);

	var SEA = User.SEA;
	var Gun = User.GUN;
	var noop = () => {};
	User.prototype.pair = function () {
		var user = this; // undeprecated, hiding with proxies.
		var proxy;
		try {
			proxy = new Proxy(
				{
					DANGER: "\u2620",
				},
				{
					get(t, p) {
						if (!user.is || !(user._ || "").sea) {
							return;
						}
						return user._.sea[p];
					},
				},
			);
		} catch (e) {}
		return proxy;
	};
	// If authenticated user wants to delete his/her account, let's support it!
	User.prototype.delete = async function (alias, pass, cb) {
		__usable_globalThis.debug.log(
			"user.delete() IS DEPRECATED AND WILL BE MOVED TO A MODULE!!!",
		);
		var gun = this;
		var root = gun.back(-1);
		var user = gun.back("user");
		try {
			user.auth(alias, pass, () => {
				(user.is || {}).pub; // Delete user data
				user.map().once(function () {
					this.put(null);
				});
				// Wipe user data from memory
				user.leave();
				(cb || noop)({
					ok: 0,
				});
			});
		} catch (e) {
			Gun.log("User.delete failed! Error:", e);
		}
		return gun;
	};
	User.prototype.alive = async function () {
		__usable_globalThis.debug.log("user.alive() IS DEPRECATED!!!");
		const gunRoot = this.back(-1);
		try {
			// All is good. Should we do something more with actual recalled data?
			await __usable_globalThis.authRecall(gunRoot);
			return gunRoot._.user._;
		} catch (e) {
			const err = "No session!";
			Gun.log(err);
			throw {
				err,
			};
		}
	};
	User.prototype.trust = async (user) => {
		__usable_globalThis.debug.log(
			"`.trust` API MAY BE DELETED OR CHANGED OR RENAMED, DO NOT USE!",
		);
		// TODO: BUG!!! SEA `node` read listener needs to be async, which means core needs to be async too.
		//gun.get('alice').get('age').trust(bob);
		if (Gun.is(user)) {
			user.get("pub").get((ctx, ev) => {
				__usable_globalThis.debug.log(ctx, ev);
			});
		}
		user
			.get("trust")
			.get(__usable_globalThis.path)
			.put(__usable_globalThis.theirPubkey);

		// do a lookup on this gun chain directly (that gets bob's copy of the data)
		// do a lookup on the metadata trust table for this path (that gets all the pubkeys allowed to write on this path)
		// do a lookup on each of those pubKeys ON the path (to get the collab data "layers")
		// THEN you perform Jachen's mix operation
		// and return the result of that to...
	};

	User.prototype.grant = function (to, cb) {
		__usable_globalThis.debug.log(
			"`.grant` API MAY BE DELETED OR CHANGED OR RENAMED, DO NOT USE!",
		);
		var gun = this;
		var user = gun.back(-1).user();
		var pair = user._.sea;
		var path = "";
		gun.back((at) => {
			if (at.is) {
				return;
			}
			path += at.get || "";
		});
		(async () => {
			var enc;
			var sec = await user.get("grant").get(pair.pub).get(path).then();
			sec = await SEA.decrypt(sec, pair);
			if (!sec) {
				sec = SEA.random(16).toString();
				enc = await SEA.encrypt(sec, pair);
				user.get("grant").get(pair.pub).get(path).put(enc);
			}
			var pub = to.get("pub").then();
			var epub = to.get("epub").then();
			pub = await pub;
			epub = await epub;
			var dh = await SEA.secret(epub, pair);
			enc = await SEA.encrypt(sec, dh);
			user.get("grant").get(pub).get(path).put(enc, cb);
		})();
		return gun;
	};
	User.prototype.secret = function (data, cb) {
		__usable_globalThis.debug.log(
			"`.secret` API MAY BE DELETED OR CHANGED OR RENAMED, DO NOT USE!",
		);
		var gun = this;
		var user = gun.back(-1).user();
		var pair = user.pair();
		var path = "";
		gun.back((at) => {
			if (at.is) {
				return;
			}
			path += at.get || "";
		});
		(async () => {
			var enc;
			var sec = await user.get("trust").get(pair.pub).get(path).then();
			sec = await SEA.decrypt(sec, pair);
			if (!sec) {
				sec = SEA.random(16).toString();
				enc = await SEA.encrypt(sec, pair);
				user.get("trust").get(pair.pub).get(path).put(enc);
			}
			enc = await SEA.encrypt(data, sec);
			gun.put(enc, cb);
		})();
		return gun;
	};

	/**
   * returns the decrypted value, encrypted by secret
   * @returns {Promise<any>}
   // Mark needs to review 1st before officially supported
  User.prototype.decrypt = function(cb) {
    let gun = this,
      path = ''
    gun.back(function(at) {
      if (at.is) {
        return
      }
      path += at.get || ''
    })
    return gun
      .then(async data => {
        if (data == null) {
          return
        }
        const user = gun.back(-1).user()
        const pair = user.pair()
        let sec = await user
          .get('trust')
          .get(pair.pub)
          .get(path)
        sec = await SEA.decrypt(sec, pair)
        if (!sec) {
          return data
        }
        let decrypted = await SEA.decrypt(data, sec)
        return decrypted
      })
      .then(res => {
        cb && cb(res)
        return res
      })
  }
  */
	__usable_module.exports = User;
	__usable_environment.exports.sea.share = __usable_module.exports;
	return __usable_module.exports;
}
